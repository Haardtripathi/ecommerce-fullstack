/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import useAuthCheck from "../hooks/useAuthCheck";
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5000"; // Update this when deployed

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const { isAuthenticated, loading, role } = useAuthCheck();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/');
        } else if (!loading && role !== 'admin') {
            navigate('/'); // Redirect if not an admin
        }
    }, [isAuthenticated, loading, role, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (isAuthenticated && role === 'admin') {
                try {
                    const response = await axios.get(`${API_URL}/admin/users`, { withCredentials: true });
                    setUsers(response.data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };

        fetchUsers();
    }, [isAuthenticated, role]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">User ID</th>
                            <th className="border px-4 py-2">Username</th>
                            <th className="border px-4 py-2">Mobile</th>
                            <th className="border px-4 py-2">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="border px-4 py-2">{user._id}</td>
                                <td className="border px-4 py-2">{user.username}</td>
                                <td className="border px-4 py-2">{user.mobile}</td>
                                <td className="border px-4 py-2">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserPage;
