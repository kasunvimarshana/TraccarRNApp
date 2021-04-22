//<!-- The core Firebase JS SDK is always required and must be listed first -->
//<script src="https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js"></script>

//<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
//<script src="https://www.gstatic.com/firebasejs/8.3.2/firebase-analytics.js"></script>

//https://docs.expo.io/push-notifications/sending-notifications-custom/
await fetch('https://fcm.googleapis.com/fcm/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `key=<FCM-SERVER-KEY>`,
  },
  body: JSON.stringify({
    to: '<NATIVE-DEVICE-PUSH-TOKEN>',
    priority: 'normal',
    data: {
      experienceId: '@yourExpoUsername/yourProjectSlug',
      title: "\uD83D\uDCE7 You've got mail",
      message: 'Hello world! \uD83C\uDF10',
    },
  }),
});

//https://medium.com/yale-sandbox/react-native-push-notifications-with-firebase-cloud-functions-74b832d45386
//https://docs.expo.io/versions/latest/sdk/notifications/