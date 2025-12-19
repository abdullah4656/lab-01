require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const path = require('path');

const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const adminRouter = require('./routes/admin');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/admin', adminRouter);

// Error handling middleware
// This middleware catches all errors from async route handlers
// Middleware is preferred over repeated try-catch blocks because:
// 1. Centralized error handling - one place to manage all errors
// 2. DRY principle - don't repeat error handling code in every route
// 3. Consistent error responses across the application
// 4. Easier to maintain and update error handling logic
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle different error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Default error response
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
