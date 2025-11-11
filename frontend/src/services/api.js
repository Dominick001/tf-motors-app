import axios from 'axios';


const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL || 'https://tf-motors-backend.onrender.com'
    : 'http://localhost:5000';

console.log('API Base URL:', API_BASE_URL); // Debug log


const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, 
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('API Request:', config.url, 'Token exists:', !!token); // Debug
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        console.log('API Response success:', response.config.url); 
        return response;
    },
    (error) => {
        console.error('API Response error:', error.response?.status, error.config?.url);

        if (error.response?.status === 401) {
            
            localStorage.removeItem('token');
            delete api.defaults.headers.Authorization;
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;