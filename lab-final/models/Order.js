const mongoose = require('mongoose');

/**
 * Order Model - Represents a persistent order created from cart
 * 
 * Conceptual difference between Orders and Carts:
 * 
 * CARTS:
 * - Temporary, session-based storage
 * - User can modify, add, remove items freely
 * - Not persisted as permanent records
 * - Uses current product prices (via populate())
 * - Expires after 7 days
 * - Represents "shopping intent" - user is still browsing
 * 
 * ORDERS:
 * - Permanent record of a completed transaction
 * - Immutable once created (status can change, but items/price cannot)
 * - Stores snapshot of product prices at time of purchase
 * - Persisted forever for record-keeping
 * - Represents "completed purchase" - business transaction
 * - Used for order history, fulfillment, accounting
 * 
 * Key difference: Cart is temporary shopping state, Order is permanent transaction record
 */

// Order item schema - stores product reference, quantity, and price at time of order
const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema({
    // Customer information (simplified as per requirements)
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    // Order items with product, quantity, and price
    items: [orderItemSchema],
    // Total amount
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    // Order status: Pending, Confirmed, Cancelled
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    // Created date
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);

