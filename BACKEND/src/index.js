import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import main from './config/db.js';
import authRouter from './routes/userAuth.js';
import problemRouter from './routes/problemCreator.js';
import submissionRouter from './routes/submit.js';
import redisClient from './config/redis.js';


const app = express();
dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());    // to convert json data to object 
app.use(cookieParser());    // to parse cookies from the request

// routes
app.use("/user", authRouter);
app.use("/submission", submissionRouter);
app.use("/problem", problemRouter);

const intializeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("Connected to MongoDB and Redis successfully");

    app.listen(process.env.PORT, () => {
      console.log("server is running on port number " + process.env.PORT);
    });
  } catch (err) {
    console.error("Error connecting to MongoDb or Redis:", err);
  }
};

intializeConnection();
