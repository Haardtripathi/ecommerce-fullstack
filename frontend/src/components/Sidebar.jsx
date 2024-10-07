/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuthCheck from "../hooks/useAuthCheck";

const Sidebar = ({ isOpen }) => {
    const { isAuthenticated, loading, role } = useAuthCheck(); // Include the role

    return (
        <div className={`bg-gray-800 h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="flex flex-col h-full py-4">
                <nav className="mt-10">
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                <span className="ml-3">Home</span>
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <li>
                                <Link to="/shop" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                    <span className="ml-3">Shop</span>
                                </Link>
                            </li>
                        )}

                        <li>
                            <Link to="/about" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                <span className="ml-3">About</span>
                            </Link>
                        </li>
                        {/* Show Cart link only if the user is authenticated and not an admin */}
                        {isAuthenticated && role !== "admin" && (
                            <li>
                                <Link to="/cart" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                    <span className="ml-3">Cart</span>
                                </Link>
                            </li>
                        )}
                        {/* Show Add Product link only if the user is an admin */}
                        {isAuthenticated && role === "admin" && (
                            <li>
                                <Link to="/admin/add-product" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                    <span className="ml-3">Add Product</span>
                                </Link>
                            </li>
                        )}
                        {/* Show Login and Sign Up links only if the user is not authenticated */}
                        {!isAuthenticated && (
                            <>
                                <li>
                                    <Link to="/login" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                        <span className="ml-3">Login</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2">
                                        <span className="ml-3">Sign Up</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
