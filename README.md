# ChatApp (ChatUs) — React + Vite + Express (Socket + Twilio + Cloudinary)

Minimal chat application with:
- React + Vite frontend ([src/main.jsx](src/main.jsx), [src/App.jsx](src/App.jsx))
- Express + Socket.IO backend ([backend/index.js](backend/index.js), [backend/socket/socket.js](backend/socket/socket.js))
- Authentication via OTP (Twilio / Email)
- File uploads to Cloudinary
- Redux Toolkit for state management ([src/reducer/combinedReducers.js](src/reducer/combinedReducers.js))

## Quick Links (important files)
- Frontend entry: [src/main.jsx](src/main.jsx)  
- App routes: [src/App.jsx](src/App.jsx)  
- Pages:
  - Sign Up: [src/pages/authentication/signup.jsx](src/pages/authentication/signup.jsx)
  - Verify OTP: [src/pages/authentication/verify-otp.jsx](src/pages/authentication/verify-otp.jsx)
  - Create Profile: [src/pages/authentication/createProfile.jsx](src/pages/authentication/createProfile.jsx)
  - Chat UI: [src/pages/homepage/chatpage.jsx](src/pages/homepage/chatpage.jsx)
  - Add Contact: [src/pages/homepage/addcontact.jsx](src/pages/homepage/addcontact.jsx)
- Frontend API helpers:
  - axios instance: [src/services/apiConnectors.js](src/services/apiConnectors.js)
  - endpoints: [src/services/apis.js](src/services/apis.js)
- Redux slices / thunks:
  - User: [src/reducer/slices/user/userSlice.js](src/reducer/slices/user/userSlice.js), [src/reducer/slices/user/userThunk.js](src/reducer/slices/user/userThunk.js)
  - Messages: [src/reducer/slices/messages/messagesSlice.js](src/reducer/slices/messages/messagesSlice.js), [src/reducer/slices/messages/messagesThunk.js](src/reducer/slices/messages/messagesThunk.js)
  - Socket: [src/reducer/slices/socket/socket.slice.js](src/reducer/slices/socket/socket.slice.js)
- Backend routes/controllers:
  - Auth routes: [backend/routes/authRoute.js](backend/routes/authRoute.js) → [backend/controller/authController.js](backend/controller/authController.js)
  - Chat routes: [backend/routes/chatRoute.js](backend/routes/chatRoute.js) → [backend/controller/chatController.js](backend/controller/chatController.js)
- Backend utils:
  - Cloudinary config: [backend/config/cloudinary.js](backend/config/cloudinary.js)
  - Twilio service: [backend/services/twilioService.js](backend/services/twilioService.js)
  - Email service: [backend/services/emailServices.js](backend/services/emailServices.js)

## Prerequisites
- Node.js (>=16) and npm
- MongoDB URI
- Twilio account (optional for SMS)
- Cloudinary account (for media)
- Gmail SMTP or other mail provider (for email OTP)

## Environment variables
Root .env (frontend):
- VITE_BASE_URL — e.g. `http://localhost:8000/api` (used in [src/services/apis.js](src/services/apis.js))
- VITE_SOCKET_URL — e.g. `http://localhost:8000`

Backend .env (see [backend/.env](backend/.env)):
- PORT (e.g. 8000)
- MONGODB_URL
- TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
- MAIL_USER, MAIL_PASS, MAIL_HOST, MAIL_PORT
- JWT_SECRET
- CLIENT_URL (frontend origin)

Important: remove hard-coded Cloudinary keys from [backend/config/cloudinary.js](backend/config/cloudinary.js) and move them to backend .env for security.

## Install & Run (development)
1. Install dependencies (root runs both client and backend):
   - From project root:
     npm install
   - Backend deps (if needed):
     cd backend
     npm install
     cd ..

2. Start dev servers (runs Vite + backend concurrently):
   npm run dev
   - This uses scripts in [package.json](package.json) and [backend/package.json](backend/package.json).

3. Open frontend: http://localhost:5173  
   Backend: http://localhost:8000

## Build / Preview
- Build frontend:
  npm run build
- Preview production build:
  npm run preview

## Useful scripts
- Start backend only:
  npm run server (runs backend dev from root script)
- Lint:
  npm run lint

## Notes & Troubleshooting
- CORS / cookie: backend enables CORS with credentials. Ensure CLIENT_URL matches frontend origin.
- Tokens: frontend stores token in localStorage and sends `Authorization: Bearer <token>` via [src/services/apiConnectors.js](src/services/apiConnectors.js).
- Socket: socket client initialization occurs in [src/reducer/slices/socket/socket.slice.js](src/reducer/slices/socket/socket.slice.js) (default URL currently hardcoded to http://localhost:8000). Update to use VITE_SOCKET_URL if needed.
- Uploads: multer stores files temporarily in /uploads and backend uploads to Cloudinary ([backend/utils/imageUploader.js](backend/utils/imageUploader.js)).
- If you see CORS/socket issues, confirm ports, origins and that server is reachable (server logs in [backend/index.js](backend/index.js)).

## Tests
No automated tests currently included. Backend has nodemon for dev in [backend/package.json](backend/package.json).

## Contributing
- Create feature branches, follow consistent commit messages.
- Move secrets to environment variables before committing.

## License
Open source / MIT (add your license file if required).
