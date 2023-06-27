const router = require("express").Router();
const {
  validateConsumer,
  register,
  login,
  logout,
  googleCallback,
  loginWithGoogle,
  verifyEmail,
  resendVerificationEmail,
  forgetPassword,
  resetPasswordVerification,
  resetPassword,
} = require("../../controllers/auth/consumerAuth");
const { ROLE } = require("../../helpers/constants");
const { authUser, authRole } = require("../../middlewares/auth");

// Validate consumer and get consumer data
router.get("/", authUser, authRole(ROLE.CONSUMER), validateConsumer);

// Register consumer
router.post("/register", register);

// Login consumer
router.post("/login", login);

// Login with google
router.get("/google", loginWithGoogle);

// Google callback
router.get("/google/callback", googleCallback);

// Email verification
router.get("/verify-email", verifyEmail);

// Resend verification email
router.get(
  "/resend-verification-email",
  authUser,
  authRole(ROLE.CONSUMER),
  resendVerificationEmail
);

// Forget password
router.post("/forget-password", forgetPassword);

// Change password
router.post("/reset-password", resetPassword);

// Logout consumer
router.get("/logout", authUser, authRole(ROLE.CONSUMER), logout);

module.exports = router;
