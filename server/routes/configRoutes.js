const router = require('express').Router();
const ParseConfigService = require('../services/parseConfigService');

router.post('/wallet', async (req, res) => {
    const { name, service, currency } = req.body;
    
    try {
        await ParseConfigService.saveWalletOption(name, service, currency);
        res.status(200).json({ message: 'Wallet option saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

router.get('/wallet', async (req, res) => {
    try {
        const wallets = await ParseConfigService.getwalletOptions();
        res.status(200).json(wallets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/operator', async (req, res) => {
    const { name, walletId } = req.body;
    
    try {
        await ParseConfigService.saveOperator(name, walletId);
        res.status(200).json({ message: 'Operator saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

router.get('/operator', async (req, res) => {
    try {
        const operator = await ParseConfigService.getOperator();
        res.status(200).json(operator);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/operator/:id/details', async (req, res) => {
    const { id } = req.params;
    try {
        const operator = await ParseConfigService.getOperatorWithDetails(id);
        res.status(200).json(operator);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;