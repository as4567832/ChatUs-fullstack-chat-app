const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();
const authMiddleWare = require("../middlewares/authMiddleware").authMiddleware;
router.post('/send-otp',authController.sendOtp);
router.post('/verify-otp',authController.verifyOtp);
router.post('/save-contact',authMiddleWare,authController.saveContact);
router.get('/logout',authController.logout);
const multer = require("multer"); // <-- import multer
const upload = multer({ dest: "uploads/" }); // or memoryStorage 



router.put('/updateProfile',authMiddleWare,upload.single("profilePicture"),authController.updateProfile);
router.get('/check-auth',authMiddleWare,authController.checkAuthenticate);
router.get('/users',authMiddleWare,authController.getAllUsers);
module.exports = router;