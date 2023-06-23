const { DEFAULT_AVATAR, ROLE } = require("../../helpers/constants");
const { encryptData } = require("../../helpers/encrypt");
const { generateJWT } = require("../../helpers/generateJWT");
const { generateUsername } = require("../../helpers/generateUsername");
const { isNameValid } = require("../../helpers/validations");
const Admin = require("../../models/admin");
const crypto = require('crypto');


// Function to create a new Admin account || method POST
exports.createAdmin = async (req, res) => {
    try {
        const name = req.body.name;

        // validations
        if (!isNameValid(name)) {
            return res.status(400).send({
                success: false,
                message: "Please enter a valid name"
            });
        }

        // Generating a username
        const username = await generateUsername(Admin, name);
        // Generating a password
        const password = crypto.randomBytes(8).toString("hex");
        // Encrypting the password
        const hashedPassword = await encryptData(password);

        // Creating a new Admin account
        const admin = await new Admin({
            name,
            username,
            password: hashedPassword,
            avatar: DEFAULT_AVATAR(name)
        }).save();

        // Creating a payload to store it on JWT
        const payload = {
            user: {
                id: admin.id,
                type: ROLE.ADMIN
            }
        }

        // Generating a JWT token to validate the user
        const token = await generateJWT(payload);

        res.status(200).send({
            success: true,
            message: "Successfully created an admin account",
            secret: {
                username: username,
                password: password
            },
            token,
            user: admin,
            type: ROLE.ADMIN
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}