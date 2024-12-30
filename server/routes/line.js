const router = require('express').Router();
const { checkandSendLine } = require('../controllers/lineController');

router.post('/line-result', checkandSendLine);

module.exports = router;