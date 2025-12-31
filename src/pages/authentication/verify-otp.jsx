import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../reducer/slices/user/userSlice";
import { verifyOtpThunk } from "../../reducer/slices/user/userThunk";

function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {token} = useSelector((state)=>state.auth);

  // Countdown for resend OTP
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < otp.length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(data)) {
      setOtp(data.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async() => {
const email = location.state?.email;
const phoneNumber = location.state?.phoneNumber;
const phoneSuffix = location.state?.phoneSuffix;
console.log("Phone suffix is:",phoneSuffix)
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return alert("Enter 6-digit OTP.");
    console.log("OTP:", finalOtp);
        console.log("email:", email);

            console.log("phone number:", phoneNumber);
    console.log("country code:", phoneSuffix);

    // API call
    const body = { email, phoneNumber, phoneSuffix, otp: finalOtp };
    const result = await dispatch(verifyOtpThunk(body));
    console.log("otp verify respoonse is:",result);
    if(result.payload.data.user.agreed == true){
      dispatch(setToken(result?.payload?.data?.token));
      localStorage.setItem("token",JSON.stringify(result.payload.data.token));
      navigate('/'); 
    }
     else{
      localStorage.setItem("token",JSON.stringify(result.payload.data.token));
      navigate('/createProfile');
    }
    

  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">Verify OTP</h2>
        <p className="text-slate-600 mb-6">
          Enter the 6-digit verification code sent to your phone.
        </p>

        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center border border-slate-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOtp}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg font-medium transition"
        >
          Verify
        </button>

        <div className="mt-4 text-sm text-slate-600">
          {timer > 0 ? (
            <p>
              Resend OTP in <span className="font-semibold">{timer}s</span>
            </p>
          ) : (
            <button
              className="text-blue-600 font-medium hover:underline"
              onClick={() => setTimer(60)}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
