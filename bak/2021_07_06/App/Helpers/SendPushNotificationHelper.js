const { Expo } = require('expo-server-sdk');

module.exports = async (expoTokens, message) => {
  const messages = [];
  expoTokens.forEach(expoToken => {
    messages.push({
      to: expoToken,
      sound: 'default',
      body: message,
      title: "Hello!"
    });
  });

  const expo = new Expo();
  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    console.log(ticketChunk);
  }
};