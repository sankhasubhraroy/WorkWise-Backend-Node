const { google } = require("googleapis");
const crypto = require("crypto");
const Consumer = require("../../models/consumer");
const OTP = require("../../models/otp");
const {
  encryptData,
  decryptData,
} = require("../../helpers/encrypt");
const {
  ROLE,
  GOOGLE_SCOPES,
  DEFAULT_AVATAR,
  GOOGLE_CALLBACK_URL,
} = require("../../helpers/constants");
const { generateUsername } = require("../../helpers/generateUsername");
const {
  isNameValid,
  isEmailValid,
  isUsernameValid,
  isPhoneValid,
  isPasswordValid,
} = require("../../helpers/validations");
const { generateJWT } = require("../../helpers/generateJWT");
const sendMail = require("../../helpers/sendMail");
const {
  getEmailVerificationContent,
  getResetPasswordContent
} = require("../../helpers/mailContent");

// Google OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL(ROLE.CONSUMER)
);

// Token Validation Route for Consumers
const validateConsumer = async (req, res, next) => {
  try {
    const consumer = await Consumer.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      consumer,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
    next();
  }
};

// Register Consumers
const register = async (req, res) => {
  const { name, username, email, phone, password } = req.body;

  // Validations
  if (!isNameValid(name)) {
    return res.status(400).send({
      success: false,
      message: "Please enter a valid name",
    });
  }
  if (!isEmailValid(email)) {
    return res.status(400).send({
      success: false,
      message: "Please enter a valid email address",
    });
  }
  if (!isUsernameValid(username)) {
    return res.status(400).send({
      success: false,
      message: "Username should not contain any special characters",
    });
  }
  if (!isPhoneValid(phone)) {
    return res.status(400).send({
      success: false,
      message: "Please enter a valid phone number",
    });
  }
  if (!isPasswordValid(password)) {
    return res.status(400).send({
      success: false,
      message:
        "Password must contain at least 8 characters, one letter and one number and no special characters",
    });
  }

  try {
    // Check if consumer already exists
    const doesExist = await Consumer.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const userData = {
      name,
      username,
      email,
      phone,
      password: await encryptData(password),
      avatar: DEFAULT_AVATAR(name),
    };

    // Create Consumer in database
    const consumer = await createConsumer(userData);

    // Payload for the JWT token
    const payload = {
      user: {
        id: consumer.id,
        type: ROLE.CONSUMER,
      },
    };

    // Generating a randome key and saving it to database for email verification
    const otp = await new OTP({
      userId: consumer.id,
      userType: ROLE.CONSUMER,
      key: crypto.randomBytes(32).toString("hex"),
    }).save();

    // Sending email to the consumer for email verification
    const mailContent = getEmailVerificationContent(ROLE.CONSUMER, otp);
    const mailSent = await sendMail(email, "Verify Email", mailContent);
    if (!mailSent) {
      throw new Error("Unable to send email");
    }

    // JWT token generation
    const token = await generateJWT(payload);
    return res.status(200).json({
      success: true,
      message: "User logged in",
      token: token,
      user: consumer,
      type: ROLE.CONSUMER,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};

// Login Consumers
const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(email, password);

  // Validations
  if (!isEmailValid(email)) {
    return res.status(400).send({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  try {
    // Check if consumer exists
    const consumer = await Consumer.findOne({
      email: email,
    });

    if (!consumer) {
      return res.status(400).json({
        success: false,
        message: "User not exists with this email, Please register first",
      });
    }

    // Check if password is correct
    if (!consumer.password) {
      return res.status(400).json({
        success: false,
        message: "You don't have a password, please login with Google",
      });
    }
    const isMatch = await decryptData(password, consumer.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Payload for the JWT token
    const payload = {
      user: {
        id: consumer.id,
        type: ROLE.CONSUMER,
      },
    };

    // JWT token generation
    const token = await generateJWT(payload);
    res.status(200).json({
      success: true,
      message: "User logged in",
      token: token,
      user: consumer,
      type: ROLE.CONSUMER,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};

// Logout Consumers and invalidate token
const logout = async (req, res, next) => {
  try {
    const consumer = await Consumer.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      message: "User logged out",
      consumer,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//login with google
const loginWithGoogle = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: GOOGLE_SCOPES,
  });
  res.redirect(authUrl);
};

//callback
const googleCallback = async (req, res) => {
  try {
    // validate the request
    if (!req.query.code) {
      return res.status(400).send({
        success: false,
        message: "Invalid request"
      });
    }

    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    var oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    const userData = {
      name: data.name,
      email: data.email,
      avatar: data.picture,
      googleId: data.id,
      username: await generateUsername(Consumer, data.name),
    };

    // Check if consumer already exists otherwise create one
    const consumer =
      (await Consumer.findOne({ email: userData.email })) ??
      (await createConsumer(userData));

    // Payload for the JWT token
    const payload = {
      user: {
        id: consumer.id,
        type: ROLE.CONSUMER,
      },
    };

    // JWT token generation
    const token = await generateJWT(payload);
    return res.status(200).json({
      success: true,
      message: "User logged in",
      token: token,
      user: consumer,
      type: ROLE.CONSUMER,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: `Server Error ${err.message}`,
    });
  }
};

// Create Consumer and save to database
const createConsumer = async (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const consumer = new Consumer(userData);
      await consumer.save();
      resolve(consumer);
    } catch (error) {
      reject(error);
    }
  });
};

const verifyEmail = async (req, res) => {
  const { id, type, key } = req.query;
  try {
    // Validations
    if (type !== ROLE.CONSUMER) {
      return res.status(400).send({
        success: false,
        message: "Invalid link"
      });
    }

    const consumer = await Consumer.findById(id);
    if (!consumer) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // When the consumer is already verified
    if (consumer.emailVerified) {
      return res.status(400).send({
        success: false,
        message: "Already verified",
      });
    }

    // When consumer exists by that id, checking if the key is valid or not
    const otp = await OTP.findOne({
      userId: id,
      userType: type,
      key,
    });

    // when key doesn't exists || may have expired
    if (!otp) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP or may have expired",
      });
    }

    console.log(key, otp);

    // When key exists and is valid then validate the consumer email
    await consumer.updateOne({
      emailVerified: true,
    });

    // Delete the OTP from database
    await OTP.findByIdAndRemove(otp.id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: `Server Error. ${error.message}`,
    });
  }
};

// Resending the OTP again
const resendVerificationEmail = async (req, res) => {
  try {
    const consumer = await Consumer.findById(req.user.id).select("-password");

    // When consumer don't exists
    if (!consumer) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Already verified
    if (consumer.emailVerified) {
      return res.status(400).send({
        success: false,
        message: "Email already verified",
      });
    }

    // checking if there any existing OTP related with same user
    const existingOTP = await OTP.findOne({
      userId: consumer.id,
      userType: ROLE.CONSUMER,
    });

    // Removing the existing OTP
    if (existingOTP) {
      await OTP.findByIdAndRemove(existingOTP.id);
    }

    // Generating new randome key and saving it to database for email verification
    const otp = await new OTP({
      userId: consumer.id,
      userType: ROLE.CONSUMER,
      key: crypto.randomBytes(32).toString("hex"),
    }).save();

    const content = getEmailVerificationContent(ROLE.CONSUMER, otp);

    const isEmailSent = await sendMail(consumer.email, "Verify Email", content);

    if (!isEmailSent) {
      throw new Error("Unable to send email");
    }

    res.status(200).send({
      success: true,
      message: "Verification link send successfully",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// Send a link to email for reseting the password
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // validations
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    // checking Consumer exists or not
    const consumer = await Consumer.findOne({ email });

    if (!consumer) {
      return res.status(400).send({
        success: false,
        message: "Account doesn't exists",
      });
    }

    // checking if previous OTPs exists related to this consumer
    const existingOTP = await OTP.findOne({
      userId: consumer.id,
      userType: ROLE.CONSUMER
    });

    // Removing the existing OTP
    if (existingOTP) {
      await OTP.findByIdAndRemove(existingOTP.id);
    }

    // Generating new randome key and saving it to database for password reset
    const otp = await new OTP({
      userId: consumer.id,
      userType: ROLE.CONSUMER,
      key: crypto.randomBytes(32).toString("hex"),
    }).save();

    const content = getResetPasswordContent(ROLE.CONSUMER, otp);

    isEmailSent = await sendMail(consumer.email, "Reset Password", content);

    if (!isEmailSent) {
      throw new Error("Unable to send email");
    }

    res.status(200).send({
      success: true,
      message: "Password reset link send successfully",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// Reset the password
const resetPassword = async (req, res) => {
  try {
    const { id, type, key } = req.query;

    // validations
    if (type !== ROLE.CONSUMER) {
      return res.status(400).send({
        success: false,
        message: "Invalid link"
      });
    }

    const consumer = await Consumer.findById(id);

    // When no consumer exists by this id
    if (!consumer) {
      return res.status(400).send({
        success: false,
        message: "Invalid link",
      });
    }

    // When consumer exists by that id, checking if the key is valid or not
    const otp = await OTP.findOne({
      userId: id,
      userType: type,
      key,
    });

    // when key doesn't exists || may have expired
    if (!otp) {
      return res.status(400).send({
        success: false,
        message: "Invalid link or may have expired",
      });
    }

    // encrypting the password and updating when link is valid
    const password = req.body.password;
    const hashedPassword = await encryptData(password);

    await consumer.updateOne({ password: hashedPassword });

    // removing the OTP after reseting the password
    await OTP.findByIdAndRemove(otp.id);

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  validateConsumer,
  register,
  login,
  logout,
  loginWithGoogle,
  googleCallback,
  verifyEmail,
  resendVerificationEmail,
  forgetPassword,
  resetPassword,
};
