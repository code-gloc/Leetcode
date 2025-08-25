import Problem from "../models/problem.js";
import problemController from "../utils/problemUtility.js";
const{submitBatch,getLanguageById,submitToken}=problemController;
const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;
    try {
        //array iteration every elemeny
        for (const { language, completeCode } of referenceSolution) {

            if (!language || !completeCode) {
                return res.status(400).send("Missing language or completeCode in referenceSolution.");
            }

            // langauge id
            const languageId = getLanguageById(language);
            // console.log(languageId)

            // submission array creating
            const submission = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output,
            }));


            const submitResult = await submitBatch(submission);

            if (!submitResult || !Array.isArray(submitResult)) {
                return res.status(500).send("Judge0 submission failed or no result returned.");
            }

            const resultToken = submitResult.map((value) => value.token); // creates the array and returns the token
            // console.log(resultToken)
            const testResult = await submitToken(resultToken);
            // console.log(testResult);
             // check the test cases
            for (let i = 0; i < testResult.length; i++) {
                const test = testResult[i];
                if (test.status_id !== 3) {
                    const failedTestCase = visibleTestCases[i];
                    return res.status(400).json({
                        message: `Reference solution for ${language} failed on a visible test case.`,
                        details: {
                            language,
                            testCase: {
                                input: failedTestCase.input,
                                expectedOutput: failedTestCase.output,
                            },
                            result: {
                                status: test.status,
                                stdout: test.stdout,
                                stderr: test.stderr,
                            },
                        },
                    });
                }
            }
        }

         //  storing the problem into database
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id,
        })


        res.status(201).send("Problem Created Successfully");


    } catch (err) {
        res.status(401).send("Error Occured " + err)
    }
}
const updateProblem=async(req,res)=>{
   const {id}=req.params;
   const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;
    try {
        
        if(!id)
        {
            return res.status(400).send("Problem id is not present");
        }
        const dsaProblem=await Problem.findById(id);
        if(!dsaProblem)
        {
            return res.status(404).send("Problem not found");
        }
        //array iteration every element
        for (const { language, completeCode } of referenceSolution) {

            if (!language || !completeCode) {
                return res.status(400).send("Missing language or completeCode in referenceSolution.");
            }

            // langauge id
            const languageId = getLanguageById(language);
            // console.log(languageId)

            // submission array creating
            const submission = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output,
            }));


            const submitResult = await submitBatch(submission);

            if (!submitResult || !Array.isArray(submitResult)) {
                return res.status(500).send("Judge0 submission failed or no result returned.");
            }

            const resultToken = submitResult.map((value) => value.token); // creates the array and returns the token
            // console.log(resultToken)
            const testResult = await submitToken(resultToken)
            // console.log(testResult);
             // check the test cases
            for (let i = 0; i < testResult.length; i++) {
                const test = testResult[i];
                if (test.status_id !== 3) {
                    const failedTestCase = visibleTestCases[i];
                    return res.status(400).json({
                        message: `Reference solution for ${language} failed on a visible test case.`,
                        details: {
                            language,
                            testCase: {
                                input: failedTestCase.input,
                                expectedOutput: failedTestCase.output,
                            },
                            result: {
                                status: test.status,
                                stdout: test.stdout,
                                stderr: test.stderr,
                            },
                        },
                    });
                }
            }
        }

        //store in database 
        const newProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true},{new:true});
        res.status(200).send(newProblem);
    }
    catch(err){
        res.status(500).send("Error Occured" +err);
    }
}
const deleteProblem=async(req,res)=>{
    const {id}=req.params;
    try{
       if(!id)
       {
        return res.status(400).send("Problem id is not present");
       }
       const deletedProblem=await Problem.findByIdAndDelete(id);
       if(!deletedProblem)
       {
        return res.status(404).send("Problem not found");
       }
       else{
        return res.status(200).send("Problem Deleted Successfully");
       }

    }
    catch(err){
        return res.status(400).send("Error Occured"+err);
    }

}
const getProblemByID=async(req,res)=>{
    const {id}=req.params;
    try{
      if(!id)
    {
        return res.status(400).send("Problem id is not present");
    }
    const newProblem=await Problem.findById(id).select(' _id title description difficulty tags visibleTestCases startCode referenceSolution');
    if(!newProblem)
    {
        return res.status(404).send("Problem not found");
    }
    return res.status(200).send(newProblem);
    }
    catch(err){
       return res.status(500).send("Error Occured"+err);
    }
}
const getAllProblems=async(req,res)=>{
    try {
    // Get page & limit from query (default: page=1, limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many to skip
    const skip = (page - 1) * limit;

    // Fetch problems with pagination
    const allProblems = await Problem.find({}).select('_id title tags difficulty').skip(skip).limit(limit);

    // Count total problems
    const total = await Problem.countDocuments();

    if (!allProblems || allProblems.length === 0) {
      return res.status(404).json({ message: "No problems found" });
    }

    return res.status(200).json({
      page,
      limit,
      totalProblems: total,
      totalPages: Math.ceil(total / limit),
      problems: allProblems
    });
  } catch (err) {
    return res.status(500).json({ message: "Error occurred", error: err.message });
  }
}


const solvedAllProblems=async(req,res)=>{
    try{
        const userId = req.user.id;
        const solvedProblems = await Problem.find({ solvedBy: userId });
        if(!solvedProblems || solvedProblems.length === 0)
        {
            return res.status(404).send("No Solved Problems Found");
        }
        return res.status(200).send(solvedProblems);
    }
    catch(err){
        return res.status(500).send("Error Occured"+err);
    }
}






export default { createProblem, updateProblem,deleteProblem,getProblemByID,getAllProblems,};

