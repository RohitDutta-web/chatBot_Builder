
import mongoose from "mongoose";

const NodeLogSchema = new mongoose.Schema(
  {
    nodeId: String,
    type: String,   
    messageSent: String,
    options: [String],   
    timestamp: Date,    
    status: { type: String, enum: ["sent", "failed", "skipped"] }
  },
  { _id: false }
);

const ExecutionLogSchema = new mongoose.Schema({
  userId: String, 
  chatFlowId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatFlow" }, 
  trigger: String, 
  nodes: [NodeLogSchema], 
  startedAt: Date,
  endedAt: Date,
  status: { 
    type: String, 
    enum: ["success", "failed", "incomplete"], 
    default: "incomplete" 
  }
});
ExecutionLogSchema.index({ startedAt: -1 });
const ExecutionLog = mongoose.model("ExecutionLog", ExecutionLogSchema);

export default ExecutionLog;
