const nodemailer = require("nodemailer");

const sendMail = async (email, subject, content) => {
    console.log("sendMail", email, subject, content);
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
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