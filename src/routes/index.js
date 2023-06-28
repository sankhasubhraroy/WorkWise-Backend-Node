const router = require("express").Router();

// Ping route
router.get("/ping", (req, res) => {
  console.log(req.start);
  const data = {
    status: "success",
    message: "pong",
    time: new Date().toISOString(),
  };
  res.status(200).json(data);
});

// Auth routes
router.use("/auth", require("./auth"));

// Skills routes
router.use("/skills", require("./skills"));




// Consumer routes
router.use("/consumer", require("./consumer"));

module.exports = router;
