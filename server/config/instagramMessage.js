export async function sendInstagramMessage(userId, node) {
  const url = `https://graph.instagram.com/me/messages?access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`;

  let messageData = {
    recipient: { id: userId },
    messaging_type: 'RESPONSE'
  };

  if (node.type === 'text') {
    messageData.message = { text: node.message };
  } else if (node.type === 'buttons') {
    messageData.message = {
      text: node.message,
      quick_replies: node.options.map(option => ({
        content_type: 'text',
        title: option,
        payload: option
      }))
    };
  } else if (node.type === 'media') {
    messageData.message = {
      attachment: {
        type: 'image',
        payload: { url: node.mediaUrl }
      }
    };
  }

  try {
    await axios.post(url, messageData);
  } catch (error) {
    console.error('Error sending message:', error.response?.data);
  }
}
