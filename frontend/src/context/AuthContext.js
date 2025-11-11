import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token'); // Consistent with API service
            console.log('Auth check - Token found:', !!token); // Debug

            if (token) {
                // The API interceptor will automatically add this token to requests
                // No need to manually set headers here

                // Verify token is valid by calling /api/auth/me
                const response = await api.get('/api/auth/me');
                console.log('Auth check response:', response.data); // Debug
                setUser(response.data.data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('Login attempt for:', email); // Debug
            const response = await api.post('/api/auth/login', { email, password });
            console.log('Login response:', response.data); // Debug

            if (response.data.success) {
                const { user, token } = response.data.data;

                // Save token to localStorage with consistent key
                localStorage.setItem('token', token); // Consistent with API service
                console.log('Token saved to localStorage'); // Debug

                setUser(user);
                return { success: true };
            }
        } catch (error) {
            console.error('Login error:', error); // Debug
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message };
        }
    };

    const logout = () => {
        console.log('Logging out'); // Debug
        localStorage.removeItem('token'); // Consistent with API service
        setUser(null);
        // Redirect to login page
        window.location.href = '/login';
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};