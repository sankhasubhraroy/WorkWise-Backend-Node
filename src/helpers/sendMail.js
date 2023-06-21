const nodemailer = require("nodemailer");

const sendMail = async (email, subject, content) => {
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
        }

        await transporter.sendMail(options, (err, info) => {
            if (err) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    catch (error) {
        return false;
    }
}

module.exports = sendMail;