const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Middleware to get or create cart based on session
 * Uses cookie-based session management to maintain cart across requests
 * Sessions are used for cart because:
 * 1. Cart is temporary and user-specific
 * 2. No authentication required - works for anonymous users
 * 3. Persists across browser sessions via cookies
 * 4. Automatically expires after 7 days
 */
async function getCart(req, res, next) {
    try {
        // Get session ID from cookie or generate new one
        let sessionId = req.cookies.sessionId || generateSessionId();
        
        // Find or create cart based on session ID
        let cart = await Cart.findOne({ sessionId }).populate('items.product');
        
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
            await cart.save();
        }
        
        req.cart = cart;
        req.sessionId = sessionId;
        
        // Set cookie if not exists (7 day expiration)
        if (!req.cookies.sessionId) {
            res.cookie('sessionId', sessionId, { 
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                httpOnly: true 
            });
        }
        
        next();
    } catch (error) {
        console.error('Cart error:', error);
        next(error); // Proper async error handling
    }
}

function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * View cart route
 * Displays cart items with server-side total recalculation
 * Handles deleted products by filtering them out automatically
 */
router.get('/', getCart, async (req, res, next) => {
    try {
        const cart = req.cart;
        
        // Handle deleted products: Remove items with null product references
        const originalLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product !== null);
        
        if (cart.items.length < originalLength) {
            await cart.save();
        }
        
        // Server-side cart total recalculation ensures accuracy
        // This recalculates total from current product prices in database
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
        next(error); // Proper async error handling
    }
});

/**
 * Add product to cart route
 * Prevents duplicate products by checking if product already exists in cart
 * If product exists, updates quantity instead of adding duplicate entry
 * Handles deleted products by filtering them out before adding new items
 */
router.post('/add/:productId', getCart, async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity) || 1;
        
        // Validate product ID format (MongoDB ObjectId format)
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
        
        // Handle deleted products: Filter out items with null products
        // This ensures cart doesn't contain references to deleted products
        cart.items = cart.items.filter(item => item.product !== null);
        
        // Prevent duplicate products: Check if product already exists in cart
        // If exists, update quantity instead of creating duplicate entry
        const existingItem = cart.items.find(item => 
            item.product && item.product._id.toString() === productId
        );
        
        if (existingItem) {
            // Product already in cart - update quantity instead of adding duplicate
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({ error: 'Insufficient stock for requested quantity' });
            }
            existingItem.quantity = newQuantity;
        } else {
            // New product - add to cart
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
        // Proper async error handling - pass to Express error handler
        console.error('Error adding to cart:', error);
        next(error);
    }
});

/**
 * Update cart item quantity route
 * Updates quantity for existing cart item
 */
router.post('/update/:productId', getCart, async (req, res, next) => {
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
        next(error); // Proper async error handling
    }
});

/**
 * Remove item from cart route
 */
router.post('/remove/:productId', getCart, async (req, res, next) => {
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
        next(error); // Proper async error handling
    }
});

/**
 * Clear cart route
 * Removes all items from cart
 */
router.post('/clear', getCart, async (req, res, next) => {
    try {
        const cart = req.cart;
        cart.items = [];
        await cart.save();
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing cart:', error);
        next(error); // Proper async error handling
    }
});

module.exports = router;
module.exports.getCart = getCart;

