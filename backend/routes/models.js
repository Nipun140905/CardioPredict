const express = require('express');
const router = express.Router();
const { callGetModels } = require('../services/fastApiService');

router.get('/', async (req, res) => {
    try {
        const models = await callGetModels();
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch model metrics', error: error.message });
    }
});

module.exports = router;