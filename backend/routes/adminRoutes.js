const express = require('express');
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const upload = require('../config/multerConfig');


const router = express.Router();


router.post('/add-product', isAuthenticated, upload.single('image'), adminController.postAddProduct);

module.exports = router