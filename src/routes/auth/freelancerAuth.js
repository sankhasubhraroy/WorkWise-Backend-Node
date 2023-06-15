const router = require("express").Router();
const { register } = require("../../controllers/auth/freelancerAuth");

router.post("/register", register);

module.exports = router;
