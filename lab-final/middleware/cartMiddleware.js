const Cart = require('../models/Cart');

/**
 * Middleware to check if cart is not empty
 * Prevents checkout when cart is empty
 * This middleware ensures users cannot proceed to checkout with an empty cart
 * 
 * Middleware is preferred over repeated logic because:
 * 1. Reusability - can be applied to multiple routes
 * 2. Separation of concerns - validation logic separate from business logic
 * 3. DRY principle - don't repeat validation code in every route
 * 4. Easier to maintain - change validation in one place
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function checkCartNotEmpty(req, res, next) {
    try {
        // Use cart from request if already set by getCart middleware
        // Otherwise fetch it
        let cart = req.cart;
        
        if (!cart) {
            const sessionId = req.cookies.sessionId;
            
            if (!sessionId) {
                return res.status(400).json({ 
                    error: 'Cart is empty. Please add items to your cart before checkout.' 
                });
            }
            
            cart = await Cart.findOne({ sessionId }).populate('items.product');
        }
        
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ 
                error: 'Cart is empty. Please add items to your cart before checkout.' 
            });
        }
        
        // Filter out any null products (deleted products)
        const validItems = cart.items.filter(item => item.product !== null);
        
        if (validItems.length === 0) {
            return res.status(400).json({ 
                error: 'Cart is empty. Please add items to your cart before checkout.' 
            });
        }
        
        // Ensure cart is attached to request
        req.cart = cart;
        next();
    } catch (error) {
        console.error('Error checking cart:', error);
        next(error); // Proper async error handling
    }
}

module.exports = { checkCartNotEmpty };

