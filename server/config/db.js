import mongoose from "mongoose";


export async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database connected!")

   }
  catch (e) {
    console.log(e.message);
  }
}