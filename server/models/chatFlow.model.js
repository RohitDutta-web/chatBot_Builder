import mongoose from "mongoose";
import NodeSchema from "./messageNode.model.js";
const chatFlowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trigger: { type: String, required: true },
  nodes: [NodeSchema]
}, { timestamps: true })

export const ChatFlow = mongoose.model("ChatFlow", chatFlowSchema)