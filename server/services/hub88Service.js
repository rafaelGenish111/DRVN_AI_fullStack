const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE_URL = 'https://hub88';

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../priv/','private_key.pem'), 'utf8');
const PUBLIC_KEY_HUB88 = 'public_key_hub88';

// sign requests
const signRequest = (data) => {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(JSON.stringify(data));
    return signer.sign(PRIVATE_KEY, 'base64');
};

// verify signature
const verifySignature = (data, signature) => {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(JSON.stringify(data));
    return verifier.verify(PUBLIC_KEY_HUB88, signature, 'base64');
};

// make requests
const makeRequest = async (endpoint, data) => {
    const signature = signRequest(data);
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
            headers: {
                "Content-Type": "application/json",
                "X-Hub88-Signature": signature
            }
        });
        return response.data
    } catch (error) {
        console.error(`Error in ${endpoint}:`, error.response?.data || error.message);
        throw error;
    }
}

// get game URL
const getGameUrl = async (user, country, currency, operatorId, token, platform, gameCode, lang, lobbyUrl, ip) => {
    const endpoint = '/game/url';
    const data = {
        user, country, currency, operator_id: operatorId, token, platform, game_code: gameCode, lang, lobby_url: lobbyUrl, ip
    }
    return makeRequest(endpoint, data);
};

// get user balance
const getUserBalance = (requestUuid, user, currency) => {
    const endpoint = "/supplier/generic/v2/user/balance";
    const data = { request_uuid: requestUuid, user, currency };
    return makeRequest(endpoint, data);
}

// place bet
const placeBet = (requestUuid, user, currency, amount, gameCode, roundId, transactionUuid) => {
    const endpoint = "/supplier/generic/v2/transaction/bet";
    const data = {
        request_uuid: requestUuid, user, currency, amount, game_code: gameCode, round_id: roundId, transaction_uuid: transactionUuid
    };
    return makeRequest(endpoint, data);
}

// record win
const recordWin = (requestUuid, user, currency, amount, gameCode, roundId, transactionUuid) => {
    const endpoint = "/supplier/generic/v2/transaction/win";
    const data = {
        request_uuid: requestUuid, user, currency, amount, game_code: gameCode, round_id: roundId, transaction_uuid: transactionUuid
    };
    return makeRequest(endpoint, data);
}

// rollback transaction
const rollbackTransaction = (requestUuid, user, currency, transactionUuid) => {
    const endpoint = "/supplier/generic/v2/transaction/rollback";
    const data = {
        request_uuid: requestUuid, user, currency, transaction_uuid: transactionUuid
    };
    return makeRequest(endpoint, data);
}

module.exports = {
    getGameUrl,
    getUserBalance,
    placeBet,
    recordWin,
    rollbackTransaction,
};