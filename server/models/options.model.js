import mongoose from "mongoose";

 const OptionsSchema = new mongoose.Schema({
    label: { type: String, required: true },
  next: { type: String, default: null }
 }, { _id: false })

 export default OptionsSchema;