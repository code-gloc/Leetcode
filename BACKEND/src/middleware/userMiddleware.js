import redisClient from "../config/redis.js";
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
const userMiddleware=async(req,res,next)=>{
   try{
      const {token}=req.cookies;
      if(!token)
        throw new Error("token is not present");
        const payload=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const{_id}=payload;
        const result=await User.findById(_id);
        if(!result)
            throw new Error("user not found");
        //cehck if user is blocked or notn 

        const isBlocked=await redisClient.exists(`token:${token}`);
        if(isBlocked){
            throw new Error("user is blocked");
        }
        req.result=result;
        next();
   }
   catch(err){
    res.send("Error"+err);
   }
}
export default userMiddleware;