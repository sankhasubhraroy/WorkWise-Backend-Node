const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
} = require("../../controllers/skills");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");
const { create } = require("../../models/consumer");

const router = require("express").Router();

router.get("/", getSkills);

router.get("/:id", getSkillById);

router.post("/", authUser, authRole(ROLE.ADMIN), createSkill);

router.put("/:id", authUser, authRole(ROLE.ADMIN), updateSkill);

router.delete("/:id", authUser, authRole(ROLE.ADMIN), deleteSkill);

module.exports = router;
