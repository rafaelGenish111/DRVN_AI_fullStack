const axios = require('axios');

const BASE_URL = 'https://dualsoft';

// make requests
const makeRequest = async (endpoint, data) => {
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error in ${endpoint}:`, error.response?.data || error.message);
        throw error;
    }
};

// get user info
const getUserInfo = async (username, password, userUuid, sessionId, accountType = 'INTERNET') => {
    const endpoint = '/userInfoJson';
    const data = {
        UserInfoRequest: { username, password, userUuid, sessionId, accountType }
    };
    return makeRequest(endpoint, data);
};

//create reservation
const createReservation = async (username, password, userUuid, sessionId, amount, ccy, reservationType, accountType = 'INTERNET') => {
    const endpoint = '/createReservationJson';
    const data = {
        createReservationRequest: {
            username, password, userUuid, sessionId, amount, ccy, reservationType, accountType
        }
    };
    return makeRequest(endpoint, data);
};

// cancel reservation
const cancelReservation = async (username, password, uuid) => {
    const endpoint = '/cancelReservationJson';
    const data = {
        cancelReservationRequest: {
            username, password, uuid
        }
    };
    return makeRequest(endpoint, data);
};

// ticket payin
const ticketPayin = async (username, password, sessionId, application, ticketId, recivedData, reservationUuid, domain, externalTransactionId, ticketDetails, applicationProducer) => {
    const endpoint = '/ticketPayinJson';
    const data = {
        cancelReservationRequest: {
            username, password, sessionId, application, ticketId, recivedData, reservationUuid, domain, externalTransactionId, ticketDetails, applicationProducer
        }
    };
    return makeRequest(endpoint, data);
};

// ticket payen without reservation
const ticketPayinWithoutReservation = async (username, password, sessionId, application, ticketId, recivedData, userUuid, reservationUuid, externalTransactionId, amount, ccy, ticketDetails, accountType = 'INTERNET', applicationProducer) => {
    const endpoint = '/ticketPayinWithoutReservationjson';
    const data = {
        cancelReservationRequest: {
            username, password, sessionId, application, ticketId, recivedData, userUuid, reservationUuid, externalTransactionId, amount, ccy, ticketDetails, accountType, applicationProducer
        }
    };
    return makeRequest(endpoint, data);
};

// cancel ticket payin
const cancelTicketPayin = async (username, password, sessionId, application, ticketId, reservationUuid, externalTransactionId, applicationProducer) => {
    const endpoint = '/cancelTicketPayinJson';
    const data = {
        cancelReservationRequest: {
            username, password, sessionId, application, ticketId, reservationUuid, externalTransactionId, applicationProducer
        }
    };
    return makeRequest(endpoint, data);
};

// ticket won
const ticketWon = async (username, password, application, ticketId, reservationUuid, externalTransactionId, ticketDetails, applicationProducer) => {
    const endpoint = '/ticketWonJson';
    const data = {
        cancelReservationRequest: {
            username, password, application, ticketId, reservationUuid, externalTransactionId, ticketDetails, applicationProducer
        }
    };
    return makeRequest(endpoint, data);
};

// ticket lost 
const ticketLost = async (username, password, application, ticketId, ticketDetails) => {
    const endpoint = '/ticketLostJson';
    const data = {
        cancelReservationRequest: {
            username, password, application, ticketId, ticketDetails
        }
    };
    return makeRequest(endpoint, data);
};

// rollback without reservation
const rollbackWithoutReservation = async (username, password, application, userUuid, accountType, externalTransactionId, rollbackType, ticketId, ticketDetails, applicationProducer) => {
    const endpoint = '/rollbackWithoutReservationJson';
    const data = {
        cancelReservationRequest: {
            username, password, application, userUuid, accountType, externalTransactionId, rollbackType, ticketId, ticketDetails, applicationProducer
        }
    };
    return makeRequest(endpoint, data);
};


// get open ticket
const getOpenTickets = async (username, password, application) => {
    const endpoint = '/getOpenTicketsJson';
    const data = {
        cancelReservationRequest: {
            username, password, application
        }
    };
    return makeRequest(endpoint, data);
};

// create locked bonus 
const createLockedBonus = async (username, password, providerBonusCode, userUuid, accountType, amount, ccy, requiredTurnover,expiryDate, externalTransactionId, application) => {
    const endpoint = '/createLockedBonusJson';
    const data = {
        cancelReservationRequest: {
            username, password, providerBonusCode, userUuid, accountType, amount, ccy, requiredTurnover,expiryDate, externalTransactionId, application
        }
    };
    return makeRequest(endpoint, data);
};

// update locked bonus turnover
async function updateLockedBonusTurnover(username, password, userUuid, userBonusId, currentTurnover) {
    const endpoint = "/updateLockedBonusTurnoverJson";
    const data = {
        UpdateLockedBonusTurnoverRequest: { username, password, userUuid, userBonusId, currentTurnover }
    };
    return makeRequest(endpoint, data);
}

// Unlock bonus
async function unlockBonus(username, password, userUuid, userBonusId, amountToUnlock) {
    const endpoint = "/unlockBonusJson";
    const data = {
        UnlockBonusRequest: { username, password, userUuid, userBonusId, amountToUnlock }
    };
    return makeRequest(endpoint, data);
}

// Get locked bonuses
async function getLockedBonuses(username, password, userUuid) {
    const endpoint = "/getLockedBonusesJson";
    const data = {
        GetLockedBonusesRequest: { username, password, userUuid }
    };
    return makeRequest(endpoint, data);
}

// Get unlocked bonuses
async function getUnlockedBonuses(username, password, userUuid) {
    const endpoint = "/getUnlockedBonusesJson";
    const data = {
        GetUnlockedBonusesRequest: { username, password, userUuid }
    };
    return makeRequest(endpoint, data);
}

module.exports = {
    getUserInfo,
    createReservation,
    cancelReservation,
    ticketPayin,
    ticketPayinWithoutReservation,
    cancelTicketPayin,
    ticketWon,
    ticketLost,
    rollbackWithoutReservation,
    getOpenTickets,
    createLockedBonus,
    updateLockedBonusTurnover,
    unlockBonus,
    getLockedBonuses,
    getUnlockedBonuses
};