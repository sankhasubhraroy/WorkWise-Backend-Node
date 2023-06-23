const Skill = require("../../models/skill");

const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json({
      status: "success",
      message: "Skills fetched successfully",
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        status: "error",
        message: "Invalid skill id",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Skill fetched successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, description, basePrice, image, icon } = req.body;

    // Validations
    if (!name || !description || !basePrice || !image || !icon) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all the required fields",
      });
    }
    if (basePrice <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Base price must be greater than 0",
      });
    }

    // Create skill
    const skill = await Skill.create({
      name,
      description,
      basePrice,
      image,
      icon,
      popularity: 0,
    });
    res.status(200).json({
      status: "success",
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const skillId = req.params.id;

    // Check if skill exists or not
    const skill = Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        status: "error",
        message: "Invalid skill id",
      });
    }

    // Updating skill details
    const updatedSkill = await Skill.findByIdAndUpdate(skillId, req.body);
    res.status(200).json({
      status: "success",
      message: "Skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const skillId = req.params.id;

    // Check if skill exists or not
    const skill = Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({
        status: "error",
        message: "Invalid skill id",
      });
    }

    // Deleting skill
    await Skill.findByIdAndDelete(skillId);
    res.status(200).json({
      status: "success",
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
