const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
.then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear all carts
    const Cart = mongoose.model('Cart', new mongoose.Schema({}, { strict: false }));
    await Cart.deleteMany({});
    console.log('✅ All carts cleared successfully!');
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
})
.catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

