const mongoose = require("mongoose");
const Product = require("../models/product")

exports.getAddProduct = async (req, res, next) => {
    return res.json({ message: "Add Product Page" });
}

exports.postAddProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const imagePath = req.file.path; // Path to the uploaded image

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            image: `/uploads/${imagePath}`
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};