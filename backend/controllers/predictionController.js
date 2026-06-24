const Prediction = require('../models/Prediction');
const { callPredict, callGetModels } = require('../services/fastApiService');

// POST /predictions
const createPrediction = async (req, res) => {
    try {
        const { model, ...features } = req.body;

        // Call FastAPI
        const result = await callPredict(model || 'hybrid', features);

        // Save to MongoDB
        const prediction = await Prediction.create({
            user_id: req.user._id,
            ...features,
            model_used: result.model_used,
            probability: result.probability,
            risk_level: result.risk_level,
            threshold_used: result.threshold_used,
            feature_importance: result.feature_importance
        });

        res.status(201).json({
            prediction_id: prediction._id,
            ...result
        });
    } catch (error) {
        if (error.response?.status === 422) {
            return res.status(422).json({
                message: 'Validation error from ML model',
                details: error.response.data
            });
        }
        res.status(500).json({ message: 'Prediction failed', error: error.message });
    }
};

// GET /predictions/history
const getHistory = async (req, res) => {
    try {
        const predictions = await Prediction.find({ user_id: req.user._id })
            .sort({ timestamp: -1 });

        res.status(200).json({ predictions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history', error: error.message });
    }
};

module.exports = { createPrediction, getHistory };