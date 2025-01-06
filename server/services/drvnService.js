const hub88Service = require('./hub88Service');
const dualSoftService = require('./dualSoftService');
const redisClient = require('./redisService');

const WALLET_PROVIDER = 'HUB88';

// manage wallet
const manageWallet = async (action, data) => {
    if (WALLET_PROVIDER === 'HUB88') {
        return await manageWalletWithHub88(action, data);
    } else if (WALLET_PROVIDER === 'DUALSOFT') {
        return await manageWalletWithDualsoft(action, data)
    } else {
        throw new Error('Unsupported wallet');
    };
};

// manage via Hub88
const manageWalletWithHub88 = async (action, data) => {
    switch (action) {
        case 'GET_BALANCE':
            return await hub88Service.getUserBalance(data.requestUuid, data.user, data.currency);
        case 'PLACE_BET':
            return await hub88Service.placeBet(
                data.requestUuid,
                data.user,
                data.currency,
                data.amount,
                data.gameCode,
                data.roundId,
                data.transactionUuid
            );
        case 'RECORD_WIN':
            return await hub88Service.recordWin(
                data.requestUuid,
                data.user,
                data.currency,
                data.amount,
                data.gameCode,
                data.roundId,
                data.transactionUuid
            );
        case 'ROLLBACK':
            return await hub88Service.rollbackTransaction(
                data.requestUuid,
                data.user,
                data.currency,
                data.transactionUuid
            );
        default:
            throw new Error('Unsupported action for Hub88');
    }
};

// manage via DualSoft
const manageWalletWithDualsoft = async (action, data) => {
    switch (action) {
        case 'GET_BALANCE':
            return dualSoftService.getUserInfo(data.username, data.password, data.userUuid, data.sessionId);
        case 'PLACE_BET':
            return await dualSoftService.ticketPayin(
                data.username,
                data.password,
                data.sessionId,
                data.application,
                data.ticketId,
                data.receivedDate,
                data.reservationUuid,
                data.externalTransactionId,
                data.ticketDetails
            );
        case 'RECORD_WIN':
            return await dualSoftService.ticketWon(
                data.username,
                data.password,
                data.application,
                data.ticketId,
                data.reservationUuid,
                data.externalTransactionId,
                data.ticketDetails,
                data.applicationProducer
            );
        case 'ROLLBACK':
            return await dualSoftService.rollbackWithoutReservation(
                data.username,
                data.password,
                data.application,
                data.userUuid,
                data.accountType,
                data.externalTransactionId,
                "BET",
                data.ticketId,
                data.ticketDetails,
                data.applicationProducer
            )
        default:
            throw new Error('Unsupported action for Dualsoft');
    }
};

// save line to redis
const saveLineToRedis = async (line) => {
    const lineKey = `line:${line.lineId}`;
    await redisClient.hmSet(lineKey, {
        status: line.action,
        metadata: JSON.stringify(line.metadata),
        odds: line.suggestedOdds,
        configuration: JSON.stringify(line.configurations)
    })
    await redisClient.expire(lineKey, 60 * 60);
    console.log(`Line ${line.lineId} saved in Redis`);
};

// check if line is open in redis
const isLineOpen = async (lineId) => {
    const lineKey = `line:${lineId}`;
    const lineData = await redisClient.hGetAll(lineKey);
    return lineData.status === 'open';
};

// recive lines via Webhook
const receiveLines = async (lineData) => {
    const { lineId, action, metadata, suggestedOdds, configurations } = lineData;
    console.log('Recived line:', lineId, action, metadata);

    await saveLineToRedis(lineData);

    io.emit('line_update', lineData);

    if (action === 'open') {
        console.log(`Line ${lineId} opened with odds:`, suggestedOdds);
    } else if (action === 'close') {
        console.log(`Line ${lineId} closed`);
    }
};

// create bet
const createBet = async (user, currency, amount, gameCode, roundId, transactionUuid) => {
    console.log(`Creating bet for user: ${user}, amount: ${amount}, gameCode: ${gameCode}`);
    const balance = await manageWallet('GET_BALANCE', { requestUuid: transactionUuid, user, currency });
    if (balance.result.balance < amount) {
        throw new Error('Insufficient funds');
    }

    return await manageWallet('PLACE_BET', {
        requestUuid: transactionUuid,
        user,
        currency,
        amount,
        gameCode,
        roundId,
        transactionUuid
    });
};

// send bet
const recordWin = async (user, currency, amount, gameCode, roundId, transactionUuid) => {
    console.log(`Recording win for user: ${user}, amount: ${amount}, game code: ${gameCode}`);
    return await manageWallet('RECORD_WIN', {
        requestUuid: transactionUuid,
        user,
        currency,
        amount,
        gameCode,
        roundId,
        transactionUuid
    });
};

const rollbackBet = async (user, currency, transactionUuid) => {
    console.log(`Rolling back bet for user: ${user}, transactionUuid: ${transactionUuid}`);
    return await manageWallet('ROLLBACK', {
        requestUuid: transactionUuid,
        user,
        currency,
        transactionUuid
    });
};

module.exports = {
    receiveLines,
    createBet,
    recordWin,
    rollbackBet,
    saveLineToRedis,
    isLineOpen
};