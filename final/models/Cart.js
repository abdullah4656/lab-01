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

cartSchema.methods.getTotalPrice = async function() {
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

