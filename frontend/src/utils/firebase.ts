// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkj4yvwdkD0uz6p86m2nV6Fq2hNc54OpU",
  authDomain: "chessclone-30390.firebaseapp.com",
  projectId: "chessclone-30390",
  storageBucket: "chessclone-30390.appspot.com",
  messagingSenderId: "257632905519",
  appId: "1:257632905519:web:dea5172d6bdf03eb9359da",
  measurementId: "G-SPQV254F81",
};

var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var provider = new GoogleAuthProvider();
export {auth , provider};
