import { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const API_URL = "https://ecommerce-fullstack-tvzc.onrender.com";

const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const response = await axios.get(`${API_URL}/check-auth`, {
                    withCredentials: true
                });

                if (isMounted) {
                    setIsAuthenticated(response.data.isAuthenticated);
                    setRole(response.data.role || '');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (isMounted) {
                    setIsAuthenticated(false);
                    setRole('');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    return { isAuthenticated, loading, role, setIsAuthenticated };
};

export default useAuthCheck;    