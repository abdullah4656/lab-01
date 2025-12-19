const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Cart expires after 7 days
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Calculate total price of cart items
 * Uses populate() to fetch product details from Product collection
 * 
 * Difference between populate() and embedded documents:
 * - populate(): Uses references (ObjectId) to fetch related documents from another collection
 *   - Cart stores only product IDs, fetches full product data when needed
 *   - More flexible: product changes reflect in all carts
 *   - Better for frequently changing data (prices, stock)
 * - Embedded documents: Stores full product data directly in cart document
 *   - All data in one document, no separate queries needed
 *   - Faster reads but data duplication
 *   - Product changes don't reflect in existing carts
 * 
 * We use populate() here because:
 * 1. Product prices may change, but we want current prices for cart calculation
 * 2. Avoids data duplication
 * 3. Single source of truth for product data
 */
cartSchema.methods.getTotalPrice = async function() {
    // Populate product references to get current product data
    await this.populate('items.product');
    // Filter out items with null products (deleted products)
    this.items = this.items.filter(item => item.product !== null);
    return this.items.reduce((total, item) => {
        if (item.product && item.product.price) {
            return total + (item.product.price * item.quantity);
        }
        return total;
    }, 0);
};

cartSchema.methods.getTotalItems = function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
};

cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Cart', cartSchema);

