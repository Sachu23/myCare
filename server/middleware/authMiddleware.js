// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming the User model is located here

const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;

        // Fetch the user details and attach to the request object
        const user = await User.findById(req.userId).select('-password'); // Exclude the password
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user; // Attach user details to request object
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
