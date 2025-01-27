const router = require('express').Router();
const {
    saveDesignConfiguration,
    getOperatorDesignConfiguration
} = require('../services/parseConfigService');

router.post('/save-design', async (req, res) => {
    try {
        const { operatorId, config } = req.body;
        if (!operatorId || !config) {
            return res.status(400).json({ error: 'Missing operatorId or config' });
        };
        console.log('Received operatorId:', operatorId);
        console.log('Received config:', config);
        
        const savedConfig = await saveDesignConfiguration(operatorId, config);
        res.status(200).send({ message: 'Design configuration saved' });
    } catch (error) {
        console.error('Error saving design configuration:', error);
        res.status(500).send({ error: 'Failed to save design configuration.' });
    }
});

router.get('/:operatorId/design-configuration', async (req, res) => {
    const { operatorId } = req.params;

    try {
        const designConfig = await getOperatorDesignConfiguration(operatorId);
        res.status(200).send({ designConfig });
    } catch (error) {
        console.error('Error fetching design configuration:', error);
        res.status(500).send({ error: 'Failed to fetch design configuration.' })
    }
});



module.exports = router;