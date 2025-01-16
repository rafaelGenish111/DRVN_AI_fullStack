const axios = require('axios');

const BASE_URL = 'http:localhost:7070';

const makeRequest = async (endpoint, data) => {
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error in ${endpoint}:`, error.response?.data || error.message);
        throw error;
    };
};

// get user balance
const getUserBalance = (username) => {
    const endpoint = '/api/user/balance';
    const data = { username }
    return makeRequest(endpoint, data);
};

// place bet
const placeBet = (username, lineId, amount, option) => {
    const endpoint = '/bet';
    const data = { username, lineId, amount, option };
    return makeRequest(endpoint, data);
}

// record win 
const recordWin = (betId) => {
    const endpoint = '/win';
    const data = { betId };
    return makeRequest(endpoint, data);
}

// rollback
const rollback = (betId) => {
    const endpoint = '/rollback';
    const data = { betId };
    return makeRequest(endpoint, data);
}

module.exports = {
    getUserBalance,
    placeBet,
    recordWin,
    rollback
}