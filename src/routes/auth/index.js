const router = require("express").Router();
router.use("/consumer", require("./consumerAuth"));

module.exports = router;
