# 🔧 Troubleshooting "Add to Cart" Error

## Problem: Error when clicking "Add to Cart"

This usually happens due to one of these reasons:

### Solution 1: Install Dependencies

Make sure you've installed all dependencies:

```bash
npm install
```

This will install `cookie-parser` and other required packages.

### Solution 2: Restart the Server

After running `npm install`, restart your server:

```bash
# Press Ctrl+C to stop the server
npm start
```

### Solution 3: Check MongoDB Connection

Make sure MongoDB is running:

**Windows:**
- Check if MongoDB service is running
- Or run `mongod` in a separate terminal

**Mac/Linux:**
```bash
mongod
```

### Solution 4: Seed the Database

Make sure you have products in the database:

```bash
node seed.js
```

### Solution 5: Clear Browser Cookies

Sometimes old cookies cause issues:

1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear all cookies for localhost:3000
4. Refresh the page

### Solution 6: Check Browser Console

Open browser console (F12) and check for errors:

- Look for any red error messages
- Check if the AJAX request is being sent
- Verify the response

### Solution 7: Check Terminal/Server Logs

Look at your terminal where the server is running:

- Check for any error messages
- Look for "Error adding to cart" message
- Note the specific error details

## Common Error Messages & Fixes

### "Product not found"
**Fix:** Run `node seed.js` to add products to database

### "Cannot find module 'cookie-parser'"
**Fix:** Run `npm install cookie-parser`

### "MongoDB connection error"
**Fix:** Start MongoDB with `mongod` command

### "Invalid product ID"
**Fix:** Make sure products exist in database, run seed script

### "Insufficient stock"
**Fix:** Check product stock in admin panel or database

## Step-by-Step Verification

Run these commands in order:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Install/reinstall dependencies
npm install

# 3. Make sure MongoDB is running
# Open NEW terminal and run:
mongod

# 4. Seed the database (back in main terminal)
node seed.js

# 5. Start the server
npm start

# 6. Clear browser cookies and cache

# 7. Try adding to cart again
```

## Testing Add to Cart

1. Open http://localhost:3000/products
2. Open browser console (F12)
3. Click "Add to Cart" on any product
4. Check console for:
   - Network request to `/cart/add/:productId`
   - Response should be `{success: true, message: "Product added to cart"}`
5. Check terminal for any error logs

## Manual Test via Browser Console

Try adding to cart manually via console:

```javascript
fetch('/cart/add/PRODUCT_ID_HERE', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quantity: 1 })
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

Replace `PRODUCT_ID_HERE` with an actual product ID from the products page.

## Still Not Working?

If you still get errors after trying all solutions:

1. **Check package.json** - Make sure it has:
   ```json
   "cookie-parser": "^1.4.6"
   ```

2. **Delete node_modules** and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check server.js** - Make sure it has:
   ```javascript
   const cookieParser = require('cookie-parser');
   app.use(cookieParser());
   ```

4. **Check routes** - Make sure server.js has:
   ```javascript
   app.use('/cart', require('./routes/cart'));
   ```

5. **Share the exact error message** - Copy the error from:
   - Browser console (F12)
   - Terminal/server logs
   - Network tab in DevTools

## Quick Fix Script

Create a file `fix.sh` (Mac/Linux) or `fix.bat` (Windows):

**Mac/Linux (fix.sh):**
```bash
#!/bin/bash
npm install
node seed.js
npm start
```

**Windows (fix.bat):**
```batch
npm install
node seed.js
npm start
```

Run it:
```bash
# Mac/Linux
chmod +x fix.sh
./fix.sh

# Windows
fix.bat
```

## Expected Behavior

When "Add to Cart" works correctly:

1. Button shows "Adding..." briefly
2. Button turns green and shows "Added!"
3. Success toast appears
4. Cart badge in navigation updates
5. Button returns to normal after 2 seconds

## Debug Mode

To see detailed error messages, check the terminal where your server is running. The error will show there with details about what went wrong.

Need more help? Share the exact error message you're seeing!

