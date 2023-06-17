const Freelancer = require("../../models/freelancer");
const { hashPassword, comparePassword } = require("../../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");
const {
    isNameValid,
    isEmailValid,
    isUsernameValid,
    isPhoneValid,
    isPasswordValid
} = require("../../helpers/validations");
const { ROLE } = require("../../helpers/constants");

// register fnction || method POST
exports.register = async (req, res) => {
    try {
        const { name, email, username, phone, password } = req.body;

        // validations
        if (!isNameValid(name)) {
            return res.status(200).send({
                success: false,
                message: "Please enter a valid name"
            });
        }
        if (!isEmailValid(email)) {
            return res.status(200).send({
                success: false,
                message: "Please enter a valid email address"
            });
        }
        if (!isUsernameValid(username)) {
            return res.status(200).send({
                success: false,
                message: "Username should not contain any special characters"
            });
        }
        if (!isPhoneValid(phone)) {
            return res.status(200).send({
                success: false,
                message: "Please enter a valid phone number"
            });
        }
        if (!isPasswordValid(password)) {
            return res.status(200).send({
                success: false,
                message: "Password must contain at least 8 characters, one letter and one number"
            });
        }

        // checking is freelancer already exists
        const existingFreelancer = await Freelancer.findOne({ $or: [{ email }, { username }, { phone }] });

        // Existing freelancer
        if (existingFreelancer) {
            return res.status(200).send({
                success: false,
                message: "Account already exists"
            });
        }

        // Encrypting the password
        const hashedPassword = await hashPassword(password);

        // Generating an avatar
        const size = 200;
        const avatar = `https://avatars.dicebear.com/api/initials/${name}.svg?size=${size}`;

        // Saving Freelancer to database
        const freelancer = await new Freelancer({
            name,
            email,
            username,
            phone,
            password: hashedPassword,
            avatar
        }).save();

        // Creating a payload to store it on jwt
        const payload = {
            user: {
                _id: freelancer._id,
                type: ROLE.FREELANCER
            }
        }

        // Generating a token to validate the user
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(200).send({
            success: true,
            message: "User Register Successfully",
            token,
            user: freelancer,
            type: ROLE.FREELANCER
        });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// login function || method POST
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validations
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        // fetching freelancer data
        const freelancer = await Freelancer.findOne({ email });

        // when freelancer don't exists
        if (!freelancer) {
            return res.status(404).send({
                success: false,
                message: "Account dosen't exists, create a new account"
            });
        }

        // comparing the password with database encrypted password
        const isMatch = await comparePassword(password, freelancer.password);

        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: "Incorrect Password",
            });
        }

        // when freelancer exists
        const payload = {
            user: {
                _id: freelancer._id,
                type: ROLE.FREELANCER
            }
        }

        // Generating a token and sending it
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(200).send({
            success: true,
            message: "Login successful",
            token,
            user: freelancer,
            type: ROLE.FREELANCER
        });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
}
