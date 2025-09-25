import express from 'express';
const aiRouter = express.Router();
import solveDoubt  from '../controllers/solveDoubt.js';
import userMiddleware from "../middleware/userMiddleware.js";

aiRouter.post('/chat',userMiddleware,solveDoubt);
export default aiRouter;
