const router = require('express').Router();
const { getGameUrl } = require('../controllers/gameController');

router.post('/game-url', getGameUrl);

module.exports = router;