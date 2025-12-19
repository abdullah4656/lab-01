# 🚀 How to Run the E-Commerce Project

## Prerequisites Check

Before starting, make sure you have:

✅ **Node.js** installed (v14 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

✅ **MongoDB** installed and running
   - Check: `mongod --version`
   - Download: https://www.mongodb.com/try/download/community

## Step-by-Step Instructions

### Step 1: Open Terminal

Open your terminal/command prompt in the project folder:
```bash
cd C:\Users\abdul\Desktop\final
```

### Step 2: Install Dependencies

Run this command to install all required packages:
```bash
npm install
```

You should see packages being installed including:
- express
- ejs
- mongoose
- cookie-parser
- method-override
- dotenv
- nodemon

### Step 3: Start MongoDB

**Option A - Windows (if installed as service):**
MongoDB usually starts automatically. You can verify by opening MongoDB Compass.

**Option B - Start MongoDB manually:**
Open a NEW terminal window and run:
```bash
mongod
```
Keep this terminal open while using the app.

### Step 4: Seed the Database

In your main terminal, run:
```bash
node seed.js
```

You should see:
```
Connected to MongoDB
Cleared existing products
Inserted 10 products
Database seeded successfully!
```

### Step 5: Start the Server

Run:
```bash
npm start
```

Or for development mode with auto-reload:
```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on http://localhost:3000
```

### Step 6: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

## 🎯 Testing the Complete Shopping Flow

Follow these steps to test the full e-commerce functionality:

### 1. Browse Products
- Go to: http://localhost:3000/products
- You should see 10 sample products
- Try filtering by category
- Try searching for products
- Try pagination

### 2. Add Products to Cart
- Click "Add to Cart" on any product
- You should see a success message
- Notice the cart badge in the navigation updates
- Add multiple products

### 3. View Shopping Cart
- Click the Cart icon in navigation
- Or go to: http://localhost:3000/cart
- You should see all your added products
- Try increasing/decreasing quantities with +/- buttons
- Try removing an item
- See the total update in real-time

### 4. Proceed to Checkout
- Click "Proceed to Checkout" button
- You'll be taken to: http://localhost:3000/checkout

### 5. Fill Checkout Form
Fill in the form with test data:

**Customer Information:**
- Full Name: John Doe
- Email: john@example.com
- Phone: 1234567890

**Shipping Address:**
- Address: 123 Main Street
- City: New York
- Postal Code: 10001
- Country: United States

**Payment Method:**
- Select "Cash on Delivery" (easiest for testing)
- Or select "Credit Card" and fill:
  - Cardholder: John Doe
  - Card Number: 1234 5678 9012 3456
  - Expiry: 12/25
  - CVV: 123

**Terms:**
- Check the "I agree to Terms & Conditions" box

### 6. Place Order
- Click "Place Order" button
- You'll see a loading modal
- Then redirect to order confirmation

### 7. Order Confirmation
- You should see a success checkmark
- Order number displayed
- All order details shown
- Customer info, shipping, items, pricing

### 8. Admin Panel
- Go to: http://localhost:3000/admin
- View dashboard statistics
- Click "Products" to manage products
- Try adding a new product
- Try editing an existing product
- Try deleting a product

## 📂 Available URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Products | http://localhost:3000/products |
| Shopping Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |
| Admin Dashboard | http://localhost:3000/admin |
| Admin Products | http://localhost:3000/admin/products |
| Add Product | http://localhost:3000/admin/products/new |

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module"
**Solution:** Run `npm install` again

### Issue 2: "MongoDB connection error"
**Solution:** 
- Make sure MongoDB is running
- Check if mongod process is active
- Try restarting MongoDB

### Issue 3: "Port 3000 already in use"
**Solution:**
- Kill the process using port 3000
- Or change port in `.env` file:
  ```
  PORT=3001
  ```

### Issue 4: "No products showing"
**Solution:** Run `node seed.js` to populate database

### Issue 5: Cart not working
**Solution:** 
- Make sure cookies are enabled in browser
- Clear browser cookies and try again

### Issue 6: Page shows error
**Solution:**
- Check terminal for error messages
- Make sure MongoDB is running
- Check if seed.js was run successfully

## 🎨 What You Should See

### Home Page
- Purple gradient hero section
- 3 feature cards (Fast Delivery, Secure Payment, Easy Returns)
- Featured products grid (6 products)
- "View All Products" button

### Products Page
- Filter bar (search, category, price range)
- Grid of products with images
- "Add to Cart" buttons
- Pagination at bottom

### Cart Page
- List of added products with images
- Quantity controls (+/-)
- Remove buttons
- Order summary with totals
- "Proceed to Checkout" button

### Checkout Page
- Progress steps at top
- Customer information form
- Shipping address form
- Payment method options
- Order summary on right side
- "Place Order" button

### Order Confirmation
- Green checkmark animation
- Order number
- Customer details
- Shipping address
- Order items
- Pricing breakdown
- "Continue Shopping" button

### Admin Dashboard
- Total products count
- Total categories count
- Low stock products table

### Admin Products
- Table of all products
- Edit buttons
- Delete buttons
- "Add New Product" button

## 📝 Test Data Examples

Use these when filling forms:

**Customer Info:**
```
Name: Jane Smith
Email: jane@test.com
Phone: 9876543210
Address: 456 Oak Avenue
City: Los Angeles
Postal Code: 90001
Country: United States
```

**Card Info (if testing card payment):**
```
Cardholder: Jane Smith
Card Number: 4532 1234 5678 9010
Expiry: 12/26
CVV: 456
```

## ✅ Verification Checklist

After setup, verify these work:
- [ ] Home page loads
- [ ] Products page shows items
- [ ] Can add product to cart
- [ ] Cart page shows added items
- [ ] Can update quantities in cart
- [ ] Can proceed to checkout
- [ ] Can fill checkout form
- [ ] Validation works on checkout
- [ ] Can place order
- [ ] Order confirmation shows
- [ ] Admin panel accessible
- [ ] Can add/edit/delete products in admin

## 🎉 Success!

If everything works, you now have a fully functional e-commerce website with:
- Product browsing and filtering
- Shopping cart
- Checkout process
- Order management
- Admin panel

## 🆘 Need Help?

If you encounter issues:
1. Check terminal for error messages
2. Verify MongoDB is running
3. Clear browser cookies and cache
4. Run `npm install` again
5. Delete `node_modules` and run `npm install`
6. Check `UPDATED_FEATURES.md` for detailed feature documentation
7. Check `SETUP.md` for detailed setup instructions

## 📧 Next Steps

Try these enhancements:
- Add more products via admin panel
- Test with different quantities
- Try different payment methods
- Explore filtering and search
- Test on mobile devices
- Check responsiveness at different screen sizes

Enjoy your e-commerce platform! 🛍️

