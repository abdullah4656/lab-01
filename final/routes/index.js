const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const featuredProducts = await Product.find().limit(6).sort({ createdAt: -1 });
        res.render('index', { 
            title: 'Home - E-Commerce Store',
            featuredProducts
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.render('index', { 
            title: 'Home - E-Commerce Store',
            featuredProducts: []
        });
    }
});

module.exports = router;


