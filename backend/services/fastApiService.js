const axios = require('axios');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

const fastapiClient = axios.create({
    baseURL: FASTAPI_URL,
    timeout: 25000,
});

const callPredict = async (model, features) => {
    const response = await fastapiClient.post('/predict', { model, ...features });
    return response.data;
};

const callGetModels = async () => {
    const response = await fastapiClient.get('/models');
    return response.data;
};

module.exports = { callPredict, callGetModels };