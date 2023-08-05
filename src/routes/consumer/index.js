const router = require('express').Router();
const {
    updateEmail,
    updateUsername,
    updatePassword,
    deactivateAccount
} = require('../../controllers/consumer');
const {
    getConversationList,
    getMessages,
    sendMessage
} = require('../../controllers/message/messageController');
const { ROLE } = require('../../helpers/constants');
const { authUser, authRole } = require('../../middlewares/auth');

router.post('/update/email', authUser, authRole(ROLE.CONSUMER), updateEmail);

router.post('/update/username', authUser, authRole(ROLE.CONSUMER), updateUsername);

router.post('/update/password', authUser, authRole(ROLE.CONSUMER), updatePassword);

router.get("/message/list", authUser, authRole(ROLE.CONSUMER), getConversationList);

router.get("/message/get", authUser, authRole(ROLE.CONSUMER), getMessages);

router.post("/message/send", authUser, authRole(ROLE.CONSUMER), sendMessage);

router.get('/deactivate-account', authUser, authRole(ROLE.CONSUMER), deactivateAccount);

module.exports = router;