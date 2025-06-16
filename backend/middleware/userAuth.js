import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        // Get token from cookies
        const { token } = req.cookies;
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No token found, please login first" 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.id) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token" 
            });
        }

        // Set user ID in both req.userId and req.body.userId for compatibility
        req.userId = decoded.id;
        if (!req.body) req.body = {};
        req.body.userId = decoded.id;
        
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token format" 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token has expired" 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Authentication error",
            error: error.message 
        });
    }
};

export default userAuth;