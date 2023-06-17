const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }

  try {
    await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({
          msg: "Invalid token",
        });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.log("Something wend wrong with middleware " + err);
    res.json(500).json({
      msg: "Server error",
    });
  }
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.type !== role) {
      res.status(401);
      return res.send("Unauthorized");
    }
    next();
  };
}

module.exports = { authUser, authRole };
