import './App.css'
import SignIn from './pages/authentication/signin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/authentication/signup';
import ChatPage from './pages/homepage/chatpage';
import VerifyOTP from './pages/authentication/verify-otp';
import SetupProfile from './pages/authentication/createProfile';
import ProtectedRoute from './protectedRoutes/protectedroutes';
import AddContactPage from './pages/homepage/addcontact';
function App() {
  return (
    <>
     <Routes>
      {/* <Route path='/' element={<SignIn></SignIn>}></Route>
      <Route path='/login' element={<SignIn></SignIn>}></Route> */}
      <Route path='/signup' element={<SignUp></SignUp>}></Route>
      <Route path="/" element={<ProtectedRoute><ChatPage></ChatPage></ProtectedRoute>}></Route>
      <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatPage></ChatPage></ProtectedRoute>}></Route>
      <Route path='/verify-otp' element={<VerifyOTP></VerifyOTP>}></Route>
      <Route path='/createProfile' element={<SetupProfile></SetupProfile>}></Route>
      <Route path='/add-contact' element={<AddContactPage></AddContactPage>}></Route>
     </Routes>
    </>
  )
}

export default App
