const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectionWithDB = require("./config/dbConnect");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const chatRoute = require("./routes/chatRoute");
const connectToCloudinary = require("./config/cloudinary");
const errorMiddleware = require("./middlewares/errorMiddleware");
const { app, server } = require("./socket/socket");
const path = require("path");
dotenv.config();
const PORT = process.env.PORT;
console.log("TEST ENV:", process.env.TWILIO_ACCOUNT_SID);

//middleware

app.use(express.json()); //parse body datra
app.use(cookieParser()); //parse tokern
app.use(
  cors({
    // origin:[
    //   "http://localhost:5173",
    //   "http://172.20.49.227:5173"
    // ],
    origin: [
      "http://localhost:5173",
      "https://chat-us-fullstack-chat-app.vercel.app",
       "https://chatus-igfh.onrender.com"

    ],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

//database connection
connectionWithDB();
connectToCloudinary();

//routes
app.use("/api/auth", authRoute); //authentication route
app.use("/api/chat", chatRoute);
app.use(errorMiddleware);

// ------------------------------------Deployment----------------------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname1, "..", "dist");

  console.log("Serving frontend from:", distPath);

  app.use(express.static(distPath));

  // ✅ REAL RegExp (NOT a string)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server running on port 8000");
  });
}
// ------------------------------------Deployment----------------------------


server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Server running on port:", PORT);
});
