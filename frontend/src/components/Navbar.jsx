/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from '../axiosConfig.js';
import useAuthCheck from "../hooks/useAuthCheck.js";

const API_URL = 'https://ecommerce-fullstack-tvzc.onrender.com';

const Navbar = ({ toggleSidebar }) => {
    const { isAuthenticated, loading, role, setIsAuthenticated } = useAuthCheck();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
            setIsAuthenticated(false);  // Update authentication state
            navigate("/login");  // Navigate to the homepage (or login) after logging out
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="flex justify-between items-center h-16 px-4">
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 mr-4 text-gray-500 hover:text-gray-600 border-2 border-gray-300 rounded-md"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link to="/" className="text-2xl font-bold text-blue-500">Apna-Bazaar</Link>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>
                    {isAuthenticated && (
                        <Link to="/shop" className="text-gray-600 hover:text-blue-500">Shop</Link>
                    )}
                    <Link to="/about" className="text-gray-600 hover:text-blue-500">About</Link>

                    {/* Show Cart link only if the user is not an admin */}
                    {isAuthenticated && role !== "admin" && (
                        <Link to="/cart" className="text-gray-600 hover:text-blue-500">Cart</Link>
                    )}

                    {role === "admin" && (
                        <Link to="/admin/add-product" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Add Product
                        </Link>
                    )}

                    {!loading && (
                        isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                Login
                            </Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;
