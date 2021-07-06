//https://www.positronx.io/create-react-native-firebase-crud-app-with-firestore/
//https://medium.com/mindorks/firebase-realtime-database-with-react-native-5f357c6ee13b
//https://firebase.googleblog.com/2016/01/the-beginners-guide-to-react-native-and_84.html
//this.itemsRef = firebaseApp.database().ref();
//https://firebase.google.com/docs/database/admin/save-data#node.js
/*
var usersRef = ref.child("users");
usersRef.set({
  alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});
*/
//https://firebase.google.com/docs/database/web/read-and-write
//https://firebase.google.com/docs/functions/database-events
//https://docs.expo.io/guides/using-firebase/
//https://firebase.google.com/docs/auth/web/anonymous-auth
/*
firebase.auth().signInAnonymously()
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
*/
//https://firebase.google.com/docs/auth/admin/create-custom-tokens
/*
const uid = 'some-uid';

admin
  .auth()
  .createCustomToken(uid)
  .then((customToken) => {
    // Send token back to client
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });
*/
/*
const userId = 'some-uid';
const additionalClaims = {
  premiumAccount: true,
};

admin
  .auth()
  .createCustomToken(userId, additionalClaims)
  .then((customToken) => {
    // Send token back to client
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });
*/
//https://firebase.google.com/docs/auth/web/custom-auth
/*
firebase.auth().signInAnonymously()
.then(function() {
  console.log('Logged in as Anonymous!')
})
.catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorCode);
  console.log(errorMessage);
});
*/