const freelancerModel = require("../../models/freelancerModel");

exports.register = async (req, res) => {
    try {
        const { name, email, username, phone, password } = req.body;

        //checking is freelancer already exists
        const existingFreelancer = await freelancerModel.findOne({ email });

        // Existing freelancer
        if (existingFreelancer) {
            return res.status(200).send({
                success: false,
                message: "User already exists"
            });
        }

        // Register Freelancer
        const freelancer = await new freelancerModel({
            name,
            email,
            username,
            phone,
            password
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