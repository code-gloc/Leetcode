import express from 'express';
const app=express();
import dotenv from 'dotenv';
import main from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/userAuth.js';
dotenv.config();
app.use(express.json());    //to convert json data to object 
app.use(cookieParser());  //to parse cookies from the request

app.use("/user",authRouter);
main().then(async ()=>{
    app.listen(process.env.PORT,()=>{
    console.log("server is running on port number " +process.env.PORT);
})
})
.catch((err)=>{
    console.log("Error connecting to the database:",err);
})
