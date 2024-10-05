// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/userController');

// Route to get all products for the shop page
router.get('/products', getAllProducts);

module.exports = router;
