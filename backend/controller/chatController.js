const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Conversation = require("../models/Conversation");
const response = require("../utils/responseHandler");
const Message = require("../models/Messages");
const User = require("../models/User");
const getSocketId = require("../socket/socket").getSocketId;
const io = require('../socket/socket').io;





exports.sendMessage = async (req, res) => {
  try {
    const { recieverId, content } = req.body;
    const senderId = req.user.userId;
    const file = req.file;

    /* -------------------- BASIC VALIDATIONS -------------------- */

    if (!recieverId) {
      return response(res, 400, "Receiver required");
    }

    if (!content && !file) {
      return response(res, 400, "Message or file required");
    }

    // ❌ BLOCK SELF CHAT (MOST IMPORTANT FIX)
    if (senderId.toString() === recieverId.toString()) {
      return response(res, 400, "You cannot message yourself");
    }

    /* -------------------- CONTACT VALIDATION -------------------- */

    const sender = await User.findById(senderId).select("contacts");
    if (!sender) {
      return response(res, 404, "Sender not found");
    }

    const isContactSaved = sender.contacts.some(
      (c) => c.user.toString() === recieverId.toString()
    );

    if (!isContactSaved) {
      return response(
        res,
        403,
        "You can only message users saved in your contacts"
      );
    }

    /* -------------------- CONVERSATION HANDLING -------------------- */

    // ✅ SAFE participants (no duplicate IDs)
    const participants = [...new Set([senderId, recieverId])];

    if (participants.length !== 2) {
      return response(res, 400, "Invalid conversation participants");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: 2 },
    });

    // ✅ Create conversation ONLY if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        unreadCount: 0,
      });
    }

    /* -------------------- CONTENT HANDLING -------------------- */

    let contentType = "text";
    let imageOrVideoUrl = null;

    if (file) {
      const uploadFile = await uploadImageToCloudinary(file);

      if (!uploadFile?.secure_url) {
        return response(res, 400, "Media upload failed");
      }

      imageOrVideoUrl = uploadFile.secure_url;
      contentType = file.mimetype.startsWith("image") ? "image" :file.mimetype.startsWith("video") ? "video" : "document";
    }

    /* -------------------- MESSAGE CREATION -------------------- */

    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      reciever: recieverId,
      content: content || "",
      contentType,
      imageOrVideoUrl,
      messageStatus: "sent",
    });

    /* -------------------- UPDATE CONVERSATION -------------------- */

    conversation.lastMessage = message._id;

    // unreadCount increment only for receiver
    conversation.unreadCount = (conversation.unreadCount || 0) + 1;

    await conversation.save();

    /* -------------------- POPULATE RESPONSE -------------------- */

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "userName profilePicture")
      .populate("reciever", "userName profilePicture");


      const socketId = getSocketId(recieverId);
      console.log("Socket ID of reciever:",socketId);
      io.to(socketId).emit("newMessage",populatedMessage);
      console.log("new send message is:",populatedMessage);
    return response(
      res,
      201,
      "Message sent successfully",
      populatedMessage
    );

  } catch (error) {
    console.error("Send message error:", error);
    return response(res, 500, "Internal server error");
  }
};

  /// to show conversations
// exports.getAllConversations = async (req, res) => {
  // const userId = req.user.userId;
  // try {
    // const user = await User.findById(userId).select("contacts");
    // if (!user) {
      // return response(res, 404, "User not found");
    // }
    // const contactIds = user.contacts.map(c => c.user);
    // console.log("User contacts:",contactIds);
  //  let conversation = await Conversation.find({
  // participants: {
    // $all: [userId],          // current user must be there
    // $in: contactIds          // any saved contact must be there
  // }
// })
// .populate("participants", "userName profilePicture isOnline lastSeen")
      // .populate({
        // path: "lastMessage",
        // populate: {
          // path: "sender reciever",
          // select: "userName profilePicture",
        // },
      // })
      // .sort({ updatedAt: -1 });

    // return response(res, 201, "Conversation get successfully", conversation);
  // } catch (error) {
    // console.error(error);
    // return response(res, 500, "Internal server error");
  // }
// };

// get messages of a specific conversation

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.userId;
  try { 
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return response(res, 404, "Conversation not found");
    }
    if (!conversation.participants.includes(userId)) {
      return response(res, 403, "Not authorised to view this conversation");
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "userName profilePicture")
      .populate("reciever", "userName profilePicture")
      .sort("createdAt");

    await Message.updateMany(
      {
        conversation: conversationId,
        reciever: userId,
        messageStatus: { $in: ["send", "delivered"] },
      },
      {
        $set: { messageStatus: "read" },
      }
    );

    conversation.unreadCount = 0;
    await conversation.save();
    const socketId = getSocketId(userId);
    io.to(socketId).emit("updateConversation",messages);
    return response(res, 200, "Message retrieved", messages);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};



exports.markAsRead = async(req,res)=>{
    const{messageId} = req.body;
    const userId = req.user.userId;

    try{
      let messages = await Message.find({
        _id:{$in:messageId},
        reciever:userId
      })

      await Message.updateMany(
        {_id:{$in:messageId},reciever:userId},
        {$set:{messageStatus:"read"}}
      );


      return response(res,200,"Messages marked as read",messages);
    }catch(error){
      console.error(error);
    return response(res, 500, "Internal server error");
    }
}


exports.deleteMessages = async(req,res)=>{
    const{messageId} = req.params;
    const userId = req.user.userId;
    try{
      const message = await Message.findById(messageId);
      if(!message){
        return response(res,404,"Message not found");
      }
      if(message.sender.toString() !==userId){
        return response(res,403,"Not authorised tete this message");
      }


      await Message.deleteOne();

      return response(res,200,"Mesage deleted successfully");
    }catch(error){
           console.error(error);
    return response(res, 500, "Internal server error");
    }
}