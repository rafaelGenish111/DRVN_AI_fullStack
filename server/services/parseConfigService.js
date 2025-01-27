const Parse = require('parse/node');
require('dotenv').config();

Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_MASTER_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;

// save design config.
const saveDesignConfiguration = async (operatorId, config) => {
    const Operator = Parse.Object.extend('Operator');
    const DesignConfigurations = Parse.Object.extend('DesignConfigurations');

    try {
        const designConfig = new DesignConfigurations();
        designConfig.set('icon', config.icon);
        designConfig.set('color', config.color);
        designConfig.set('font', config.font);
        designConfig.set('fontSize', config.fontSize);

        const savedConfig = await designConfig.save();
        console.log('Saved design configuration:', savedConfig.toJSON());

        const query = new Parse.Query(Operator);
        const operator = await query.get(operatorId);
        operator.set('designConfigurations', savedConfig);
        await operator.save();

        return savedConfig;
    } catch (error) {
        console.error('Error saving design configuration:', error);
        throw new Error('Failed to save design configuration.');
    }
};

const getOperatorDesignConfiguration = async (operatorId) => {
    try {
        const Operator = Parse.Object.extend('Operator');
        const query = new Parse.Query(Operator);

        query.include('designConfigurations');
        query.equalTo('objectId', operatorId);

        const operator = await query.first();
        if (!operator) {
            throw new Error(`Operator with ID ${operatorId} not found.`);
        };
        const designConfig = operator.get('designConfigurations');
        if (!designConfig) {
            throw new Error('No design configuration found for this operator.');
        }

        return {
            icon: designConfig.get('icon'),
            color: designConfig.get('color'),
            font: designConfig.get('font'),
            fontSize: designConfig.get('fontSize')
        };
    } catch (error) {
        console.error('Error fetching design configuration:', error);
        throw new Error('Failed to fetch design configuration.')
    }
};

const saveWalletOption = async (name, service, currency) => {
    try {
        const Wallet = Parse.Object.extend('Wallet');
        const wallet = new Wallet();

        wallet.set('name', name);
        wallet.set('service', service);
        wallet.set('currency', currency);

        await wallet.save();
        console.log('wallet options saved successfully');
    } catch (error) {
        console.error('Error saving wallet option:', error.message);
        throw error;
    }
};

const getwalletOptions = async () => {
    try {
        const Wallet = Parse.Object.extend('wallet');
        const query = new Parse.Query(Wallet);

        const results = await query.find();
        return results.map((result) => result.toJSON());
    } catch (error) {
        console.error('Error fetching wallet options:', error.message);
        throw error;
    }
};

const saveOperator = async (name, walletId) => {
    try {
        const Operator = Parse.Object.extend('Operator');
        const operator = new Operator();

        const Wallet = Parse.Object.extend('Wallet');
        const wallet = new Wallet();
        wallet._id = walletId;

        operator.set('name', name);
        operator.set('wallet', wallet);

        await operator.save();
        console.log('Operator saved successfully');
    } catch (error) {
        console.error('Error saving operator:', error.message);
        throw error;
    }
};

const getOperator = async () => {
    try {
        const Operator = Parse.Object.extend('Operator');
        const query = new Parse.Query(Operator);

        const results = await query.find();
        return results.map((result) => result.toJSON());
    } catch (error) {
        console.error('Error fetching operator:', error.message);
        throw error;
    }
};
const getOperatorWithDetails = async (operatorId) => {
    try {
        const Operator = Parse.Object.extend('Operator');
        const query = new Parse.Query(Operator);

        query.include('design');
        query.include('wallet');

        query.equalTo('objectId', operatorId)

        const operator = await query.first();
        if (!operator) {
            throw new Error(`Operator with ID ${operatorId} not found`)
        }
        return operator.toJSON();
    } catch (error) {
        console.error('Error fetching operatorwith details:', error.message);
        throw error;
    }
};

module.exports = {
    saveWalletOption,
    getwalletOptions,
    saveOperator,
    getOperator,
    getOperatorWithDetails,
    saveDesignConfiguration,
    getOperatorDesignConfiguration
};