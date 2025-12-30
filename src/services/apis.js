const BASE_URL = import.meta.env.VITE_BASE_URL;

// auth endpoints

export const authEndpoints = {
    SIGNUP_API:BASE_URL + "/api/auth/send-otp",
    VERIFY_OTP:BASE_URL + '/api/auth/verify-otp'
}