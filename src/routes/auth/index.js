const router = require("express").Router();

router.use("/consumer", require("./consumerAuth"));

router.use("/freelancer", require("./freelancerAuth"));

router.use("/admin", require("./adminAuth"));

module.exports = router;
