import User from "../models/user.js";
import Submission from "../models/submission.js";
import bcrypt from "bcrypt";
import validate from "../utils/validator.js";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

const register=async(req,res)=>{
    try{
       //validate the inputs
       validate(req.body);
        const {firstName,email,password}=req.body;

       
    
        //checl if user already exists
        const existingUser=await User.findOne({email:email});
        if(existingUser){
            return res.status(400).send("User already exists");
        }

         //hash the password
        const hashedPassword=await bcrypt.hash(password,10);
        req.body.password=hashedPassword;

        const user = await User.create(req.body);
        
        //jwt token generation 
        const token=jwt.sign({email:email,_id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:60*60});

        //set the token in the cookie
        res.cookie("token",token,{
            maxAge:60*60*1000,// it is in milliseconds
            httpOnly:true,
            secure:true,
            sameSite:"none",
        })
        const reply={
            firstName:user.firstName,
            email:user.email,
            _id:user._id,
            role:user.role,
        }
        //send the responce here 
        res.status(201).json({
            user:reply,
            message:"user registered successfully"
        });

      
    }
    catch(err){
       res.status(400).json({ message: err.message });
    }
}

//login function 
const login =async(req,res)=>{
    try{
        const {email,password}=req.body;

        //check if email and password are provided
        if(!email||!password){
            return res.status(400).send("invalid credentials");
        }
        //check if user exists
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(400).send("user does not exist");
        }

        //match the password

        const match=await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).send("invalid credentials");
        }

        //jwt token generate
        const token=jwt.sign({email:email,_id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:60*60*24});//token expires in 24 hours means you have to login again after 24 hrs.

        //set the token in the cookie
        res.cookie("token",token,{
            maxAge:60*60*1000,
            httpOnly:true,
            secure:true,
            sameSite:"none"
        });

        const reply={
            firstName:user.firstName,
            email:user.email,
            _id:user._id,
            role:user.role,
        }
        //send the responce here
        res.status(201).json({
            user:reply,
            message:"user logged in successfully"
        });
    }
    catch(err){
        res.status(401).send("error:"+err);
    }
}


//logout function

const logout=async (req,res)=>{
    try{
         const {token}=req.cookies;
         console.log(token);
         const payload=jwt.decode(token);
         await redisClient.set(`token:${token}`,'blocked');
         await redisClient.expireAt(`token:${token}`,payload.exp);
         res.cookie("token",null,{expires:new Date(Date.now())});
         res.status(200).send("user logged out successfully");
    }
    catch(err){
        console.log(err);
        res.status(401).send("error:"+err);
       
    }
   
}

const adminRegister=async(req,res)=>{
    try{
       //validate the inputs
       validate(req.body);
        const {firstName,email,password}=req.body;

       
    
        //checl if user already exists
        const existingUser=await User.findOne({email:email});
        if(existingUser){
            return res.status(400).send("User already exists");
        }

         //hash the password
        const hashedPassword=await bcrypt.hash(password,10);
        req.body.password=hashedPassword;

         req.body.role = "admin";

        const user = await User.create(req.body);
        
        //jwt token generation 
        const token=jwt.sign({email:email,_id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});

        //set the token in the cookie
        res.cookie("token",token,{
            maxAge:"1h",
            httpOnly:true, //to prevent client side access
            secure:true, //to ensure the cookie is sent to the allowed domains
            sameSite:"strict" //to prevent CSRF attacks 
        })
        
        //send the responce here 
        res.status(201).send("admin registered successfully");

      
    }
    catch(err){
       res.status(400).send("Error:"+err);
    }
}

const deleteProfile=async(req,res)=>{
    try{
        const userId=req.result._id;
        //delete from userSchema 
        await User.findByIdAndDelete(userId);

        //also delete from submission Schema 

        await Submission.deleteMany({userId});
        res.status(200).send("User profile deleted successfully");
    }
    catch(err){
        res.status(500).send("Error:"+err);
    }
}

const checkAuth=async(req,res)=>{
    try{
        const reply={
            firstName:req.result.firstName,
            email:req.result.email,
            _id:req.result._id,
            role:req.result.role,
        }
        res.status(201).json({
            user:reply,
            message:"user authenticated successfully"
        })
    }
    catch(err){
        res.status(500).send("Error:"+err);
    }
}


export default {register,login,logout,adminRegister,deleteProfile,checkAuth};