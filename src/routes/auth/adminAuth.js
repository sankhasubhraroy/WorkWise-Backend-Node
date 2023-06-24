const router = require("express").Router();
const { createAdmin, login } = require("../../controllers/auth/adminAuth");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");

router.post("/create-admin", authUser, authRole(ROLE.ADMIN), createAdmin);

router.post("/login", login);

module.exports = router;