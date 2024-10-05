/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthCheck from "../hooks/useAuthCheck";

const HomePage = () => {
    const { isAuthenticated, loading } = useAuthCheck();
    // console.log(isAuthenticated)
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-6">Welcome to Apna-Bazaar</h1>
            <div className="text-center mb-8">
                <p className="text-xl text-gray-600 mb-4">Your one-stop shop for all your needs</p>
            </div>

            <div className="max-w-4xl mx-auto">
                {isAuthenticated ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
                        <p className="text-gray-600 mb-4">
                            Thank you for being a valued member of our community. Start exploring our latest products or check out our special offers.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/shop"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Browse Shop
                            </Link>
                            <Link
                                to="/profile"
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
                        <p className="text-gray-600 mb-4">
                            Create an account to get started with Apna-Bazaar. Enjoy personalized shopping experiences and exclusive offers.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/login"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                        <p className="text-gray-600">
                            Discover a vast array of products from trusted sellers.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                        <p className="text-gray-600">
                            Competitive prices and regular deals to save you money.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                        <p className="text-gray-600">
                            Quick and reliable shipping to your doorstep.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;