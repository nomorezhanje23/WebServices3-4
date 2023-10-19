// Define a middleware function for authentication
const isAuthenticated = (req, res, next) => {
    // Check if a user is authenticated based on the session
    if (req.session.user === undefined) {
        // If not authenticated, return a 401 Unauthorized response
        return res.status(401).json("You do not have access.");
    }
    // If authenticated, continue to the next middleware or route handler
    next();
};

// Export the middleware function for use in the application
module.exports = {
    isAuthenticated
};