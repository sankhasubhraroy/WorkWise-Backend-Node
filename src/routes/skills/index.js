const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
} = require("../../controllers/skills");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");
const { create } = require("../../models/consumer");

const router = require("express").Router();

router.get("/all", getAllSkills);

router.get("/:id", getSkillById);

router.post("/create", authUser, authRole(ROLE.ADMIN), createSkill);

router.put("/update/:id", authUser, authRole(ROLE.ADMIN), updateSkill);

module.exports = router;
