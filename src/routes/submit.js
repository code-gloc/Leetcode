import express from 'express';
import userMiddleware from '../middleware/userMiddleware.js';
import submitCode from '../controllers/submitCode.js';
const submissionRouter = express.Router();

submissionRouter.post("/submit/:id", userMiddleware, submitCode);
export default submissionRouter;