import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendOtpThunk } from "../../reducer/slices/user/userThunk";
 function SignUp() {
  const [countryCode, setCountryCode] = useState("+91");
  const [contact, setContact] = useState("");
  console.log(contact);
  const dispatch = useDispatch();
    const token = useSelector((state)=>state.auth.token);
    const navigate = useNavigate();
      useEffect(() => {
      if (token) {
        navigate("/"); // already logged in → homepage
      }
    }, [token, navigate])
 async function handleSendOtp(event) {
  event.preventDefault();

  let email = null;
  let phoneNumber = null;

  if (contact.includes("@")) {
    // user entered email
    email = contact;
  } else {
    // user entered phone
    phoneNumber = contact; // raw number only
  }

  try {
    const payload = {
      email:email,
      phoneNumber:phoneNumber,
      phoneSuffix:countryCode
    }
    console.log("payload is",payload);
     const response = await  dispatch(sendOtpThunk(payload));
     console.log("send otp signup:",response);

    if (response.payload.status == "success") {
      navigate("/verify-otp",{state:{ email: email, phoneNumber: phoneNumber,phoneSuffix:countryCode }},); // redirect to OTP page
    }

  } catch (error) {
    console.error(error);
    alert("Failed to send OTP");
  }
}

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">

      {/* Header */}
      <h1 className="text-2xl font-semibold text-slate-900 text-center mb-2">
        Create Account
      </h1>
      <p className="text-sm text-slate-500 text-center mb-8">
        Enter your email or mobile number to continue
      </p>

      {/* Form */}
      <form className="flex flex-col gap-5" onSubmit={handleSendOtp}>

        {/* Country Code + Contact Input */}
        <div className="flex gap-3">
          <select
            className="px-4 py-3 border border-slate-300 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-200 outline-none"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+81">🇯🇵 +81</option>
          </select>

          <input
            type="text"
            placeholder="Email or Mobile Number"
            className="flex-1 px-5 py-3 border border-slate-300 rounded-xl text-base placeholder-slate-400 focus:ring-2 focus:ring-blue-200 outline-none"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-base transition-all"
        >
          Continue
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{" "}
        <Link to="/verify-otp" className="text-blue-600 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  </div>
);
}

export default SignUp;
