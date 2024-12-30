const axios = require('axios');
const redisClient = require('../services/redisService');

exports.checkandSendLine = async (req, res) => {
    const { lineId } = req.body;

    const lineKey = `line:${lineId}`;
    const lineData = await redisClient.hgetall(lineKey);

    if (!lineData || lineData.action !== 'closed') {
        return res.status(400).json({ err: true, msg: 'Line is not closed or doesw not exist' });
    }
    try {
        await axios.post('https://drvn-ai/api/line-results', lineData);

        res.status(200).json({ err: false, msg: 'line result send successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: true, msg: 'Failed to send line result' });
    }
};