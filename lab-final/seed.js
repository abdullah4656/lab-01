const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
    {
        name: 'Wireless Headphones',
        price: 79.99,
        category: 'Electronics',
        description: 'High-quality wireless headphones with noise cancellation',
        image: 'https://via.placeholder.com/300?text=Wireless+Headphones',
        stock: 25
    },
    {
        name: 'Smart Watch',
        price: 299.99,
        category: 'Electronics',
        description: 'Feature-rich smartwatch with fitness tracking',
        image: 'https://via.placeholder.com/300?text=Smart+Watch',
        stock: 15
    },
    {
        name: 'USB-C Cable',
        price: 9.99,
        category: 'Accessories',
        description: 'Durable USB-C charging cable, 6 feet',
        image: 'https://via.placeholder.com/300?text=USB-C+Cable',
        stock: 100
    },
    {
        name: 'Laptop Stand',
        price: 49.99,
        category: 'Accessories',
        description: 'Ergonomic aluminum laptop stand',
        image: 'https://via.placeholder.com/300?text=Laptop+Stand',
        stock: 30
    },
    {
        name: 'Mechanical Keyboard',
        price: 129.99,
        category: 'Electronics',
        description: 'RGB mechanical keyboard with Cherry MX switches',
        image: 'https://via.placeholder.com/300?text=Mechanical+Keyboard',
        stock: 20
    },
    {
        name: 'Wireless Mouse',
        price: 39.99,
        category: 'Accessories',
        description: 'Ergonomic wireless mouse with long battery life',
        image: 'https://via.placeholder.com/300?text=Wireless+Mouse',
        stock: 45
    },
    {
        name: 'Webcam HD',
        price: 79.99,
        category: 'Electronics',
        description: '1080p HD webcam with auto-focus',
        image: 'https://via.placeholder.com/300?text=Webcam+HD',
        stock: 35
    },
    {
        name: 'Phone Case',
        price: 19.99,
        category: 'Accessories',
        description: 'Protective phone case with shock absorption',
        image: 'https://via.placeholder.com/300?text=Phone+Case',
        stock: 80
    },
    {
        name: 'Power Bank',
        price: 34.99,
        category: 'Accessories',
        description: '10000mAh portable power bank',
        image: 'https://via.placeholder.com/300?text=Power+Bank',
        stock: 50
    },
    {
        name: 'Bluetooth Speaker',
        price: 59.99,
        category: 'Electronics',
        description: 'Portable Bluetooth speaker with 360-degree sound',
        image: 'https://via.placeholder.com/300?text=Bluetooth+Speaker',
        stock: 28
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log(`Inserted ${sampleProducts.length} products`);

        // Close connection
        await mongoose.connection.close();
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();


