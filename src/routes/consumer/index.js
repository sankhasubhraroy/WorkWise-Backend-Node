const router = require('express').Router();
const {
    updateEmail,
    updateUsername,
    updatePassword,
    deactivateAccount,
    acceptWorkRequest,
    rejectWorkRequest
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

router.get("/message", authUser, authRole(ROLE.CONSUMER), getMessages);

router.post("/message", authUser, authRole(ROLE.CONSUMER), sendMessage);

router.get('/deactivate-account', authUser, authRole(ROLE.CONSUMER), deactivateAccount);

router.put("/accept-work-request", authUser, authRole(ROLE.CONSUMER), acceptWorkRequest);

router.put("/reject-work-request", authUser, authRole(ROLE.CONSUMER), rejectWorkRequest);

module.exports = router;