const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();
//twilio credentials 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = twilio(accountSid,authToken);
console.log("service sid is:",serviceSid)
//send otp to phone number

const sendOtpToPhoneNumber = async(phoneNumber)=>{
    try{
       console.log("sending otp to your phone number:",phoneNumber);
       if(!phoneNumber){
        throw new Error("Phone number is required");
       }
       const response = await client.verify.v2.services(serviceSid).verifications.create({
        to:phoneNumber,
        channel:'sms'
       });
       console.log("otp response is",response);
       return response;
    }catch(error){
   console.error(error);
   throw new Error("Failed to send otp please try again later");
    }
}


//verify otp 

const verifyOtpToPhoneNumber = async(phoneNumber,otp)=>{
    try{
       const response = await client.verify.v2.services(serviceSid).verificationChecks.create({
        to:phoneNumber,
        code:otp
       });
       console.log("otp response is",response);
       return response;
    }catch(error){
   console.error(error);
   throw new Error("otp verification failed! please try again later");
    }
}

module.exports = {
    sendOtpToPhoneNumber,
    verifyOtpToPhoneNumber
}