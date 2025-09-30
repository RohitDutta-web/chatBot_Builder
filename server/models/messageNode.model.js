
import mongoose from "mongoose";
import OptionsSchema from "./options.model.js";

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["text", "media", "buttons", "quick_reply"],
  },
  message: { type: String },
  mediaType: { type: String, enum: ["image", "video", "file"] },
  mediaUrl: { type: String },
  options: [OptionsSchema],
  nextNodeName: { type: String, default: null },
}, { _id: false });

export default NodeSchema;