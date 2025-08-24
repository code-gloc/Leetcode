import mongoose from "mongoose";
const {Schema}=mongoose;
const userSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:12,
    },
    lastName:{
        type:String,
        minLength:2,
        maxLength:12,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        immutable:true,
        lowercase:true,
    },
    age:{
        type:Number,
        min:10,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',       
    },
    password:{
        type:String,
        required:true,
    },
    problemSolved:{
        type:Number,
        default:0,
    },
},{
    timestamps:true,
})
const User=mongoose.model("user",userSchema);
export default User;