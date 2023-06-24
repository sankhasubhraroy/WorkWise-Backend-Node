const router = require("express").Router();
const {
    register,
    login,
    loginWithGoogle,
    googleCallback,
    verifyEmail,
    validateFreelancer,
    resendVerificationEmail,
    resetPassword,
    forgetPassword,
    logout,
} = require("../../controllers/auth/freelancerAuth");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");

router.get("/", authUser, authRole(ROLE.FREELANCER), validateFreelancer);

router.post("/register", register);

router.post("/login", login);

router.get("/google", loginWithGoogle);

router.get("/google/callback", googleCallback);

router.get("/verify-email", verifyEmail);

router.get("/resend-verification-email", authUser, authRole(ROLE.FREELANCER), resendVerificationEmail);

router.post("/forget-password", forgetPassword);

router.post("/reset-password", resetPassword);

router.get("/logout", authUser, authRole(ROLE.FREELANCER), logout);

module.exports = router;
