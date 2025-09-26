import { ChatFlow } from "../models/chatFlow.model.js";
import ExecutionLog from "../models/executionlog.model.js";
import { sendInstagramMessage } from "../config/instagramMessage.js";

async function handleIncomingMessage(userId, messageText) {
  const escapedText = messageText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const chatFlow = await ChatFlow.findOne({
    trigger: { $regex: new RegExp(`^${escapedText}$`, 'i') }
  });


  if (!chatFlow) {
    console.log(`No chatflow matched for trigger: "${messageText}"`);
    return;
  }


  await executeChatflow(userId, chatFlow);
}

async function executeChatflow(userId, chatFlow) {
  const executionFlow = [];

  try {
    if (chatFlow.nodes && chatFlow.nodes.length > 0) {
   
      let currentNode = chatFlow.nodes[0];
      while (currentNode) {
        console.log("Current node:", currentNode);

        await sendInstagramMessage(userId, currentNode);
        executionFlow.push({ node: currentNode.id, type: currentNode.type, message: currentNode.message });
        currentNode = chatFlow.nodes.find(n => n.id === currentNode.nextNode);
      }
    
    }

    const log = new ExecutionLog({
      userId,
      trigger: chatFlow.trigger,
      flow: executionFlow,
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
