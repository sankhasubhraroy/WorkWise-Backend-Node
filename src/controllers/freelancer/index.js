const Freelancer = require("../../models/freelancer");

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

const getFreelancerById = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
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
      data: freelancer,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const hasSkill = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.user.id);
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
      data: freelancer,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getFreelancers,
  getFreelancerById,
  hasAddress,
  hasSkill,
};
