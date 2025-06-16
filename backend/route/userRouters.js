import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getuserdata } from '../controller/userController.js';


const userRouter = express.Router();


userRouter.get('/user-data',userAuth, getuserdata);

// Export the user router
export default userRouter;