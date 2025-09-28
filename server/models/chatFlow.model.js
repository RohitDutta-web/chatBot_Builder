import mongoose from "mongoose";
import NodeSchema from "./messageNode.model.js";

// ChatFlow supports multiple triggers and sequential nodes
const chatFlowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  triggers: [{ type: String, required: true }], // Array of trigger keywords/phrases
  nodes: [NodeSchema], // Array of nodes (steps)
}, { timestamps: true });

export const ChatFlow = mongoose.model("ChatFlow", chatFlowSchema);