const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    shipping: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    billing: {
        sameAsShipping: { type: Boolean, default: true },
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    items: [orderItemSchema],
    pricing: {
        subtotal: { type: Number, required: true },
        shipping: { type: Number, default: 10.00 },
        tax: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true }
    },
    payment: {
        method: { 
            type: String, 
            enum: ['card', 'cod', 'wallet'],
            required: true 
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
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

