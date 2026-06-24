const express = require('express');
const router = express.Router();
const { createPrediction, getHistory } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPrediction);
router.get('/history', protect, getHistory);

module.exports = router;