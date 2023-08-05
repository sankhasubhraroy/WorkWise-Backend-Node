const { ROLE } = require("../../helpers/constants");
const { encryptData, decryptData } = require("../../helpers/encrypt");
const { getEmailVerificationContent } = require("../../helpers/mailContent");
const sendMail = require("../../helpers/sendMail");
const {
    isEmailValid,
    isUsernameValid,
    isPasswordValid
} = require("../../helpers/validations");
const Consumer = require("../../models/consumer");
const OTP = require("../../models/otp");
const crypto = require("crypto");

// Function to update email and resend verification || method: POST
exports.updateEmail = async (req, res) => {
    try {
        const { id } = req.user;
        const { email } = req.body;

        // validations
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        if (!isEmailValid(email)) {
            return res.status(400).json({
                success: false,
                message: "Email is not valid",
            });
        }

        const consumer = await Consumer.findById(id);
        // Check if consumer exists
        if (!consumer) {
            return res.status(400).json({
                success: false,
                message: "Consumer not found",
            });
        }
        // Check if new email is same as old email
        if (consumer.email === email) {
            return res.status(400).json({
                success: false,
                message: "New email is same as old email",
            });
        }

        // Check if new email already exists
        const doesExist = await Consumer.findOne({ email });
        if (doesExist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        // Update email
        await consumer.updateOne({ email, emailVerified: false });

        // Delete all previous otps
        await OTP.deleteMany({ userId: id, userType: ROLE.CONSUMER });
        // Generating new otp and sending it to new email
        const otp = await new OTP({
            userId: id,
            userType: ROLE.CONSUMER,
            key: crypto.randomBytes(32).toString("hex")
        }).save();

        const content = getEmailVerificationContent(ROLE.CONSUMER, otp);
        await sendMail(email, "Email Verification", content);

        res.status(200).json({
            success: true,
            message: "Email updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Function to update username || method: POST
exports.updateUsername = async (req, res) => {
    try {
        const { id } = req.user;
        const { username } = req.body;

        // validations
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }
        if (!isUsernameValid(username)) {
            return res.status(400).json({
                success: false,
                message: "Username is not valid",
            });
        }

        const consumer = await Consumer.findById(id);
        // Check if consumer exists
        if (!consumer) {
            return res.status(400).json({
                success: false,
                message: "Consumer not found",
            });
        }
        // Check if new username is same as old username
        if (consumer.username === username) {
            return res.status(400).json({
                success: false,
                message: "New username is same as old username",
            });
        }

        // Check if new username already exists
        const doesExist = await Consumer.findOne({ username });
        if (doesExist) {
            return res.status(400).json({
                success: false,
                message: "Username already exists",
            });
        }

        // Update username
        await consumer.updateOne({ username });

        res.status(200).json({
            success: true,
            message: "Username updated successfully",
        });

    } catch (error) {

    }
}

// Function to update password || method: POST
exports.updatePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { oldPassword, newPassword } = req.body;

        // validations
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields",
            });
        }
        if (!isPasswordValid(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password should be atleast 8 characters",
            });
        }
        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password cannot be same",
            });
        }

        const consumer = await Consumer.findById(id);
        // Check if consumer exists
        if (!consumer) {
            return res.status(400).json({
                success: false,
                message: "Consumer not found",
            });
        }
        if (!consumer.password) {
            return res.status(400).json({
                success: false,
                message: "Password not set",
            });
        }

        // Check if old password is correct
        const isMatch = await decryptData(oldPassword, consumer.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // Update password
        const hashedPassword = await encryptData(newPassword);
        await consumer.updateOne({ password: hashedPassword });

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Function to deactivate account || method: GET
exports.deactivateAccount = async (req, res) => {
    try {
        const id = req.user.id;

        // validations
        if (!id) {
            return res.status(400).send({
                success: false,
                message: "Server Error. Please try again later"
            });
        }

        await Consumer.findByIdAndUpdate(id, { activated: false });

        res.status(200).json({
            success: true,
            message: "Account deactivated successfully"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
}
