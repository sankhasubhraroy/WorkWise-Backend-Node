const router = require("express").Router();

router.use("/consumer", require("./consumerAuth"));

router.use("/freelancer", require("./freelancerAuth"));

module.exports = router;
