@echo off
echo ========================================
echo   Fixing Cart Error and Starting Server
echo ========================================
echo.

echo Step 1: Clearing old cart data...
node clear-cart.js
echo.

echo Step 2: Seeding database with products...
node seed.js
echo.

echo Step 3: Starting server...
echo.
echo ========================================
echo   Server is starting...
echo   Open: http://localhost:3000
echo   Press Ctrl+C to stop
echo ========================================
echo.

npm start

