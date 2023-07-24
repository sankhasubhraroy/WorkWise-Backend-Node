const {
  getFreelancers,
  getFreelancerById,
  hasAddress,
  hasSkill,
  updatePersonalDetails,
  addSkill,
} = require("../../controllers/freelancer");
const {
  getConversationList,
  getMessages,
  sendMessage
} = require('../../controllers/message/messageController');
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");

const router = require("express").Router();

router.get("/", getFreelancers);

router.put("/update-personal-details",authUser, authRole(ROLE.FREELANCER), updatePersonalDetails);

router.get("/has-address", authUser, authRole(ROLE.FREELANCER), hasAddress);

router.get("/has-skill", authUser, authRole(ROLE.FREELANCER), hasSkill);

router.get("/message/list", authUser, authRole(ROLE.FREELANCER), getConversationList);

router.get("/message/get", authUser, authRole(ROLE.FREELANCER), getMessages);

router.post("/message/send", authUser, authRole(ROLE.FREELANCER), sendMessage);

router.post("/skills",authUser, authRole(ROLE.FREELANCER), addSkill);

router.get("/:id", getFreelancerById);


module.exports = router;
