const bcrypt = require("bcryptjs");

// Function for encrypting the sensitive data
exports.encryptData = async (data) => {
    try {
        const saltRounds = Number(process.env.SALT_ROUNDS);
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedData = await bcrypt.hash(data, salt);
        return hashedData;

    } catch (error) {
        console.log(error);
    }
}

// Function for decryptinf the sensitive data
exports.decryptData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
}
