const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    // 13 input features
    age: Number,
    sex: Number,
    cp: Number,
    trestbps: Number,
    chol: Number,
    fbs: Number,
    restecg: Number,
    thalach: Number,
    exang: Number,
    oldpeak: Number,
    slope: Number,
    ca: Number,
    thal: Number,
    // prediction results
    model_used: String,
    probability: Number,
    risk_level: String,
    threshold_used: Number,
    feature_importance: Object
});

module.exports = mongoose.model('Prediction', predictionSchema);