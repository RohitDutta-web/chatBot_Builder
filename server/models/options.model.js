import mongoose from "mongoose";

const OptionsSchema = new mongoose.Schema({
  label: { type: String, required: true },
  nextNodeName: { type: String, default: null }
}, { _id: false })

export default OptionsSchema;