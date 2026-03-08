import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const register = async (data) => {
        const res = await api.post('/auth/register', data);
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        // Clear all storage specifically
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);

        // Use a timeout to escape the React synthetic event loop. 
        // This is crucial for iOS Safari WebViews (like WhatsApp in-app browser) 
        // which sometimes block immediate programmatic redirects after storage clears.
        setTimeout(() => {
            window.location.replace('/login');
        }, 100);
    };

    const updateUser = (updatedData) => {
        const updated = { ...user, ...updatedData };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
