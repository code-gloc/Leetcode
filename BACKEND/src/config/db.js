import mongoose from "mongoose";
async function main(){
    await mongoose.connect(process.env.MONGOURL);
}
export default main;