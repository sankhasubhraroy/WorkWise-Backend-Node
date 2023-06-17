const freelancerModel = require("../../models/freelancerModel");
const { hashPassword, comparePassword } = require("../../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");

// register fnction || method POST
exports.register = async (req, res) => {
    try {
        const { name, email, username, phone, password } = req.body;

        // checking is freelancer already exists
        const existingFreelancer = await freelancerModel.findOne({ email });

        // Existing freelancer
        if (existingFreelancer) {
            return res.status(200).send({
                success: false,
                message: "User already exists"
            });
        }

        // Encrypting the password
        const hashedPassword = await hashPassword(password);

        // Register Freelancer
        const freelancer = await new freelancerModel({
            name,
            email,
            username,
            phone,
            password: hashedPassword
        }).save();

        res.status(200).send({
            success: true,
            message: "User Register Successfully",
            freelancer,
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
        const freelancer = await freelancerModel.findOne({ email });

        // when freelancer don't exists
        if (!freelancer) {
            return res.status(404).send({
                success: false,
                message: "Account dosen't exists, create a new account"
            });
        }

        // comparing the password with database encrypted password
        const match = await comparePassword(password, freelancer.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Incorrect Password",
            });
        }

        // when freelancer exists
        const token = jwt.sign({ _id: freelancer._id }, process.env.JWT_SECRET, {
            expiresIn: "30d"
        });

        res.status(200).send({
            success: true,
            message: "Login successful",
            freelancer,
            token
        });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
}
