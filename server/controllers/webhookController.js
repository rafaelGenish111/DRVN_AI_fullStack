const redisClient = require('../services/redisService');

exports.handleWebhook = async (req, res) => {
    try {
        const lineData = req.body;
    
        console.log('Recived Line Data:', lineData);
    
        const lineKey = `line:${lineData.line_id}`;
        await redisClient.hSet(lineKey, {
            ...lineData
        });
        await redisClient.expire(lineKey, 3600)
    
        await redisClient.publish('line_updates', JSON.stringify(lineData))
    
        res.status(200).json({err: false, msg: 'Webhook recived'}); 
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).JSON({err: true, msg: 'Internal server error'})
    }
}