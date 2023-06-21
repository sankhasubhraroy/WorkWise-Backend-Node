const router = require("express").Router();
const {
    register,
    login,
    loginWithGoogle,
    googleCallback,
    verifyEmail,
} = require("../../controllers/auth/freelancerAuth");

router.post("/register", register);

router.post("/login", login);

router.get("/google", loginWithGoogle);

router.get("/google/callback", googleCallback);

router.get("/verify/email", verifyEmail);

module.exports = router;
