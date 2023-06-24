const router = require("express").Router();
const { createAdmin, login, logout } = require("../../controllers/auth/adminAuth");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");

router.post("/create-admin", authUser, authRole(ROLE.ADMIN), createAdmin);

router.post("/login", login);

router.get("/logout", authUser, authRole(ROLE.ADMIN), logout);

module.exports = router;