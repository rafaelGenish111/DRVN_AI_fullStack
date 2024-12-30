const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const privateKey = fs.readFileSync(path.join(__dirname, '../priv/','private_key.pem'), 'utf8');

const createSignature = (data) => {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(JSON.stringify(data));
    sign.end();
    return sign.sign(privateKey, 'base64');
};

const sendRequst = async (endpoint, data) => {
    try {
        const signature = createSignature(data);

        const response = await axios.post(endpoint, data, {
            headers: {
                'X-Hub88-Signature': signature
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error sending request to ${endpoint}:`, error.message);
        throw error;
    };
};

module.exports = {
    sendRequst
};