const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.uploadImageToCloudinary = (file) => {
  const options = {
    resource_type: file.mimetype.startsWith("video") ? "video" : "image"
  };

  return new Promise((resolve, reject) => {
    const uploader = file.mimetype.startsWith("video")
      ? cloudinary.uploader.upload_large
      : cloudinary.uploader.upload;

    uploader(file.path, options, (error, result) => {
      fs.unlink(file.path, () => {}); // delete local file

      if (error) return reject(error);
      resolve(result);
    });
  });
};



