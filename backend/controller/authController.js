const mongoose = require("mongoose");
const User = require("../models/User");
const Conversation = require('../models/Conversation');
const otpGenerate = require("../utils/otpGenerator");
const response = require("../utils/responseHandler");
const sendEmailOtp = require("../services/emailServices");
const twilioService = require("../services/twilioService");
const generateToken = require("../utils/generateToken");
const{uploadImageToCloudinary} = require("../utils/imageUploader");
const io = require("../socket/socket").io;

const sendOtp = async (req, res) => {
  console.log("RAW BODY RECEIVED ===>", req.body);
  const { phoneNumber, phoneSuffix, email } = req.body;
  const otp = otpGenerate(); // 6 digit
  console.log(otp);
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry otp
  let user;

  try {
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = new User({ email });
      }

      user.emailOtp = String(otp);
      user.emailOtpExpiry = expiry;
      await user.save();

      await sendEmailOtp(email, otp).catch(console.error);;

      return response(res, 200, "OTP sent to your email successfully", {
        email,
      });
    }
    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, "Phone number and suffix are required");
    }

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({ phoneNumber, phoneSuffix });
    }

    await user.save();

    await twilioService.sendOtpToPhoneNumber(fullPhoneNumber);

    return response(res, 200, "OTP sent to phone successfully", {
      phoneNumber
    });

  } catch (error) {
    console.error("Error occurred while sending OTP:", error);
    return response(res, 500, "Internal server error");
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email, otp } = req.body;

  try {
    let user;

    if (email) {
      user = await User.findOne({ email });

      if (!user) return response(res, 404, "User not found");

      const now = new Date();

      console.log("Saved OTP:", user.emailOtp);
      console.log("Entered OTP:", otp);
      console.log("Expiry:", user.emailOtpExpiry);
      console.log("Now:", now);

      if (!user.emailOtp) {
        return response(res, 400, "OTP not generated");
      }

      if (String(user.emailOtp) !== String(otp)) {
        return response(res, 400, "Invalid OTP");
      }

      if (now > user.emailOtpExpiry) {
        return response(res, 400, "OTP expired");
      }

      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();
    }

    else {
      if (!phoneNumber || !phoneSuffix) {
        return response(res, 400, "Phone number is required");
      }

      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({ phoneNumber });

      if (!user) return response(res, 404, "User not found");

      const result = await twilioService.verifyOtpToPhoneNumber(
        fullPhoneNumber,
        otp
      );

      if (result.status !== "approved") {
        return response(res, 400, "Invalid OTP");
      }

      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(user._id);
    if (!token) {
  return response(res, 500, "Token generation failed");
}

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });

    return response(res, 200, "OTP verified successfully", {
      token,
      user
    });

  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return response(res, 500, "Internal server error");
  }
};

const updateProfile = async (req, res) => {
  const { username, agreed, about } = req.body;
  console.log("Decoded token from middleware:", req.user);

  const userId = req.user.userId;

  try {
    const profileUpdate = await User.findById(userId);
    console.log("updated profile is:", profileUpdate);

    // FIXED — multer.single() -> req.file (NOT req.files)
    if (req.file) {
      const uploadResults = await uploadImageToCloudinary(req.file);
      console.log(uploadResults);
      profileUpdate.profilePicture = uploadResults.secure_url;
    } 
    else if (req.body.profilePicture) {
      profileUpdate.profilePicture = req.body.profilePicture;
    }

    if (username) profileUpdate.userName = username;
    if (agreed) profileUpdate.agreed = agreed;
    if (about) profileUpdate.about = about;

    await profileUpdate.save();
    return response(res, 200, "User profile updated successfully", profileUpdate);

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};


const logout = async(req,res)=>{
  try{
    res.cookie("auth_token","",{expires:new Date(0)});
    return response(res,200,"User logged out successfully");
  }catch(error){
        console.error(error);
    return response(res, 500, "Internal server error");

  }
}


const checkAuthenticate = async(req,res)=>{
  try{
    const userId = req.user.userId;
    if(!userId){
      return response(res,404,"User unauthorised! please login")
    }
    const user = await User.findById(userId);
    if(!user){
      return response(res,404,"User not found");
    }
    return response(res,200,"User retrieved successfully and allowed to use chatus",user);
  }catch(error){
 console.error(error);
    return response(res, 500, "Internal server error");
  }

}


const getAllUsers = async (req, res) => {
  console.log("LOGGED IN USER ID:", req.user.userId);

  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.user.userId);

    // 1️⃣ Logged-in user with contacts
    const loggedInUser = await User.findById(loggedInUserId)
      .select("contacts")
      .lean();

    if (!loggedInUser) {
      return response(res, 404, "User not found");
    }
    console.log("Logged-in User Contacts:", loggedInUser);
    // 2️⃣ Contact user IDs
    const contactUserIds = loggedInUser.contacts.map(
      c => new mongoose.Types.ObjectId(c.user)
    );

    if (contactUserIds.length === 0) {
      return response(res, 200, "No contacts found", []);
    }

    // 3️⃣ Fetch only contact users
    const users = await User.find({
      _id: { $in: contactUserIds }
    })
      .select("userName profilePicture lastSeen isOnline about phoneSuffix phoneNumber")
      .lean();

    // 4️⃣ Attach conversation
    const usersWithConversation = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: {
            $all: [loggedInUserId, user._id],
            $size: 2 // 🔥 self-chat block
          }
        })
          .populate({
            path: "lastMessage",
            select: "content createdAt sender reciever"
          })
          .lean();

        return {
          ...user,
          conversation: conversation || null
        };
      })
    );

    return response(
      res,
      200,
      "Contact users retrieved successfully",
      usersWithConversation
    );

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};


const saveContact = async (req, res) => {
  const { userName, contact, email } = req.body || {};
  const userId = req.user.userId;

  if (!userName) {
    return response(res, 400, "Invalid contact data");
  }

  const query = {};
  if (contact) query.phoneNumber = contact;
  else if (email) query.email = email;

  try {
    const contactUser = await User.findOne(query);
    if (!contactUser) {
      return response(res, 404, "Contact user not found");
    }
  if (contactUser._id.toString() === userId.toString()) {
      return response(
        res,
        400,
        "You cannot save yourself as a contact"
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return response(res, 404, "User not found");
    }

    const alreadyExists = user.contacts.some(
      c => c.user.toString() === contactUser._id.toString()
    );

    if (alreadyExists) {
      return response(res, 409, "Contact already exists");
    }

    user.contacts.push({
      user: contactUser._id,
      savedName: userName
    });

    await user.save();
    return response(res, 200, "Contact saved successfully", user);

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};



module.exports = {
  sendOtp,
  verifyOtp,
  updateProfile,
  logout,
  checkAuthenticate,
  getAllUsers,
  saveContact
};
