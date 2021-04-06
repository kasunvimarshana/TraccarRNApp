//https://docs.expo.io/push-notifications/sending-notifications-custom/#fcm-server
//https://docs.expo.io/versions/latest/sdk/notifications/#firebaseremotemessage
//https://docs.expo.io/versions/latest/sdk/notifications/#subscription
//https://www.npmjs.com/package/firebase-admin
//https://firebase.google.com/docs/admin/setup

/* ---------- 1 ---------- */
// import * as Notifications from 'expo-notifications';
// ...
// - const token = (await Notifications.getExpoPushTokenAsync()).data;
// + const token = (await Notifications.getDevicePushTokenAsync()).data:
// // send token off to your server

/* ---------- 2 ---------- */
// await fetch('https://fcm.googleapis.com/fcm/send', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `key=<FCM-SERVER-KEY>`,
//   },
//   body: JSON.stringify({
//     to: '<NATIVE-DEVICE-PUSH-TOKEN>',
//     priority: 'normal',
//     data: {
//       experienceId: '@yourExpoUsername/yourProjectSlug',
//       title: "\uD83D\uDCE7 You've got mail",
//       message: 'Hello world! \uD83C\uDF10',
//     },
//   }),
// });