const mongoose = require("mongoose");

const MessageSchema  = new mongoose.Schema({
    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation',
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String
    },
    imageOrVideoUrl:{
        type:String,
    },
    contentType:{
        type:String, 
        enum:['image','video','text','document']
    },
    reactions:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            emoji:{
                type:String
            }
        }
    ],
    messageStatus:{
        type:String,
        default:"send"
    }
    
},{timestamps:true});

const Message = mongoose.model("message",MessageSchema);
module.exports = Message;