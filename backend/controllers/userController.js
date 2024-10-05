// controllers/userController.js
const Product = require('../models/product'); // Assuming you're using a Product model

// Controller to get all products for the shop page
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        // console.log(products)
        res.status(200).json(products); // Send products as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};
