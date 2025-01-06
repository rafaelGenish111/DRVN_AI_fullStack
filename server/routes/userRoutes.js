const router = require('express').Router();

module.exports = (redisClient) => {
    router.post('/', async (req, res) => {
        const { userId, userData } = req.body;

        try {
            const userKey = `user:${userId}`;
            await redisClient.hmSet(userKey, userData);
            await redisClient.expire(userKey, 60 * 60 * 24);

            res.status(200).send({ message: 'User added succssfully' });
        } catch (error) {
            console, error('Error adding user:', error.message);
            res.status(500).send({ error: 'Internal server error' });
        }
    });
    return router;
};