const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getCart(req, res, next) {
    try {
        // Get session ID from cookie or generate new one
        let sessionId = req.cookies.sessionId || generateSessionId();
        
        // Find or create cart
        let cart = await Cart.findOne({ sessionId }).populate('items.product');
        
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
            await cart.save();
        }
        
        req.cart = cart;
        req.sessionId = sessionId;
        
        // Set cookie if not exists
        if (!req.cookies.sessionId) {
            res.cookie('sessionId', sessionId, { 
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                httpOnly: true 
            });
        }
        
        next();
    } catch (error) {
        console.error('Cart error:', error);
        next(error);
    }
}

function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// View cart
router.get('/', getCart, async (req, res) => {
    try {
        const cart = req.cart;
        
        // Clean up null products (deleted products)
        const originalLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product !== null);
        
        if (cart.items.length < originalLength) {
            await cart.save();
        }
        
        const totalPrice = await cart.getTotalPrice();
        const totalItems = cart.getTotalItems();
        
        res.render('cart', {
            title: 'Shopping Cart - E-Commerce Store',
            cart,
            totalPrice,
            totalItems
        });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.status(500).render('error', { error: 'Error loading cart' });
    }
});

// Add to cart
router.post('/add/:productId', getCart, async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity) || 1;
        
        // Validate product ID format
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        
        const cart = req.cart;
        
        // Clean up null products (deleted products)
        cart.items = cart.items.filter(item => item.product !== null);
        
        const existingItem = cart.items.find(item => 
            item.product && item.product._id.toString() === productId
        );
        
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({ error: 'Insufficient stock for requested quantity' });
            }
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        
        await cart.save();
        await cart.populate('items.product');
        
        const totalItems = cart.getTotalItems();
        
        res.json({ 
            success: true, 
            message: 'Product added to cart',
            totalItems,
            cart: cart.items
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ 
            error: 'Error adding to cart',
            details: error.message 
        });
    }
});

// Update cart item quantity
router.post('/update/:productId', getCart, async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);
        
        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }
        
        const cart = req.cart;
        const item = cart.items.find(item => 
            item.product._id.toString() === productId
        );
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }
        
        const product = await Product.findById(productId);
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        
        item.quantity = quantity;
        await cart.save();
        
        const totalPrice = await cart.getTotalPrice();
        const totalItems = cart.getTotalItems();
        
        res.json({ 
            success: true,
            totalPrice,
            totalItems,
            itemTotal: product.price * quantity
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Error updating cart' });
    }
});

// Remove from cart
router.post('/remove/:productId', getCart, async (req, res) => {
    try {
        const productId = req.params.productId;
        const cart = req.cart;
        
        cart.items = cart.items.filter(item => 
            item.product._id.toString() !== productId
        );
        
        await cart.save();
        
        const totalPrice = await cart.getTotalPrice();
        const totalItems = cart.getTotalItems();
        
        res.json({ 
            success: true,
            totalPrice,
            totalItems
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Error removing from cart' });
    }
});

// Clear cart
router.post('/clear', getCart, async (req, res) => {
    try {
        const cart = req.cart;
        cart.items = [];
        await cart.save();
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Error clearing cart' });
    }
});

module.exports = router;
module.exports.getCart = getCart;

