import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
const videoRouter=express.Router();
import videoSectionController from '../controllers/videoSection.js';
const {generateUploadSignature,saveVideoMetadata,deleteVideo}=videoSectionController;
videoRouter.get('/create/:problemId',adminMiddleware,generateUploadSignature);
videoRouter.post('/save',adminMiddleware,saveVideoMetadata);
videoRouter.delete('/delete/:problemId',adminMiddleware,deleteVideo);
export default videoRouter;




