const jwt = require("jsonwebtoken");
const Consumer = require("../../models/consumer");
const {
  hashPassword,
  comparePassword,
} = require("../../helpers/passwordEncrypt");
const { ROLE } = require("../../helpers/constants");

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

  try {
    let doesExist = await Consumer.findOne({ email: email });

    if (doesExist) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    let consumer = new Consumer();

    consumer.name = name;
    consumer.username = username;
    consumer.email = email;
    consumer.phone = phone;

    consumer.password = await hashPassword(password);

    let size = 200;
    consumer.avatar = `https://avatars.dicebear.com/api/initials/${name}.svg?size=${size}`;

    await consumer.save();

    const payload = {
      user: {
        id: consumer.id,
        type: ROLE.CONSUMER,
      },
    };

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
  } catch (err) {
    console.log(err);
    res.status(402).json({
      success: false,
      message: `Something error occured. ${err.message}`,
    });
  }
};

// Login Consumers
const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

  try {
    let consumer = await Consumer.findOne({
      email: email,
    });

    if (!consumer) {
      return res.status(400).json({
        success: false,
        msg: "User not exists go & register to continue.",
      });
    }

    const isMatch = await comparePassword(password, consumer.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid password",
      });
    }

    const payload = {
      user: {
        id: consumer.id,
        type: ROLE.CONSUMER,
      },
    };

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

module.exports = { validateConsumer, register, login, logout };
