# E-Commerce Project 🛒

A fully functional, modern e-commerce website built with Express.js, MongoDB, Bootstrap 5, and jQuery. Features complete shopping cart, checkout process, order management, and admin panel.

## Features

### Assignment 1: Checkout Page (Bootstrap, Responsive)
- ✅ Responsive checkout page with Bootstrap 5
- ✅ Progress header (Cart → Address → Payment → Review)
- ✅ Customer & Shipping form
- ✅ Order summary (sticky on desktop)
- ✅ Payment section (Card, COD, Wallet)
- ✅ Review & Place Order section
- ✅ Fully responsive (mobile, tablet, desktop)

### Lab Assignment 2: Client-Side Form Validation (jQuery)
- ✅ jQuery form validation
- ✅ Real-time validation with Bootstrap validation states
- ✅ Error messages for all fields
- ✅ Validation rules:
  - Full name: min 3 characters
  - Email: valid email format
  - Phone: 10+ digits
  - Address: required
  - City: required
  - Postal code: 4-6 digits, numeric only
  - Country: required selection
  - Payment method: required
  - Card fields: required if Card selected
  - Terms: must be checked

### Assignment 2: Single Page CRUD App (jQuery + REST API)
- ✅ CRUD operations using JSONPlaceholder API
- ✅ Read: Display list of posts
- ✅ Create: Add new post
- ✅ Update: Edit existing post
- ✅ Delete: Remove post
- ✅ No page reloads, dynamic updates
- ✅ Loading states and error handling

### Lab Task 3: Express.js Application
- ✅ Express.js server setup
- ✅ EJS template engine
- ✅ Clean route structure
- ✅ Views and partials
- ✅ Static file serving

### Assignment 3: MongoDB Integration
- ✅ MongoDB connection with Mongoose
- ✅ Product model
- ✅ Product listing page
- ✅ Pagination (page, limit)
- ✅ Filtering (category, price range, search)

### Lab Task 4: Admin Panel
- ✅ Separate admin layout
- ✅ Admin dashboard
- ✅ Product management (CRUD)
- ✅ Create products
- ✅ Read products list
- ✅ Update products
- ✅ Delete products

## 🆕 NEW: Enhanced Features

### Complete Shopping Cart System
- ✅ MongoDB-based cart with session management
- ✅ Add to cart from product pages
- ✅ Update quantities with +/- buttons
- ✅ Remove items with confirmation
- ✅ Real-time price calculations
- ✅ Stock validation
- ✅ Cart badge in navigation

### Fully Integrated Checkout
- ✅ Modern step-by-step checkout flow
- ✅ Displays actual cart items
- ✅ Customer information form
- ✅ Shipping address
- ✅ Multiple payment methods
- ✅ Card details with formatting
- ✅ Complete jQuery validation
- ✅ Loading states and modals

### Order Management
- ✅ Order processing and storage
- ✅ Unique order numbers
- ✅ Order confirmation page
- ✅ Email-ready order details
- ✅ Automatic stock reduction
- ✅ Order history in database

### Modern UI/UX
- ✅ Beautiful hero section
- ✅ Featured products on home
- ✅ Smooth animations
- ✅ Toast notifications
- ✅ Modal confirmations
- ✅ Responsive design
- ✅ Professional styling

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   - Windows: Usually starts automatically as a service
   - Mac/Linux: Run `mongod` in a terminal

3. **Seed the database with sample products:**
   ```bash
   node seed.js
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open your browser and visit:**
   - **Home:** http://localhost:3000
   - **Products:** http://localhost:3000/products
   - **Cart:** http://localhost:3000/cart
   - **Checkout:** http://localhost:3000/checkout
   - **Admin Panel:** http://localhost:3000/admin

## 🎯 Try the Complete Shopping Flow

1. Browse products at http://localhost:3000/products
2. Click "Add to Cart" on any product
3. View your cart and adjust quantities
4. Proceed to checkout
5. Fill in your details and place order
6. View order confirmation

## 📱 Standalone Pages

For testing individual features:
- **Checkout Demo:** Open `checkout.html` in browser
- **CRUD App Demo:** Open `crud-app.html` in browser

## Project Structure

```
.
├── models/
│   └── Product.js          # Product Mongoose model
├── routes/
│   ├── index.js            # Main routes
│   ├── products.js         # Product routes
│   └── admin.js            # Admin routes
├── views/
│   ├── partials/
│   │   ├── header.ejs      # Main site header
│   │   ├── footer.ejs      # Main site footer
│   │   ├── admin-header.ejs # Admin header
│   │   └── admin-footer.ejs # Admin footer
│   ├── admin/
│   │   ├── dashboard.ejs   # Admin dashboard
│   │   ├── products.ejs    # Admin products list
│   │   └── product-form.ejs # Add/Edit product form
│   ├── index.ejs           # Home page
│   ├── products.ejs        # Products listing
│   ├── product-detail.ejs  # Product detail page
│   ├── checkout.ejs        # Checkout page
│   └── error.ejs           # Error page
├── public/
│   └── checkout.html       # Standalone checkout page
├── checkout.html           # Standalone checkout page
├── crud-app.html          # CRUD application
├── server.js              # Express server
├── seed.js                # Database seeder
├── package.json           # Dependencies
└── README.md              # This file
```

## 🔌 API Endpoints

### Products
- `GET /products` - List all products (with pagination and filtering)
- `GET /products/:id` - Get single product

### Shopping Cart
- `GET /cart` - View shopping cart
- `POST /cart/add/:productId` - Add product to cart
- `POST /cart/update/:productId` - Update quantity
- `POST /cart/remove/:productId` - Remove item from cart
- `POST /cart/clear` - Clear entire cart

### Checkout & Orders
- `GET /checkout` - Checkout page
- `POST /checkout/process` - Process order
- `GET /checkout/confirmation/:orderId` - Order confirmation

### Admin
- `GET /admin` - Admin dashboard
- `GET /admin/products` - List all products (admin view)
- `GET /admin/products/new` - Show add product form
- `POST /admin/products` - Create new product
- `GET /admin/products/:id/edit` - Show edit product form
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js, Cookie-Parser
- **Database:** MongoDB, Mongoose
- **Frontend:** Bootstrap 5, jQuery, EJS
- **Session:** Cookie-based cart sessions
- **Validation:** jQuery with Bootstrap validation states
- **APIs:** JSONPlaceholder (for CRUD demo)

## 📦 Database Models

- **Product:** name, price, category, description, image, stock
- **Cart:** sessionId, items (array), createdAt, updatedAt
- **Order:** orderNumber, customer, shipping, billing, items, pricing, payment, status

## 📝 Notes

- **Fully functional e-commerce flow** from browsing to order confirmation
- Cart persists across page refreshes using cookies
- Real-time stock validation prevents overselling
- Order confirmation page is print-ready
- All pages are fully responsive (mobile, tablet, desktop)
- MongoDB connection string can be configured via `.env` file
- Admin panel has separate layout from main site
- Standalone HTML files (checkout.html, crud-app.html) for demo purposes

## 🎨 Features Showcase

- **Modern Design**: Gradient hero, card-based layouts, smooth animations
- **Real-time Updates**: AJAX cart operations, instant feedback
- **User-Friendly**: Clear CTAs, loading states, error messages
- **Professional**: Clean code, organized structure, best practices

## 🐛 Troubleshooting

- **Cart not working?** Make sure cookies are enabled in your browser
- **Products not showing?** Run `node seed.js` to populate the database
- **Can't place order?** Check MongoDB is running and connected
- **Port 3000 in use?** Change PORT in `.env` file

## License

ISC


