import express from "express";
const router = express.Router();
import { createChatFlow, getChatFlowById, getChatFlows, updateChatFlow, deleteChatFlow } from "../controllers/chatFlow.controller.js";



// ChatFlow routes support multiple triggers
router.post("/", createChatFlow);
router.get("/", getChatFlows);
router.get("/:id", getChatFlowById);
router.put("/:id", updateChatFlow);
router.delete("/:id", deleteChatFlow);

export default router;