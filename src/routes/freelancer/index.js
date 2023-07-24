const {
  getFreelancers,
  getFreelancerById,
  hasAddress,
  hasSkill,
  updatePersonalDetails,
  skills,
  addSkill,
} = require("../../controllers/freelancer");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");

const router = require("express").Router();

router.get("/", getFreelancers);

router.put("/update-personal-details",authUser, authRole(ROLE.FREELANCER), updatePersonalDetails);

router.get("/has-address",authUser, authRole(ROLE.FREELANCER), hasAddress);

router.get("/has-skill",authUser, authRole(ROLE.FREELANCER), hasSkill);

router.get("/skills",authUser, authRole(ROLE.FREELANCER), skills);

router.post("/skills",authUser, authRole(ROLE.FREELANCER), addSkill);

router.get("/:id", getFreelancerById);


module.exports = router;
