const redis = require('redis');
require('dotenv').config();


const redisClient = redis.createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
 
});

redisClient.connect()
    .then(() => console.log('connect to Redis!'))
    .catch(error => console.error('redis connection error: ', error))

