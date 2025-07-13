import { User } from "../models/userModel.js"; // Add .js extension


export const getuserdata = async (req, res) => {
    try {
        // Get userId from auth middleware
        const { userId } = req.body;
        
        
        // Find user by ID and exclude sensitive fields
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        res.json({ 
            success: true, 
            userData: {
                
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            },
            message: "User data retrieved successfully"
        });
        
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error fetching user data", 
            error: error.message 
        });
    }
}