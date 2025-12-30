const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");



function connectToCloudinary(){
    cloudinary.config({
        cloud_name: "dzzjn8vaz", 
        api_key: "548447331121671",   
        api_secret: "Up7GWyM8WNuLb5VqhIXNMpEGBpA"
    });
       console.log("✅ Cloudinary connected successfully");
}

module.exports = connectToCloudinary;