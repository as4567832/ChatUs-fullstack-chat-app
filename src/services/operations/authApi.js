// import { apiConnector } from "../apiConnectors";
// import { authEndpoints } from "../apis";

// const{SIGNUP_API,VERIFY_OTP} = authEndpoints;


// export async function sendOtp(email,phoneNumber,phoneSuffix){
//         try{
//             const body = {
//                 email,
//                 phoneNumber,
//                 phoneSuffix
//             }
//             const response = await apiConnector("POST",SIGNUP_API,body);
//             console.log("SEND OTP API RESPONSE........................",response);
//             console.log(response);
//             return response;
//         }catch(error){
//              console.error("SEND OTP ERROR:", error);
//     throw error;

//     }
// }

// export async function verifyOtp(otp){
//     try{
//      const response = await apiConnector("POST",VERIFY_OTP,otp);
//       console.log("VERIFY OTP API RESPONSE........................",response);
//       return response;
//     }catch(error){
//         console.error("VERIFY OTP ERROR:", error);

//     }
// }