const express = require("express");
const chatController = require("../controller/chatController");
const router = express.Router();
const multer = require("multer"); // <-- import multer
const upload = multer({ dest: "/tmp" }); // or memoryStorage 
const authMiddleWare = require("../middlewares/authMiddleware").authMiddleware;
router.post("/send-message", authMiddleWare,upload.single("file"), chatController.sendMessage);
// router.get("/conversations", authMiddleWare, chatController.getAllConversations);
router.get("/conversations/:conversationId/messages", authMiddleWare, chatController.getMessages);

router.put("/messages/read", authMiddleWare, chatController.markAsRead);
router.delete("/delete/:messageId", authMiddleWare, chatController.deleteMessages);

module.exports = router;
