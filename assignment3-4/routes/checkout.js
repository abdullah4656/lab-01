const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { getCart } = require('./cart');

// Checkout page
router.get('/', getCart, async (req, res) => {
    try {
        const cart = req.cart;
        
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }
        
        const subtotal = await cart.getTotalPrice();
        const shipping = 10.00;
        const tax = subtotal * 0.10; // 10% tax
        const total = subtotal + shipping + tax;
        
        res.render('checkout-new', {
            title: 'Checkout - E-Commerce Store',
            cart,
            pricing: {
                subtotal: subtotal.toFixed(2),
                shipping: shipping.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2)
            }
        });
    } catch (error) {
        console.error('Error loading checkout:', error);
        res.status(500).render('error', { error: 'Error loading checkout' });
    }
});

// Process order
router.post('/process', getCart, async (req, res) => {
    try {
        const cart = req.cart;
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        
        // Validate stock
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ 
                    error: `Insufficient stock for ${product ? product.name : 'product'}` 
                });
            }
        }
        
        // Calculate pricing
        const subtotal = await cart.getTotalPrice();
        const shipping = 10.00;
        const tax = subtotal * 0.10;
        const total = subtotal + shipping + tax;
        
        // Generate order number
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        // Create order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        }));
        
        // Create order
        const order = new Order({
            orderNumber,
            customer: {
                fullName: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone
            },
            shipping: {
                address: req.body.address,
                city: req.body.city,
                postalCode: req.body.postalCode,
                country: req.body.country
            },
            billing: {
                sameAsShipping: req.body.billingSame === 'on' || req.body.billingSame === true
            },
            items: orderItems,
            pricing: {
                subtotal,
                shipping,
                tax,
                total
            },
            payment: {
                method: req.body.paymentMethod,
                status: 'completed'
            },
            status: 'processing'
        });
        
        await order.save();
        
        // Update product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }
        
        // Clear cart
        cart.items = [];
        await cart.save();
        
        res.json({ 
            success: true, 
            orderNumber: order.orderNumber,
            orderId: order._id 
        });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ error: 'Error processing order: ' + error.message });
    }
});

// Order confirmation
router.get('/confirmation/:orderId', async (req, res) => {
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
        res.status(500).render('error', { error: 'Error loading order' });
    }
});

module.exports = router;

