import express from 'express';
import userAuthController from '../controllers/userAuthent.js';
import userMiddleware from '../middleware/userMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
const { register, login,logout,adminRegister} = userAuthController;
const authRouter=express.Router();

//Register
authRouter.post('/register',register);
//Login
authRouter.post('/login',login);
// //Logout
 authRouter.post('/logout',userMiddleware,logout);
// //Get User Details
// authRouter.get('getProfile',getProfile);

authRouter.post('/admin/register',adminMiddleware,adminRegister);

export default authRouter;


