import User from "../models/user.js";
import bcrypt from "bcrypt";
import validate from "../utils/validator.js";
import jwt from "jsonwebtoken";


const register=async(req,res)=>{
    try{
       //validate the inputs
       validate(req.body);
        const {firstName,email,password}=req.body;

        //hash the password
        const hashedPassword=await bcrypt.hash(password,10);
        req.body.password=hashedPassword;

        //checl if user already exists
        const existingUser=await User.findOne({email:email});
        if(existingUser){
            return res.status(400).send("User already exists");
        }

        //jwt token generation 
        const token=jwt.sign({email:email,_id:User.id},process.env.JWT_SECRET_KEY,{expiresIn:60*60});

        //set the token in the cookie
        res.cookie("token",token,{
            maxAge:60*60*1000,// it is in milliseconds
            httpOnly:true, //to prevent client side access
            secure:true, //to ensure the cookie is sent to the allowed domains
            sameSite:"strict" //to prevent CSRF attacks 
        })
        
        //send the responce here 
        res.status(201).send("user registered successfully");

       await User.create(req.body);
    }
    catch(err){
       res.status(400).send("Error:"+err);
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
        const token=jwt.sign({email:email,_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:60*60*24});//token expires in 24 hours means you have to login again after 24 hrs.

        //set the token in the cookie
        res.cookie("token",token,{
            maxAge:60*60*1000,
            httpOnly:true,
            secure:true,
            sameSite:"strict"
        });

        //send the responce here
        res.status(200).send("user logged in successfully");
    }
    catch(err){
        res.status(401).send("error:"+err);
    }
}

export default {register,login};