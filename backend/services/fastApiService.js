const axios = require('axios');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

const callPredict = async (model, features) => {
    const response = await axios.post(`${FASTAPI_URL}/predict`, {
        model,
        ...features
    });
    return response.data;
};

const callGetModels = async () => {
    const response = await axios.get(`${FASTAPI_URL}/models`);
    return response.data;
};

module.exports = { callPredict, callGetModels };