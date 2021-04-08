// // This import loads the firebase namespace along with all its type information.
// import firebase from 'firebase/app';
// // These imports load individual services into the firebase namespace.
// import 'firebase/auth';
// import 'firebase/database';

import * as firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAmB6wYgWfvij_6kcRcGl3ZFN_IADjfBfk",
    authDomain: "globegps.firebaseapp.com",
    databaseURL: "https://globegps-default-rtdb.firebaseio.com",
    projectId: "globegps",
    storageBucket: "globegps.appspot.com",
    messagingSenderId: "648465021458",
    appId: "1:648465021458:web:a0ee54057b199b98f976cb",
    measurementId: "G-4NRYEMHMDE"
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;