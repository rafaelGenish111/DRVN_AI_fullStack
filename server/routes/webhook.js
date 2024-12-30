const router = require('express').Router();
const { handleWebhook } = require('../controllers/webhookController');

router.post('/webhook', handleWebhook);

module.exports = router;