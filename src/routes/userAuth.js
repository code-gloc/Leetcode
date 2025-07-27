import express from 'express';
const authRouter=express.Router();
import userAuthController from '../controllers/userAuthent.js';
const { register, login } = userAuthController;





//Register
authRouter.post('/register',register);
//Login
authRouter.post('/login',login);
// //Logout
// authRouter.post('/logout',logout);
// //Get User Details
// authRouter.get('getProfile',getProfile);

export default authRouter;


