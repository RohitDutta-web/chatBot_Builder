import mongoose from "mongoose";
import OptionsSchema from "./options.model.js";

 const NodeSchema = mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true, enum: ["text", "media", "buttons"] },
  message: { type: String },
  mediaUrl: { type: String },
  options: [OptionsSchema],
  next: {type:String, default:null}
 }, { _id: false })
export default NodeSchema;