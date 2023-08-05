const getCoordinatesFromAddress = require("../../helpers/getCoordinatesFromAddress");
const {
    isNameValid,
    isEmailValid,
    isUsernameValid,
} = require("../../helpers/validations");
const Freelancer = require("../../models/freelancer");

// DESC: @GET - Get all freelancers
const getFreelancers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            orderBy = "desc",
            skills,
            longitute,
            latitude,
        } = req.query;

        const sortingType = {
            [sortBy]: orderBy === "desc" ? -1 : 1,
        };

        skills = skills.split(",");

        const freelancers = await Freelancer.find({
            skills: {
                $in: skills,
            },
            "address.coordinates": {
                $near: {
                    $maxDistance: 1000,
                    $geometry: {
                        type: "Point",
                        coordinates: [longitute, latitude],
                    },
                },
            },
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sortingType);

        res.status(200).json({
            status: "success",
            message: "Freelancers fetched successfully",
            data: freelancers,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// DESC: @GET - Get freelancer details by id
const getFreelancerById = async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.params.id).populate(
            "skills"
        );
        if (!freelancer) {
            return res.status(400).json({
                status: "error",
                message: "Invalid freelancer id",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Freelancer fetched successfully",
            data: freelancer,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// DESC: @PUT - Update Personal Details (name, email, phone, username, address, avatar)
const updatePersonalDetails = async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.user.id);
        if (!freelancer) {
            return res.status(400).json({
                status: "error",
                message: "Invalid freelancer id",
            });
        }

        const { name, email, phone, username, address, avatar } = req.body;

        if (name) {
            if (!isNameValid(name)) {
                res.status(400).json({
                    status: "error",
                    message: "Invalid name",
                });
            }
            freelancer.name = name;
        }
        if (email) {
            if (!isEmailValid(email)) {
                res.status(400).json({
                    status: "error",
                    message: "Invalid email",
                });
            }
            freelancer.email = email;
        }
        if (phone) {
            if (!isPhoneValid(phone)) {
                res.status(400).json({
                    status: "error",
                    message: "Invalid phone number",
                });
            }
            freelancer.phone = phone;
        }

        if (username) {
            if (!isUsernameValid(username)) {
                res.status(400).json({
                    status: "error",
                    message:
                        "Username should not contain any special characters",
                });
            }
            freelancer.username = username;
        }

        if (avatar) {
            freelancer.avatar = avatar;
        }

        if (address) {
            if (
                !address.country ||
                !address.state ||
                !address.city ||
                !address.street ||
                !address.pincode
            ) {
                res.status(400).json({
                    status: "error",
                    message: "Invalid address",
                });
            }

            if (!address.coordinates) {
                try {
                    // fetch coordinates from address
                    address.coordinates = await getCoordinatesFromAddress(
                        `${address.city}, ${address.state}, ${address.country}`
                    );
                } catch (error) {
                    res.status(400).json({
                        status: "error",
                        message: error.message,
                    });
                }
            }
            freelancer.address = address;
        }

        await freelancer.save();

        res.status(200).json({
            status: "success",
            message: "Freelancer updated successfully",
            data: freelancer,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// DESC: @GET - Check if freelancer has address or not
const hasAddress = async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.user.id);
        if (!freelancer) {
            return res.status(400).json({
                status: "error",
                message: "Invalid freelancer id",
            });
        }

        if (!freelancer.address || !freelancer.address.coordinates) {
            return res.status(200).json({
                status: "error",
                message: "Freelancer has no address",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Freelancer has address",
            data: freelancer.address,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// DESC: @GET - Check if freelancer has any skill or not
const hasSkill = async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.user.id).populate(
            "skills"
        );
        if (!freelancer) {
            return res.status(400).json({
                status: "error",
                message: "Invalid freelancer id",
            });
        }

        if (!freelancer.skills || !freelancer.skills.length) {
            return res.status(200).json({
                status: "error",
                message: "Freelancer has no skill",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Freelancer has profession",
            data: freelancer.skills,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// DESC: @POST - Add skill to freelancer
const addSkill = async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.user.id);
        if (!freelancer) {
            return res.status(400).json({
                status: "error",
                message: "Invalid freelancer id",
            });
        }

        const { skill } = req.body;
        if (!skill) {
            return res.status(400).json({
                status: "error",
                message: "Invalid skill",
            });
        }

        if (!freelancer.skills || !freelancer.skills.length) {
            freelancer.skills = [];
        }

        freelancer.skills.push(skill);
        await freelancer.save();

        res.status(200).json({
            status: "success",
            message: "Skill added successfully",
            data: freelancer,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// Function to deactivate account || method: GET
const deactivateAccount = async (req, res) => {
    try {
        const id = req.user.id;

        // validations
        if (!id) {
            return res.status(400).send({
                success: false,
                message: "Server Error. Please try again later"
            });
        }

        await Freelancer.findByIdAndUpdate(id, { activated: false });

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

module.exports = {
    getFreelancers,
    getFreelancerById,
    updatePersonalDetails,
    hasAddress,
    hasSkill,
    addSkill,
    deactivateAccount,
};
