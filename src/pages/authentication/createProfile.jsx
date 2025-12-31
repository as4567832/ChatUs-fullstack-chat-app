import React, { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { updateProfileThunk } from "../../reducer/slices/user/userThunk";
import { useNavigate } from "react-router-dom";

function SetupProfile() {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [agree, setAgree] = useState(false);
  const token = useSelector((state)=>state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("Token is",token);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      agreed:agree,
      username:username,
      profilePicture:profilePic
    }
    const result = await dispatch(updateProfileThunk(payload));
    if(result.payload.status == "success"){
      navigate('/');
    }
    console.log("response for update profile is:",result)
    console.log("username is:",username);
    console.log("agreed is:",agree);

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">

        {/* Header */}
        <h1 className="text-3xl font-semibold text-slate-900 text-center mb-3 tracking-tight">
          Create Your Profile
        </h1>
        <p className="text-sm text-slate-500 text-center mb-10">
          Add your picture and complete your details
        </p>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 p-1 shadow-md">
              <img
                src={preview || "https://via.placeholder.com/150?text=+"}
                className="w-full h-full rounded-full object-cover border border-white shadow-inner"
                alt="avatar"
              />
            </div>

            {/* Camera Button */}
            <label
              htmlFor="profilePicUpload"
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all active:scale-95"
            >
              📷
            </label>

            <input
              type="file"
              id="profilePicUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <p className="text-xs text-slate-600 mt-3">
            Tap the camera to upload a photo
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

          {/* Username Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600 ml-1">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="px-5 py-3 rounded-xl border border-slate-300 text-base shadow-sm focus:ring-2 focus:ring-blue-300 outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <p className="text-sm text-slate-600">
              I agree to the <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Terms & Conditions</span>
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-lg shadow-md transition-all active:scale-95"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default SetupProfile;
