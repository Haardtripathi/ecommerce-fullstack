import { useState, useEffect } from 'react';
import axios from '../axiosConfig';


const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await axios.get(`/check-auth`, {
                withCredentials: true
            });
            setIsAuthenticated(response.data.isAuthenticated);
            setRole(response.data.role || '');
            window.dispatchEvent(new Event('authChange'));
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setRole('');
            window.dispatchEvent(new Event('authChange'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post(`/logout`, {}, { withCredentials: true });
            setIsAuthenticated(false);
            setRole('');
            window.dispatchEvent(new Event('authChange'));
            return { success: true };
        } catch (error) {
            console.error('Logout failed:', error);
            return { success: false, error: error.response?.data?.message || 'Logout failed' };
        }
    };

    return { isAuthenticated, loading, role, checkAuth, logout, setIsAuthenticated, setRole };
};

export default useAuthCheck;
