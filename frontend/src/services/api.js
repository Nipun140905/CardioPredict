import axios from 'axios';

// ---------------------------------------------------------
// 1. THE AUTH BRAIN (Node.js Server)
// Handles logins, signups, and cookies
// ---------------------------------------------------------
const authClient = axios.create({
    baseURL: 'https://cardiopredict-backend-bie9.onrender.com',
    withCredentials: true,
});

// ---------------------------------------------------------
// 2. THE ML BRAIN (FastAPI Python Server)
// Handles predictions and model metrics
// ---------------------------------------------------------
const mlClient = axios.create({
    baseURL: 'https://cardiopredict-90a2.onrender.com',
});

// --- AUTH ENDPOINTS (Routed to Node.js) ---
export const authAPI = {
    verifyOTP: (data) => authClient.post('/auth/verify-otp', data),
    resendOTP: (data) => authClient.post('/auth/resend-otp', data),
    signup: (data) => authClient.post('/auth/signup', data),
    login: (data) => authClient.post('/auth/login', data),
    logout: () => authClient.post('/auth/logout'),
    getMe: () => authClient.get('/auth/me'),
    deleteAccount: () => authClient.delete('/auth/delete-account'),
};

// --- PREDICT ENDPOINTS (Routed to FastAPI) ---
export const predictAPI = {
    // Note: I changed this to '/predict' to match your Python main.py!
    predict: (data) => mlClient.post('/predict', data),

    // Assuming history is also stored via Python? 
    // (If history is in Node, change mlClient to authClient here)
    getHistory: () => mlClient.get('/predictions/history'),
};

// --- MODEL ENDPOINTS (Routed to FastAPI) ---
export const modelsAPI = {
    getModels: () => mlClient.get('/models'),
};

export default { authAPI, predictAPI, modelsAPI };