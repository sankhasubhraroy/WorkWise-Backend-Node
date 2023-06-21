const router = require("express").Router();
const {
    register,
    login,
    loginWithGoogle,
    googleCallback,
    verifyEmail,
    validateFreelancer,
    resendVerificationEmail,
} = require("../../controllers/auth/freelancerAuth");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");

router.get("/", authUser, authRole(ROLE.FREELANCER), validateFreelancer);

router.post("/register", register);

router.post("/login", login);

router.get("/google", loginWithGoogle);

router.get("/google/callback", googleCallback);

router.get("/verify/email", verifyEmail);

router.get("/resend-email-verification", authUser, authRole(ROLE.FREELANCER), resendVerificationEmail);

module.exports = router;
