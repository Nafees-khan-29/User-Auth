import express from 'express';
import { 
    isAuthenticated, 
    login, 
    logout, 
    register, 
    resetPassword, 
    sendResendotp, 
    sendVerifyOtp, 
    verifyEmail 
} from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

// Auth routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', isAuthenticated);
authRouter.post('/send-reset-otp', sendResendotp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;