// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
  appId: "1:257632905519:web:c450613e99d3eca99359da",
  measurementId: "G-D6F00X38HR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
