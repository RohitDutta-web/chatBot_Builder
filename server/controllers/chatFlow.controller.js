import { ChatFlow } from "../models/chatFlow.model.js";

export const createChatFlow = async (req, res) => {
  try {
    const chatFlow = await ChatFlow.create(req.body)
    res.status(201).json(chatFlow)
   }
  catch (e) {
     res.status(400).json({ error: e.message });
  }
}


export const getChatFlows = async (req, res) => {
    try {
    const chatFlows = await ChatFlow.find().sort({ createdAt: -1 }).lean();
    res.json(chatFlows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const getChatFlowById = async (req, res) => {
    try {
    const chatFlow = await ChatFlow.findById(req.params.id).lean();
    if (!chatFlow) return res.status(404).json({ error: 'Chatflow not found' });
    res.json(chatFlow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const updateChatFlow = async (req, res) => {
    try {
    const updated = await ChatFlow.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Chatflow not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


export const deleteChatFlow = async (req, res) => {
   try {
    const deleted = await ChatFlow.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Chatflow not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}