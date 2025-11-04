import { v2 as cloudinary } from 'cloudinary';
import Problem from '../models/problem.js';
import User from '../models/user.js';
import SolutionVideo from '../models/solutionVideo.js';
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateUploadSignature =async (req,res)=>{
    try{
       const {problemId}=req.params;
       const userId=req.result._id;
       const problem=await Problem.findById(problemId);
       // check if problem exists
       if(!problem){
        return res.status(404).json({message:"Problem not found"});
       }
       //genreate unique public id for the video 
         const timestamp=Math.round((new Date()).getTime()/1000);
         const publicId=`codex-solutions/${problemId}_${userId}_${timestamp}`;

        //upload  parameters
        const uploadParams={
            timestamp:timestamp,
            public_id:publicId,
        };
        //generate signature
        const signature=cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_API_SECRET
        );
        res.json({
            signature,
            timestamp,
            public_id:publicId,
            api_key:process.env.CLOUDINARY_API_KEY,
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
        });
    }
    catch(err){
         console.error("error in generating uploadSignature",err);
         res.status(500).json({err:'failed to upload signature'});
    }
}    

const saveVideoMetadata=async(req,res)=>{
    try{
        const {problemId,cloudinaryPublicId,secureUrl,duration}=req.body;
        const userId=req.result._id;
        //verify the upload with cloudinary 
        const cloudinaryResource= await cloudinary.api.resource(
            cloudinaryPublicId,
            {resource_type:'video'}
        );

       if (!cloudinaryResource) {
       return res.status(400).json({ error: 'Video not found on Cloudinary' });
      }

      
       // Check if video already exists for this problem and user
       const existingVideo = await SolutionVideo.findOne({
        problemId,
        userId,
        cloudinaryPublicId
        });

        if (existingVideo) {
        return res.status(409).json({ error: 'Video already exists' });
       }

      //    const thumbnailUrl=cloudinary.url(cloudinaryResource.public_id,{
      //     resource_type:'image',
      //     format:'jpg',
     //     transformation:[
     //         {width:400,height:225,crop:'fill'},
      //         {quality:'auto'},
       //         {start_offset:'auto'},
      //     ]
      //    });

        const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id,{resource_type: "video"})

        // https://cloudinary.com/documentation/video_effects_and_enhancements#video_thumbnails
        // Create video solution record
        const videoSolution = await SolutionVideo.create({
        problemId,
        userId,
        cloudinaryPublicId,
        secureUrl,
        duration: cloudinaryResource.duration || duration,
        thumbnailUrl
       });


         res.status(201).json({
         message: 'Video solution saved successfully',
         videoSolution: {
         id: videoSolution._id,
         thumbnailUrl: videoSolution.thumbnailUrl,
         duration: videoSolution.duration,
         uploadedAt: videoSolution.createdAt
       }
       });
    }
    catch (error) {
    console.error('Error saving video metadata:', error);
    res.status(500).json({ error: 'Failed to save video metadata' });
  }
};

const deleteVideo=async(req,res)=>{
    try{
      const {problemId}=req.params;
      const userId=req.result._id;
      const video=await SolutionVideo.findOneAndDelete({
        problemId:problemId
      });

      if(!video)
      {
        return res.status(404).json({error:'Video not found'}); 
      }
        //delete from cloudinary
        await cloudinary.uploader.destroy(video.cloudinaryPublicId,{resource_type:'video',invalidate:true});
        res.status(200).json({message:'Video deleted successfully'});
    }
    catch(err){
        console.error("Error deleting video:",err);
        res.status(500).json({error:'Failed to delete video'});
    }
};

export default {generateUploadSignature,saveVideoMetadata,deleteVideo};



