const router = require('express').Router();
const drvnService = require('../services/drvnService');

module.exports = (redisClient, io) => {
    router.post('/lines', async (req, res) => {
        const lineData = req.body;

        try {
            await drvnService.saveLineToRedis(redisClient, lineData);
            drvnService.sendLineToClient(lineData, io);

            res.status(200).send({ message: 'Line processed successfully' });
        } catch (error) {
            console.error('Error processing line:', error.message);
            res.status(500).send({ error: "Internal server error" });
        }
    });
    return router;
};