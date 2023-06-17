const bcrypt = require("bcryptjs");

// function for encrypting the password
exports.hashPassword = async (password) => {
    try {
        const saltRounds = Number(process.env.SALT_ROUNDS);
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;

    } catch (error) {
        console.log(error);
    }
}

// function for comparing the password with encrypted password
exports.comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
