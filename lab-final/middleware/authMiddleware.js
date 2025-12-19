/**
 * Middleware to restrict access to admin-only routes
 * Allows access only if email equals admin@shop.com
 * This middleware provides a simple authorization check for admin functionality
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function adminOnly(req, res, next) {
    // Get email from query parameter, body, or session
    // For this simple implementation, we'll check query parameter or body
    const email = req.query.email || req.body.email || req.body.customerEmail;
    
    if (!email) {
        return res.status(403).render('error', { 
            error: 'Access denied. Admin email required.' 
        });
    }
    
    // Check if email matches admin email
    if (email.toLowerCase() !== 'admin@shop.com') {
        return res.status(403).render('error', { 
            error: 'Access denied. Admin privileges required.' 
        });
    }
    
    // Store admin email in request for use in route handlers
    req.adminEmail = email;
    next();
}

module.exports = { adminOnly };

