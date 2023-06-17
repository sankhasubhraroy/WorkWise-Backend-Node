const router = require("express").Router();
const {
  validateConsumer,
  register,
  login,
  logout,
} = require("../../controllers/auth/consumerAuth");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");

router.get("/", authUser, authRole(ROLE.CONSUMER), validateConsumer);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", authUser, authRole(ROLE.CONSUMER), logout);
module.exports = router;
