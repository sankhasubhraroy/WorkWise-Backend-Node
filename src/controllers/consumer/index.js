const { ROLE, WORK_STATUS } = require("../../helpers/constants");
const { encryptData, decryptData } = require("../../helpers/encrypt");
const { getEmailVerificationContent } = require("../../helpers/mailContent");
const sendMail = require("../../helpers/sendMail");
const {
    isEmailValid,
    isUsernameValid,
    isPasswordValid,
} = require("../../helpers/validations");
const Consumer = require("../../models/consumer");
const OTP = require("../../models/otp");
const crypto = require("crypto");
const Work = require("../../models/work");

// DESC: @POST - Function to update email and resend verification
const updateEmail = async (req, res) => {
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
            key: crypto.randomBytes(32).toString("hex"),
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
};

// DESC: @POST - Function to update username
const updateUsername = async (req, res) => {
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
    } catch (error) {}
};

// DESC: @POST - Function to update password
const updatePassword = async (req, res) => {
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
};

// DESC: @GET - Function to deactivate account
const deactivateAccount = async (req, res) => {
    try {
        const id = req.user.id;

        // validations
        if (!id) {
            return res.status(400).send({
                success: false,
                message: "Server Error. Please try again later",
            });
        }

        await Consumer.findByIdAndUpdate(id, { activated: false });

        res.status(200).json({
            success: true,
            message: "Account deactivated successfully",
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
};

// DESC: @PUT - Accept work request given by the freelancer
const acceptWorkRequest = async (req, res) => {
    try {
        const consumer = Consumer.findById(req.user.id);
        if (!consumer) {
            return res.status(400).send({
                success: false,
                message: "Consumer not found",
            });
        }
        const { workId } = req.body;
        if (!workId) {
            return res.status(400).send({
                success: false,
                message: "WorkId not found",
            });
        }
        const work = Work.findById(workId);
        if (!work) {
            return res.status(400).send({
                success: false,
                message: "Work not found",
            });
        }
        if (work.consumerId !== consumer.id) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized to accept this work",
            });
        }
        if (work.status !== WORK_STATUS.REQUESTED) {
            return res.status(400).send({
                success: false,
                message: "Work is already accepted or rejected",
            });
        }

        await work.updateOne({ status: WORK_STATUS.ACCEPTED });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
};

// DESC: @PUT - Reject work request given by the freelancer
const rejectWorkRequest = async (req, res) => {
    try {
        const consumer = Consumer.findById(req.user.id);
        if (!consumer) {
            return res.status(400).send({
                success: false,
                message: "Consumer not found",
            });
        }
        const { workId } = req.body;
        if (!workId) {
            return res.status(400).send({
                success: false,
                message: "WorkId not found",
            });
        }
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(400).send({
                success: false,
                message: "Work not found",
            });
        }
        if (work.consumerId !== consumer.id) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized to reject this work",
            });
        }
        if (work.status !== WORK_STATUS.REQUESTED) {
            return res.status(400).send({
                success: false,
                message: "Work is already accepted or rejected",
            });
        }
        await work.updateOne({ status: WORK_STATUS.REJECTED });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
};

// DESC: @PUT - Extend work deadline
const extendWorkDeadline = async (req, res) => {
    try {
        const consumer = Consumer.findById(req.user.id);
        if (!consumer) {
            return res.status(400).send({
                success: false,
                message: "Consumer not found",
            });
        }
        const { workId, deadline } = req.body;
        if (!workId) {
            return res.status(400).send({
                success: false,
                message: "WorkId not found",
            });
        }
        const work = Work.findById(workId);
        if (!work) {
            return res.status(400).send({
                success: false,
                message: "Work not found",
            });
        }
        if (work.consumerId !== consumer.id) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized to extend this work",
            });
        }
        if (work.status !== WORK_STATUS.ACCEPTED) {
            return res.status(400).send({
                success: false,
                message: "Work deadline cannot be extended",
            });
        }
        if(!deadline) {
            return res.status(400).send({
                success: false,
                message: "Deadline not found",
            });
        }
        if(deadline <= Date.now()) {
            return res.status(400).send({
                success: false,
                message: "Deadline cannot be less than today's date",
            });
        }
        await work.updateOne({ deadline });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }
};

// DESC: @PUT - Cancel the work if not completed within the deadline
const cancelWorkRequest = async (req, res) => {
    try {
        const consumer = Consumer.findById(req.user.id);
        if (!consumer) {
            return res.status(400).send({
                success: false,
                message: "Consumer not found",
            });
        }
        const { workId } = req.body;
        if (!workId) {
            return res.status(400).send({
                success: false,
                message: "WorkId not found",
            });
        }
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(400).send({
                success: false,
                message: "Work not found",
            });
        }
        if (work.consumerId !== consumer.id) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized to cancel this work",
            });
        }
        if (work.status !== WORK_STATUS.ACCEPTED || work.deadline >= Date.now()) {
            return res.status(400).send({
                success: false,
                message: "Work cannot be cancelled",
            });
        }
        await work.updateOne({ status: WORK_STATUS.FAILED });

        return res.status(200).send({
            success: true,
            message: "Work cancelled successfully",
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    updateEmail,
    updateUsername,
    updatePassword,
    deactivateAccount,
    acceptWorkRequest,
    rejectWorkRequest,
    extendWorkDeadline,
    cancelWorkRequest,
};
