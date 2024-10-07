const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/orders');
const Cart = require('../models/cart'); // Assuming you have a Cart model
require("dotenv").config();

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
    const { total } = req.body;

    const options = {
        amount: total * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}` // Use dynamic receipt ID
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
};

// Verify Razorpay payment and create order
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Payment is verified
        try {
            const userId = req.user._id; // Get user ID from JWT
            const cart = await Cart.findOne({ user: userId }).populate('items.productId');

            // Transfer cart items to order
            const order = new Order({
                user: userId,
                items: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                total: cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0),
                paymentStatus: 'Paid'
            });

            await order.save();

            // Clear the user's cart
            await Cart.findOneAndUpdate({ user: userId }, { items: [] });

            res.json({ success: true, message: 'Payment verified and order created' });
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ error: 'Failed to create order after payment' });
        }
    } else {
        res.status(400).json({ error: 'Invalid signature, payment failed' });
    }
};

// Controller to get all products for the shop page
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.status(200).json(products); // Send products as JSON
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

// Add to cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const user = await User.findById(req.user._id); // Get user from JWT
        const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex >= 0) {
            // Product already in cart, update quantity
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            // Add new product to cart
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Error updating cart', error });
    }
};

// Get cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.productId');

        const items = user.cart.map(item => ({
            product: item.productId,
            quantity: item.quantity
        }));

        res.status(200).json({ items });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save();
        res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
};

// Update cart quantity
exports.updateCartQuantity = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const user = await User.findById(req.user._id);
        const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex >= 0) {
            // Update quantity
            user.cart[cartItemIndex].quantity = quantity;
            await user.save();
            res.status(200).json({ message: 'Cart quantity updated successfully', cart: user.cart });
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ message: 'Error updating cart quantity', error });
    }
};
