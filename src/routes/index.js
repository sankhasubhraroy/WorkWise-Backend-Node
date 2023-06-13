const router = require("express").Router();

// Ping route
router.use("/ping", (req, res) => {
  console.log(req.start);
  const data = {
    status: "success",
    message: "pong",
    time: new Date().toISOString(),
  };
  res.json(data);
});

// Auth routes
router.use("/auth", require("./auth"));

module.exports = router;
