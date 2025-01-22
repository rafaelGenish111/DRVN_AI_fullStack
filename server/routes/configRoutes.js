const router = require('express').Router();
const ParseConfigService = require('../services/parseConfigService');

router.post('/design', async (req, res) => {
    const { name, colors, layout } = req.body;
    
    try {
        await ParseConfigService.saveDesignOption(name, colors, layout);
        res.status(200).json({ message: 'Design option saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

router.get('/design', async (req, res) => {
    try {
        const designs = await ParseConfigService.getDesignOptions();
        res.status(200).json(designs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

module.exports = router;