import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const token = useSelector((state)=>state.auth.token);
  const navigate = useNavigate();
    useEffect(() => {
    if (token) {
      navigate("/"); // already logged in → homepage
    }
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-50 p-3 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight">ChatUs</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Please enter your details.</p>
        </div>
        <form className="flex flex-col gap-5" action="">
                        <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600 ml-1">Email</label>
                <input 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 placeholder-slate-400 text-slate-700" 
                  placeholder="Enter your email" 
                  type="text" 
                />
            </div>
            <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 placeholder-slate-400 text-slate-700 pr-10" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
            </div>
            <div className="flex justify-end">
                <a href="" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    Forgot Password?
                </a>
            </div>
            <Link to={'/verify-otp'}><button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-700/30 transition-all duration-200 active:scale-[0.98]">
                Sign In
            </button>
            </Link>
            <div className="text-center mt-2">
                <p className="text-slate-500 text-sm">
                    Don't have an account?{' '}
                    <Link to ='/signup'>
                    <span className="text-green-600 font-bold hover:text-green-700 hover:underline cursor-pointer transition-colors">
                        Sign Up
                    </span>
                    </Link>
                </p>
            </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;