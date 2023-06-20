const jwt = require("jsonwebtoken");

exports.generateJWT = async (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      (err, token) => {
        if (err){ 
            reject(err);
            throw err;
        }
        resolve(token);
      }
    );
  });
};
