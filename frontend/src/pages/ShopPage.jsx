/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig.js'; // Adjust the import based on your project structure
import useAuthCheck from "../hooks/useAuthCheck.js";


const API_URL = "http://localhost:5000";

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({}); // Track cart items
    const { isAuthenticated, loading, role } = useAuthCheck();
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading) { // Wait for loading to complete
            if (!isAuthenticated) {
                navigate('/'); // Redirect if not authenticated
            }
        }
    }, [isAuthenticated, loading, navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/products`); // Adjust endpoint as needed
                console.log(response.data)
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (productId, quantity) => {
        setCart((prevCart) => ({
            ...prevCart,
            [productId]: (prevCart[productId] || 0) + quantity,
        }));
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Shop</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-lg p-4">
                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
                        <p className="text-gray-600 mb-2">{product.description.slice(0, 10)}...</p>
                        <p className="text-lg font-bold mb-2">${product.price}</p>
                        <div className="flex items-center">
                            <input
                                type="number"
                                min="1"
                                defaultValue="1"
                                className="border rounded w-16 text-center mr-2"
                                id={`quantity-${product.id}`}
                            />
                            <button
                                onClick={() => handleAddToCart(product.id, parseInt(document.getElementById(`quantity-${product.id}`).value))}
                                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;
