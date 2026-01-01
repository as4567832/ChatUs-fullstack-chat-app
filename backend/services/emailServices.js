const Resend = require("resend").default;

const resend = new Resend(process.env.RESEND_API_KEY);



const sendEmailOtp = async (email,otp) => {
    const body = `<div style="background-color: #f4f4f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; width: 100%;">
  
  <!-- Hidden Preheader Text -->
  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your ChatUs verification code is ${otp}.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        
        <!-- Main Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: transparent;">
          
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="vertical-align: middle;">
                    <!-- Inline SVG Logo -->
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                      <rect width="40" height="40" rx="12" fill="#4F46E5"/>
                      <path d="M12 20C12 15.5817 15.5817 12 20 12H21C25.4183 12 29 15.5817 29 20V21C29 24.512 26.7377 27.4962 23.5938 28.5836L20.8038 29.8392C20.3121 30.0605 19.7434 29.8824 19.4678 29.4182C19.3406 29.2038 19.2949 28.9515 19.3405 28.7062L19.5448 27.606C19.6453 27.0645 19.2311 26.5714 18.6806 26.5714H18C14.6863 26.5714 12 23.8851 12 20.5714V20Z" fill="white"/>
                      <circle cx="25" cy="18" r="2" fill="#4F46E5" fill-opacity="0.8"/>
                    </svg>
                  </td>
                  <td style="vertical-align: middle; padding-left: 12px;">
                    <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; color: #4F46E5; letter-spacing: -0.5px; text-decoration: none;">ChatUs</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- White Card Content -->
          <tr>
            <td bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 48px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                
                <!-- Heading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <h1 style="color: #1F2937; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 800; margin: 0; line-height: 1.2;">Verification Code</h1>
                  </td>
                </tr>

                <!-- Intro Text -->
                <tr>
                  <td style="color: #4B5563; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; text-align: center; padding-bottom: 32px;">
                    <p style="margin: 0; margin-bottom: 16px;">Hello,</p>
                    <p style="margin: 0;">We received a request to log in to your <strong style="color: #4F46E5;">ChatUs</strong> account. Use the code below to complete the verification process.</p>
                  </td>
                </tr>

                <!-- OTP Code Box -->
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;">
                      <tr>
                        <td align="center" bgcolor="#F3F4F6" style="border-radius: 8px; border: 1px dashed #E5E7EB;">
                          <div style="padding: 16px 36px;">
                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; color: #111827; letter-spacing: 6px; display: block; text-decoration: none;">${otp}</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Warning/Expiration -->
                <tr>
                  <td style="text-align: center; color: #6B7280; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px;">
                    <p style="margin: 0; margin-bottom: 8px;">This code will expire in <strong>10 minutes</strong>.</p>
                    <p style="margin: 0;">If you didn't request this code, you can safely ignore this email.</p>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding-top: 32px; padding-bottom: 32px;">
                    <div style="height: 1px; background-color: #E5E7EB; width: 100%; line-height: 1px;">&nbsp;</div>
                  </td>
                </tr>

                <!-- Help Link -->
                <tr>
                  <td style="text-align: center; color: #9CA3AF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px;">
                    <p style="margin: 0;">Having trouble? <a href="#" style="color: #4F46E5; text-decoration: none; font-weight: 600;">Contact Support</a></p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 32px 0; color: #9CA3AF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px;">
              <p style="margin: 0 0 8px 0;">&copy; 2024 ChatUs Inc. All rights reserved.</p>
              <p style="margin: 0 0 8px 0;">1234 Messaging Lane, Tech City, TC 90210</p>
              <p style="margin: 0;">
                <a href="#" style="color: #9CA3AF; text-decoration: underline;">Privacy Policy</a> &bull; 
                <a href="#" style="color: #9CA3AF; text-decoration: underline;">Terms of Service</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Email Container -->

      </td>
    </tr>
  </table>
</div>`;
  try {
    await resend.emails.send({
      from: "ChatUs <onboarding@resend.dev>", // ✅ Resend default
      to: email,
      subject: "ChatUs verification code",
      html: body,
    });
  } catch (error) {
    console.error(error);
      throw error;
  }
};

module.exports = sendEmailOtp;
