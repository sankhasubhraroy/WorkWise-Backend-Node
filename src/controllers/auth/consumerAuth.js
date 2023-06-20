const jwt = require("jsonwebtoken");
const Consumer = require("../../models/consumer");
const { google } = require("googleapis");
const {
  hashPassword,
  comparePassword,
} = require("../../helpers/passwordEncrypt");
const { ROLE, AVATAR_IMAGE_SIZE } = require("../../helpers/constants");
const { generateUsername } = require("../../helpers/generateUsername");
const {
  isNameValid,
  isEmailValid,
  isUsernameValid,
  isPhoneValid,
  isPasswordValid,
} = require("../../helpers/validations");

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
      msg: "Server Error",
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
        "Password must contain at least 8 characters, one letter and one number",
    });
  }

  try {
    // Check if consumer already exists
    const doesExist = await Consumer.findOne({ email: email });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    createConsumer(
      {
        name,
        username,
        email,
        phone,
        password: await hashPassword(password),
        avatar: `https://avatars.dicebear.com/api/initials/${name}.svg?size=${AVATAR_IMAGE_SIZE}`,
      },
      res
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: `Server Error ${error.message}`,
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
        msg: "User not exists with this email, Please register first",
      });
    }

    // Check if password is correct
    const isMatch = await comparePassword(password, consumer.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid password",
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
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      (err, token) => {
        if (err) throw err;

        res.status(200).json({
          success: true,
          msg: "User logged in",
          token: token,
          user: consumer,
          type: ROLE.CONSUMER,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

// Logout Consumers and invalidate token
const logout = async (req, res, next) => {
  try {
    const consumer = await Consumer.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      msg: "User logged out",
      consumer,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

//login with google
const loginWithGoogle = (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/api/auth/consumer/google/callback"
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile"],
  });
  res.redirect(authUrl);
};

//callback
const googleCallback = async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/api/auth/consumer/google/callback"
  );
  try {
    if (!req?.query?.code) {
      return res.status(400).json({
        success: false,
        message: "Error logging in with Google",
      });
    }
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }

  var oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  oauth2.userinfo.get(async function (err, response) {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    } else {
      // console.log(response.data);
      const userData = {
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.picture,
        googleId: response.data.id,
        username: await generateUsername(Consumer, response.data.name),
      };
      createConsumer(userData, res);
    }
  });
};

// Create Consumer and generate JWT token
const createConsumer = async (userData, res) => {
  const { email } = userData;

  try {
    // Check if consumer already exists
    let consumer = await Consumer.findOne({ email });
    if (!consumer) {
      const newConsumer = new Consumer(userData);
      await newConsumer.save();
      consumer = newConsumer;
    }

    // Payload for the JWT token
    const payload = {
      user: {
        id: consumer.id,
        type: ROLE.CONSUMER,
      },
    };

    // JWT token generation
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      (err, token) => {
        if (err) throw err;

        res.status(200).json({
          success: true,
          msg: "User registered",
          token: token,
          user: consumer,
          type: ROLE.CONSUMER,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: `Server Error. ${error.message}`,
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
};
