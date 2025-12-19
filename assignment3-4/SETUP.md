# Setup and Run Instructions

## Prerequisites

Before running the application, make sure you have installed:

1. **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org/)
2. **MongoDB** - Download from [mongodb.com](https://www.mongodb.com/try/download/community)

## Step-by-Step Setup

### 1. Install Node.js Dependencies

Open a terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required packages:
- express
- ejs
- mongoose
- method-override
- dotenv
- nodemon (dev dependency)

### 2. Start MongoDB

**Windows:**
- If MongoDB is installed as a service, it should start automatically
- Or run: `mongod` in a terminal
- Or use MongoDB Compass GUI

**Mac/Linux:**
```bash
mongod
```

Or if you have MongoDB running as a service:
```bash
brew services start mongodb-community  # Mac with Homebrew
sudo systemctl start mongod            # Linux
```

### 3. Seed the Database (Optional but Recommended)

Populate the database with sample products:

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

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
Connected to MongoDB
Server running on http://localhost:3000
```

### 5. Access the Application

Open your web browser and visit:

- **Home Page:** http://localhost:3000
- **Products:** http://localhost:3000/products
- **Checkout:** http://localhost:3000/checkout
- **Admin Panel:** http://localhost:3000/admin
- **Standalone Checkout:** http://localhost:3000/checkout.html
- **CRUD App:** Open `crud-app.html` in your browser (or serve it via Express)

## Troubleshooting

### MongoDB Connection Error

If you see "MongoDB connection error":

1. Make sure MongoDB is running
2. Check the connection string in `.env` file (or use default: `mongodb://localhost:27017/ecommerce`)
3. Verify MongoDB is listening on port 27017

### Port Already in Use

If port 3000 is already in use:

1. Change the PORT in `.env` file (or create one):
   ```
   PORT=3001
   ```

2. Or kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   ```

### Module Not Found Errors

If you get module errors:

1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

## File Structure Quick Reference

- `server.js` - Main Express server file
- `package.json` - Dependencies and scripts
- `seed.js` - Database seeder script
- `models/Product.js` - Product Mongoose model
- `routes/` - Route handlers
- `views/` - EJS templates
- `public/` - Static files

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start server with nodemon (auto-reload)
- `node seed.js` - Seed the database with sample data

## Environment Variables

Create a `.env` file in the root directory (optional):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

If `.env` is not present, the app will use defaults.


