import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cardiopredict-backend-bie9.onrender.com',
    withCredentials: true,
});

export const authAPI = {
    googleAuth: (credential) => api.post('/auth/google', { credential }),
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