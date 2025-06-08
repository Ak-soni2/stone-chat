// import mongoose from 'mongoose';

// export const connectDB = async()=>{
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log(`Connected to MongoDB ${mongoose.connection.host}`);
//     }
//     catch(err){
//         console.log("Error connecting to MongoDB", err);
//         process.exit(1); // failure keyword went wrong 1
//     }
// }

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    process.exit(1); // 1 means failure
  }
};