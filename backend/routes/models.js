const express = require('express');
const router = express.Router();
const { callGetModels } = require('../services/fastApiService');

router.get('/', async (req, res) => {
    try {
        const models = await callGetModels();
        res.status(200).json(models);
    } catch (error) {
        console.error('FastAPI /models error:', error.message);
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            return res.status(503).json({
                message: 'ML service is waking up. Please wait 30 seconds and refresh.',
                retryable: true
            });
        }
        res.status(500).json({ message: 'Failed to fetch model metrics', error: error.message });
    }
});

module.exports = router;