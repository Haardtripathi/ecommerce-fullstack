/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig.js';
import useAuthCheck from "../hooks/useAuthCheck.js";

const API_URL = "http://localhost:5000";

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Create a ref for the file input

    const { isAuthenticated, loading, role } = useAuthCheck();

    useEffect(() => {
        if (!loading && isAuthenticated && role) {
            if (role !== "admin") {
                navigate('/');
            }
        }
    }, [isAuthenticated, loading, navigate, role]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || !price || !image) {
            setError('All fields are required.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);

        try {
            const response = await axios.post(`${API_URL}/admin/add-product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Reset form fields
            setName('');
            setDescription('');
            setPrice('');
            setImage(null);
            setImagePreview(null);
            setError('');
            fileInputRef.current.value = ''; // Clear the file input field
            alert('Product added successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="image">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border rounded w-full py-2 px-3"
                            ref={fileInputRef} // Attach the ref to the file input
                            required
                        />
                    </div>
                    {imagePreview && (
                        <div className="mb-4">
                            <h2 className="text-center">Uploaded Image:</h2>
                            <img src={imagePreview} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    )}
                    <button type="submit" className="bg-blue-500 text-white rounded w-full py-2 hover:bg-blue-600">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProductPage;
