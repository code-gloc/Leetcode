import mongoose from "mongoose";
const Schema = mongoose.Schema;
const submissionSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:"Problem",
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true,
        enum:["javascript","java","cpp"]
    },
    status:{
        type:String,
        enum:["pending","running","completed","accepted","wrong_answer","time_limit_exceeded","runtime_error"],
        default:"pending"
    },
    runtime:{
        type:Number,
        default:0,
        required:true
    },
    memory:{
        type:Number,
        default:0,
        required:true
    },
    errorMessage:{
        type:String,
        default:""
    },

    testCasesPassed:{
        type:Number,
        default:0,
        required:true
    },
    testCasesTotal:{
        type:Number,
        default:0,
        required:true
    },
},
   {
       timestamps:true
   }
)

const Submission = mongoose.model("submission", submissionSchema);

export default Submission;