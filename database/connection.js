import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connection = async () => {
    try {
        // mongoose.set('strictQuery', false);

         await mongoose.connect(process.env.MONGO_CONNECT_URL,{retryWrites:true,w:"majority"});

        console.log("Database Connection Established");
    } catch (error) {
        console.error("Error Connecting to the Database", error);
    } 
};
   
export default mongoose;