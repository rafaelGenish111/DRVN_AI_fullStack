const { v4: uuidv4 } = require('uuid');
const {sendRequst} = require('../services/hub88Service');

exports.getGameUrl = async (req, res) => {
    const { playerId, currency } = req.body;

    try {
        const walletData = { playerId };
        const walletResponse = await sendRequst('https://hub88/api/wallet/balance', walletData);
        const balance = walletResponse.balance;

        if (balance <= 0) {
            return res.status(400).json({ err: true, msg: 'Insufficient balance' });
        }

        const gameData = {
            currency,
            token: uuidv4()
        };
        const gameUrlResponse = await sendRequst('https://hub88/api/game/url', gameData);
        res.status(200).json({ err: false, gameUrl: gameUrlResponse.data.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: true, msg: 'Failed to fatch game URL' })
    }
};