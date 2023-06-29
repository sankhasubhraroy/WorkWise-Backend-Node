const {
  getFreelancers,
  getFreelancerById,
  hasAddress,
  hasSkill,
} = require("../../controllers/freelancer");
const { ROLE } = require("../../constants");
const { authUser, authRole } = require("../../middlewares/auth");

const router = require("express").Router();

router.get("/", getFreelancers);

router.get("/:id", getFreelancerById);

router.get("/has-address",authUser, authRole(ROLE.FREELANCER), hasAddress);

router.get("/has-skill",authUser, authRole(ROLE.FREELANCER), hasSkill);

module.exports = router;
