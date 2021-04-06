import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAmB6wYgWfvij_6kcRcGl3ZFN_IADjfBfk",
    authDomain: "globegps.firebaseapp.com",
    projectId: "globegps",
    storageBucket: "globegps.appspot.com",
    messagingSenderId: "648465021458",
    appId: "1:648465021458:web:75d4772c7ae1d404f976cb",
    measurementId: "G-WV22N3ZLET"
};
  
//if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
//}

export default firebase;