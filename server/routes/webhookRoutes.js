const router = require('express').Router();
const drvnService = require('../services/drvnService');

module.exports = ( redisClient,io) => {
    router.post('/lines', async (req, res) => {

        const lineData = req.body;
        console.log("Received data:", lineData);
        console.log('Options received:', lineData.options);
        if (!lineData || !lineData.id || !lineData.action) {
            return res.status(400).send({ error: 'Invalid line data' });
        };
        try {
            if (lineData.action === 'close') {
                return console.log(`Line ${lineData.id} closed`);
            }
            if (lineData.options && typeof lineData.options === 'object' && !Array.isArray(lineData.options)) {

                lineData.options = Object.values(lineData.options);
                console.log('Processed options as object:', lineData.options);
            } else if (Array.isArray(lineData.options)) {

                lineData.options = lineData.options.map(option => Object.values(option));
                console.log('Processed options as array:', lineData.options);
            } else {
                console.error('Invalid options format:', lineData.options);
                return res.status(400).send({ error: 'Invalid options format' });
            }

            await drvnService.saveLineToRedis(lineData);
            console.log(`Line ${lineData.id} saved in Redis`);

            try {
                console.log('Preparing to emit data...');
                console.log('Line data before emit:', lineData);

                io.emit('line_update', lineData);
                console.log('line sended to client');
            } catch (error) {
                console.error('Error sending line to client:', error.message);
            }

            res.status(200).send({ message: 'Line processed successfully' });
        } catch (error) {
            console.error('Error processing line:', error.message);
            res.status(500).send({ error: "Internal server error" });
        }
    });
    return router;
};