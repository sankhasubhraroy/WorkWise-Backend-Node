const {
  getFreelancers,
  getFreelancerById,
  hasAddress,
  hasSkill,
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

router.get("/:id", getFreelancerById);

router.get("/has-address", authUser, authRole(ROLE.FREELANCER), hasAddress);

router.get("/has-skill", authUser, authRole(ROLE.FREELANCER), hasSkill);

router.get("/message/list", authUser, authRole(ROLE.FREELANCER), getConversationList);

router.get("/message/get", authUser, authRole(ROLE.FREELANCER), getMessages);

router.post("/message/send", authUser, authRole(ROLE.FREELANCER), sendMessage);

module.exports = router;
