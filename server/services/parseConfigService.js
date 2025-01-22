const Parse = require('parse/node');

Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_MASTER_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;

const saveDesignOption = async (name, colors, layout) => {
    try {
        const Design = Parse.Object.extend('Design');
        const design = new Design();

        design.set('name', name);
        design.set('colors', colors);
        design.set('layout', layout);

        await design.save();
        console.log('Design options saved successfully');
    } catch (error) {
        console.error('Error saving option:', error.message);
        throw error;
    }
};

const getDesignOptions = async () => {
    try {
        const Design = Parse.Object.extend('Design');
        const query = new Parse.Query(Design);

        const results = await query.find();
        return results.map((result) => result.toJSON());
    } catch (error) {
        console.error('Error fetching design options:', error.message);
        throw error;
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

module.exports = {
    saveDesignOption,
    getDesignOptions,
    saveWalletOption,
    getwalletOptions
}