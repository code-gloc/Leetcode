import express from 'express';
import userMiddleware from '../middleware/userMiddleware.js';
const submissionRouter = express.Router();
const {submitCode,runCode}=submitAndRun;
import submitAndRun from '../controllers/submitCode.js';
import rateLimitingMiddleware from '../middleware/rateLimitingMiddleware.js';

submissionRouter.post("/submit/:id", userMiddleware, rateLimitingMiddleware, submitCode);
submissionRouter.post("/run/:id", userMiddleware, rateLimitingMiddleware, runCode);
export default submissionRouter;