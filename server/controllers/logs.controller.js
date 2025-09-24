import ExecutionLog from "../models/executionlog.model.js";

export const getExecutionLogs = async (req, res) => {
  try {
    const { userId, trigger, status, from, to } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (trigger) query.trigger = trigger;
    if (status) query.status = status;

    if (from || to) {
      query.startedAt = {};
      if (from) query.startedAt.$gte = new Date(from);
      if (to) query.startedAt.$lte = new Date(to);
    }

    const logs = await ExecutionLog.find(query)
      .sort({ startedAt: -1 })
      .lean();

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  }
  catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}