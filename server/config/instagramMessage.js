import axios from "axios";

export async function sendInstagramMessage(userId, node) {
  console.log(`Mock send to ${userId}:`, {
    type: node.type,
    message: node.message,
    buttons: node.buttons || [],
    media: node.media || null
  });
  if (process.env.MOCK_INSTAGRAM === 'true') return;
  const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`;
  const messageData = {
    recipient: { id: userId },
    message: {}
  };
  if (node.type === 'text') {
    messageData.message.text = node.message;
  } else if (node.type === 'buttons') {
    messageData.message = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: node.message,
          buttons: node.buttons
        }
      }
    };
  } else if (node.type === 'media') {
    messageData.message = {
      attachment: {
        type: node.media.type || "image",
        payload: {
          url: node.media.url,
          is_reusable: true
        }
      }
    };
  }
  try {
    const response = await axios.post(url, messageData);
    console.log("Instagram response:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
}
