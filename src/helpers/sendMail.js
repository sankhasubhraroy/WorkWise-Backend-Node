const nodemailer = require("nodemailer");

const sendMail = async (email, subject, otp) => {
    const content = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <h1 style="color: #0d6efd;">WorkWise</h1>
        <h2 style="color: #0d6efd;">OTP for Email Verification</h2>
        <p>Your OTP for email verification is <strong>${otp}</strong></p>
        <p>Please click <a href=${process.env.BASE_URL}/auth/consumer/verify/email/?id=${email}&key=${otp}>here</a> to verify your email.</p>
        <p>Thank you for using WorkWise</p>
    </div>
    `;
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            },
        });

        const options = {
            from: '"WorkWise"<process.env.SMTP_MAIL>',
            to: email,
            subject: subject,
            html: content
        };

        const info = await transporter.sendMail(options);
        console.log("Message sent: %s", info.messageId);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = sendMail;