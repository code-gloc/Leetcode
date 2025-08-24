import express from 'express';
const problemRouter=express.Router();
import adminMiddleware from "../middleware/adminMiddleware.js";
import userMiddleware from '../middleware/userMiddleware.js';
import problemController from '../controllers/userProblem.js';
const {createProblem,updateProblem,deleteProblem,getProblemByID,getAllProblems}=problemController;

//need admin for access this route
problemRouter.post("/create",adminMiddleware,createProblem);

problemRouter.patch("/update/:id",adminMiddleware,updateProblem);

problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


// //everyone can access this route

// problemRouter.get("/solvedAllProblems/user",userMiddleware,solvedAllProblems);

problemRouter.get("/problemById/:id",userMiddleware,getProblemByID);

problemRouter.get("/getAllProblems",userMiddleware,getAllProblems);

export default problemRouter;

