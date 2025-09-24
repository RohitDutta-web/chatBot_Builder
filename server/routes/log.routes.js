import express from "express";
import { getExecutionLogs } from "../controllers/logs.controller.js";

const router = express.Router();

router.get("/", getExecutionLogs);

export default router;