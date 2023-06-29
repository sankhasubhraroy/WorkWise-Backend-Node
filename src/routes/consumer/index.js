const router = require('express').Router();
const {
    updateEmail,
    updateUsername,
    updatePassword
} = require('../../controllers/consumer');
const { ROLE } = require('../../helpers/constants');
const { authUser, authRole } = require('../../middlewares/auth');

router.post('/update/email', authUser, authRole(ROLE.CONSUMER), updateEmail);

router.post('/update/username', authUser, authRole(ROLE.CONSUMER), updateUsername);

router.post('/update/password', authUser, authRole(ROLE.CONSUMER), updatePassword);

module.exports = router;