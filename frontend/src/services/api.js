import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true,
});

export const authAPI = {
    verifyOTP: (data) => api.post('/auth/verify-otp', data),
    resendOTP: (data) => api.post('/auth/resend-otp', data),
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    deleteAccount: () => api.delete('/auth/delete-account'),
};

export const predictAPI = {
    predict: (data) => api.post('/predictions', data),
    getHistory: () => api.get('/predictions/history'),
};

export const modelsAPI = {
    getModels: () => api.get('/models'),
};

export default api;