import { ChatFlow } from "../models/chatFlow.model.js";
import ExecutionLog from "../models/executionlog.model.js";
import { sendInstagramMessage } from "../config/instagramMessage.js";

async function handleIncomingMessage(userId, messageText) {
  // Find chatflow where triggers array contains the message text (case-insensitive)
  const chatFlow = await ChatFlow.findOne({
    triggers: { $elemMatch: { $regex: new RegExp(`^${messageText}$`, 'i') } }
  });

  if (!chatFlow) {
    console.log(`No chatflow matched for trigger: "${messageText}"`);
    return;
  }

  await executeChatflow(userId, chatFlow);
}

async function executeChatflow(userId, chatFlow) {
  const executionFlow = [];
  const startedAt = new Date();

  try {
    if (chatFlow.nodes && chatFlow.nodes.length > 0) {
      let currentNode = chatFlow.nodes[0];
      while (currentNode) {
        console.log("Current node:", currentNode);
        await sendInstagramMessage(userId, currentNode);
        executionFlow.push({
          nodeId: currentNode.id,
          type: currentNode.type,
          message: currentNode.message,
          options: currentNode.options,
          next: currentNode.next,
          timestamp: new Date(),
          status: "sent"
        });
        if (currentNode.options && currentNode.options.length > 0) {
          const nextId = currentNode.options[0].next;
          currentNode = chatFlow.nodes.find(n => n.id === nextId);
        } else {
          currentNode = chatFlow.nodes.find(n => n.id === currentNode.next);
        }
      }
    }
    const endedAt = new Date();
    const log = new ExecutionLog({
      userId,
      trigger: chatFlow.triggers[0],
      nodes: executionFlow,
      startedAt,
      endedAt,
      status: 'success'
    });
    await log.save();
  } catch (error) {
    console.error('Error executing chatFlow:', error);
  }
}


export const webHookEntry = async (req, res) => {
  try {
    const { entry } = req.body;

    for (const pageEntry of entry) {
      for (const messagingEvent of pageEntry.messaging) {
        const senderId = messagingEvent.sender.id;
        const message = messagingEvent.message;

        if (message && message.text) {
          await handleIncomingMessage(senderId, message.text);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
};
