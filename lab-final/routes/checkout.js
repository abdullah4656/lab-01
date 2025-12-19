const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { getCart } = require('./cart');
const { checkCartNotEmpty } = require('../middleware/cartMiddleware');

/**
 * Checkout page route
 * Displays checkout form with cart items and total amount
 * Requires cart to not be empty (enforced by checkCartNotEmpty middleware)
 */
router.get('/', getCart, checkCartNotEmpty, async (req, res) => {
    try {
        const cart = req.cart;
        
        // Recalculate total on server side to ensure accuracy
        const totalAmount = await cart.getTotalPrice();
        
        res.render('checkout', {
            title: 'Checkout - E-Commerce Store',
            cart,
            totalAmount: totalAmount.toFixed(2)
        });
    } catch (error) {
        console.error('Error loading checkout:', error);
        next(error); // Proper async error handling
    }
});

/**
 * Process order route
 * Creates a persistent order from cart items
 * Validates customer information and cart contents
 * Clears cart session after successful order creation
 */
router.post('/process', getCart, checkCartNotEmpty, async (req, res, next) => {
    try {
        const cart = req.cart;
        
        // Server-side validation of checkout form inputs
        const customerName = req.body.customerName?.trim();
        const customerEmail = req.body.customerEmail?.trim();
        
        // Validate customer name
        if (!customerName || customerName.length < 2) {
            return res.status(400).json({ 
                error: 'Customer name is required and must be at least 2 characters' 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!customerEmail || !emailRegex.test(customerEmail)) {
            return res.status(400).json({ 
                error: 'Valid email address is required' 
            });
        }
        
        // Filter out deleted products and validate stock
        const validItems = cart.items.filter(item => item.product !== null);
        
        if (validItems.length === 0) {
            return res.status(400).json({ 
                error: 'Cart contains no valid items' 
            });
        }
        
        // Validate stock availability for all items
        for (const item of validItems) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(400).json({ 
                    error: `Product no longer available` 
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    error: `Insufficient stock for ${product.name}` 
                });
            }
        }
        
        // Recalculate total on server side to ensure accuracy
        const totalAmount = await cart.getTotalPrice();
        
        // Create order items with product, quantity, and price
        const orderItems = validItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price // Store price at time of order
        }));
        
        // Create order with simplified structure
        const order = new Order({
            customerName,
            customerEmail,
            items: orderItems,
            totalAmount,
            status: 'Pending' // Default status
        });
        
        await order.save();
        
        // Clear cart session after successful order creation
        cart.items = [];
        await cart.save();
        
        // Redirect to order confirmation page with Order ID
        res.json({ 
            success: true, 
            orderId: order._id 
        });
    } catch (error) {
        console.error('Error processing order:', error);
        // Proper async error handling - pass to Express error handler
        next(error);
    }
});

/**
 * Order confirmation page route
 * Displays order details including Order ID after successful checkout
 */
router.get('/confirmation/:orderId', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('items.product');
        
        if (!order) {
            return res.status(404).render('error', { error: 'Order not found' });
        }
        
        res.render('order-confirmation', {
            title: 'Order Confirmation - E-Commerce Store',
            order
        });
    } catch (error) {
        console.error('Error loading order:', error);
        next(error); // Proper async error handling
    }
});

module.exports = router;

