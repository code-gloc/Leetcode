import express from 'express';
import userAuthController from '../controllers/userAuthent.js';
import userMiddleware from '../middleware/userMiddleware.js';

import adminMiddleware from '../middleware/adminMiddleware.js';
const { register, login,logout,adminRegister,deleteProfile,checkAuth } = userAuthController;
const authRouter=express.Router();


authRouter.post('/register',register);

authRouter.post('/login',login);

 authRouter.post('/logout',userMiddleware,logout);

// authRouter.get('/getProfile',getProfile);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);

authRouter.post('/admin/register',adminMiddleware,adminRegister);

authRouter.get('/check',userMiddleware,checkAuth);

export default authRouter;


