const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { adminOnly } = require('../middleware/authMiddleware');

// Admin Dashboard
router.get('/', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCategories = (await Product.distinct('category')).length;
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);
        
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            totalProducts,
            totalCategories,
            lowStockProducts
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).render('error', { error: 'Error loading dashboard' });
    }
});

// List all products (Admin)
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin/products', {
            title: 'Admin - Products',
            products
        });
    } catch (error) {
        console.error('Error loading products:', error);
        res.status(500).render('error', { error: 'Error loading products' });
    }
});

// Show form to create new product
router.get('/products/new', (req, res) => {
    res.render('admin/product-form', {
        title: 'Add New Product',
        product: null,
        formAction: '/admin/products',
        formMethod: 'POST',
        buttonText: 'Create Product'
    });
});

// Create new product
router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).render('error', { error: 'Error creating product' });
    }
});

// Show form to edit product
router.get('/products/:id/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).render('error', { error: 'Product not found' });
        }
        res.render('admin/product-form', {
            title: 'Edit Product',
            product,
            formAction: `/admin/products/${product._id}?_method=PUT`,
            formMethod: 'POST',
            buttonText: 'Update Product'
        });
    } catch (error) {
        console.error('Error loading product:', error);
        res.status(500).render('error', { error: 'Error loading product' });
    }
});

// Update product
router.put('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).render('error', { error: 'Error updating product' });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).render('error', { error: 'Error deleting product' });
    }
});

/**
 * Admin Orders Dashboard
 * Displays all orders with ability to mark as Confirmed or Cancel
 * Requires admin authentication (email = admin@shop.com)
 * Shows: Order ID, Customer name, Total amount, Status, Order date
 */
router.get('/orders', adminOnly, async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('items.product')
            .sort({ createdAt: -1 }); // Most recent first
        
        res.render('admin/orders', {
            title: 'Admin - Orders',
            orders
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        next(error); // Proper async error handling
    }
});

/**
 * Mark order as Confirmed
 * Updates order status to Confirmed in database
 * Status changes must update the database (as per requirements)
 */
router.post('/orders/:id/confirm', adminOnly, async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: 'Confirmed' },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ success: true, order });
    } catch (error) {
        console.error('Error confirming order:', error);
        next(error); // Proper async error handling
    }
});

/**
 * Cancel order
 * Updates order status to Cancelled in database
 * Status changes must update the database (as per requirements)
 */
router.post('/orders/:id/cancel', adminOnly, async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: 'Cancelled' },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ success: true, order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        next(error); // Proper async error handling
    }
});

module.exports = router;


