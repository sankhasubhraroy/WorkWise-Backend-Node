const router = require("express").Router();
const { createAdmin } = require("../../controllers/auth/adminAuth");

router.post("/create-admin", createAdmin);

module.exports = router;