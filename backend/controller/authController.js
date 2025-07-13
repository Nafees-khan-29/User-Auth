import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import transporter from '../cofig/nodeMailer.js';




// Register authentication function

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return res .json({sucess: false, message: "Please fill all the fields"});
    }
    try {
        const existingUser = await User.findOne({ email });
        console.log("Existing user check:", existingUser);
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const user=new User({
            name,
            email,
            password: hashedpassword,
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nThe Team`
        }; // Added missing semicolon and fixed formatting

        await transporter.sendMail(mailOptions);

        return res.json({

            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

        
    } catch (error) {

      res.json({
            success: false,
            message: "Error in registration",
            error: error.message
        });
        
    }
}
//login  authentication function 
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "Please fill all the fields" });
    }
    try {
        const user=await User.findOne({ email });
        if(!user){
            return res.json({success:false,message:"user not found"});
            
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token=jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        res.cookie('token', token, {
             httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
             sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',  // ✅ FIXED
             maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            message: "Login successful"});

        }catch (error) {
            return res.json({
                success: false,
                message: "Error in login",
                error: error.message
            });
        }
    }
// logout authentication function
export const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/'
        });

        return res.status(200).json({ 
            success: true, 
            message: "Logout successful" 
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: "Error in logout",
            error: error.message
        });
    }
};// send verification OTP function
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await User.findById(userId);
        if (user.isVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }
      const otp=String( Math.floor(100000+ Math.random()*900000)); // Generate a 6-digit OTP ;
      user.verifyotp = otp;
      user.verifyotpExpireAt = Date.now() + 10 * 60 * 1000;// OTP valid for 10 minutes
       await user.save();
       const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Verification OTP',
        text: `Your verification OTP is ${otp}. It is valid for 10 minutes.`
       }
       await transporter.sendMail(mailOptions);
       res.json({

        success: true,
        message: "Verification OTP sent successfully",})
        
    } catch (error) { 
    res.json({
        success: false,
        message: "Error in sending verification OTP",
        error: error.message
        
        
    })
}
}
// email verification function
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    
    if (!userId || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide user ID and OTP" 
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        if (user.verifyotp === '' || user.verifyotp !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid OTP" 
            });
        }

        if (user.verifyotpExpireAt < Date.now()) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP expired" 
            });
        }

        user.isVerified = true;
        user.verifyotp = '';
        user.verifyotpExpireAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in verifying email",
            error: error.message
        });
    }
};
// ckeck user authentication 
export const isAuthenticated = async (req, res) => {
    try {
        // Since userAuth middleware already verified the token,
        // if we reach here, the user is authenticated
        return res.json({ 
            success: true,
            message: "User is authenticated",
            userId: req.userId
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Authentication check failed",
            error: error.message
        });
    }
}
// resend OTP function for password reset
export const sendResendotp =async(req,res)=>{
    const {email} =req.body;
    if(!email){
        return res.json({ success:false,message:"email is required"})
    }
    try {
         const user = await User.findOne({email});
         if(!user){
            return res.json({ success:false,message:"user not found"})
         }
          const otp=String( Math.floor(100000+ Math.random()*900000)); // Generate a 6-digit OTP ;
          user.resetotp = otp;
          user.resetotpExpireAt = Date.now() + 10 * 60 * 1000;// OTP valid for 10 minutes
          await user.save();
          const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`
       }
       await transporter.sendMail(mailOptions);
       return res.json({
            success: true,
            message: "Password reset OTP sent successfully",
        });

        

    } catch (error) {
        return res.json({ success:false,message:error.message});
        
    }
}
// reset password function
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
        return res.json({ 
            success: false, 
            message: "Please provide email, OTP, and new password" 
        });
    }

    try {
        // Find user and ensure they exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Validate OTP
        if (!user.resetotp || user.resetotp !== otp) {
            return res.json({ 
                success: false, 
                message: "Invalid OTP" 
            });
        }

        // Check OTP expiration
        if (user.resetotpExpireAt < Date.now()) {
            return res.json({ 
                success: false, 
                message: "OTP expired" 
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user document directly
        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    password: hashedPassword,
                    resetotp: '',
                    resetotpExpireAt: null
                }
            },
            { new: true } // Return updated document
        );

        if (!updatedUser) {
            return res.json({
                success: false,
                message: "Failed to update password"
            });
        }

        return res.json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return res.json({
            success: false,
            message: "Error in resetting password",
            error: error.message
        });
    }
};