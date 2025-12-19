const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /products - List all products with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);
        const search = req.query.search;

        // Build query
        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        if (!isNaN(minPrice)) {
            query.price = { ...query.price, $gte: minPrice };
        }
        if (!isNaN(maxPrice)) {
            query.price = { ...query.price, ...(query.price || {}), $lte: maxPrice };
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Get products and count
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Get distinct categories for filter
        const categories = await Product.distinct('category');

        res.render('products', {
            title: 'Products - E-Commerce Store',
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            limit,
            categories,
            currentCategory: category || 'all',
            currentSearch: search || '',
            minPrice: minPrice || '',
            maxPrice: maxPrice || ''
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).render('error', { error: 'Error loading products' });
    }
});

// GET /products/:id - View single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).render('error', { error: 'Product not found' });
        }
        res.render('product-detail', {
            title: product.name + ' - E-Commerce Store',
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).render('error', { error: 'Error loading product' });
    }
});

module.exports = router;


