import React, { useState } from "react";
import { ArrowLeft, User, Phone, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveContactThunk,getAllUsersThunk } from "../../reducer/slices/user/userThunk";

const AddContactPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(null);

 
  let userName =null;
  let email  = null;
  let contact = null;
  if(phone.includes("@")){
    email = phone
  }
  else{
    contact = phone
  }
  const payload = {
    userName:name,
    email:email,
    contact:contact
  }
const handleSave = () => {
  if (!phone) return;
  setError(null);
  setLoading(true);

  dispatch(saveContactThunk(payload))
    .unwrap()
    .then(async(res) => {
      console.log("Contact saved:", res);
      await dispatch(getAllUsersThunk());
      navigate("/"); // ✅ success only
    })
    .catch((err) => {
      setError(err);
      console.error("Save contact failed:", err);
      //  error case → stay on page
    })
    .finally(()=>{
      setLoading(false);
    })
};


  return (
    <div className="h-screen bg-[#f0f2f5] flex flex-col">
      {/* Header */}
      <div className="h-14 bg-white flex items-center gap-3 px-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-lg text-gray-800">
          Add contact
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex justify-center items-start pt-16 px-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-md px-6 pb-8 pt-16 relative">
          
          {/* Avatar */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-gray-200 shadow flex items-center justify-center">
              <User size={42} className="text-gray-400" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="font-semibold text-gray-800 text-base">
              Contact details
            </h2>
            <p className="text-xs text-gray-500">
              Add a name and phone number
            </p>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-xs text-gray-500">Name</label>
            <div className="flex items-center gap-2 mt-1 bg-gray-50 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <User size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Contact name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="text-xs text-gray-500">Phone number</label>
            <div className="flex items-center gap-2 mt-1 bg-gray-50 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <Phone size={16} className="text-gray-400" />
              <input
                type="tel"
                placeholder="Enter phone number or Email"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>
          {error && (
  <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
    {error}
  </div>
)}
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!phone}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium shadow-md disabled:opacity-50 transition"
          >
            <Save size={16} />
             {loading ? "Saving..." : "Save contact"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContactPage;
