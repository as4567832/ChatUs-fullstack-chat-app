const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    phoneNumber:{
        type:String,
        unique:true,
        sparse:true
    },
    phoneSuffix:{
        type:String,
        unique:false
    },
    userName:{
        type:String,
    },
    contacts:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            savedName:{
                type:String
            }
        }    
    ],
    email:{
        type:String,
        lowercase:true,
        match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email address.',
      ],
    },
    emailOtp:{
        type:String
    },
    emailOtpExpiry:{
        type:Date
    },
    profilePicture:{
        type:String
    },
    about:{
        type:String
    },
    lastSeen:{
        type:Date
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    agreed:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

const User = mongoose.model("User",userSchema);
module.exports = User;