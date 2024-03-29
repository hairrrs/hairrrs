import * as firebase from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// export const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MESSUREMENT_ID
// };

export const firebaseConfig = {
  apiKey: "AIzaSyDDhibjVjYyWnUYm0Hkr5-9H2jgTogOe8s",
  authDomain: "hairrrs-org99.firebaseapp.com",
  projectId: "hairrrs-org99",
  storageBucket: "hairrrs-org99.appspot.com",
  messagingSenderId: "249532325571",
  appId: "1:249532325571:web:3b695cb51fba693d7ecc76",
  measurementId: "G-4CJTYNZWBS"
};

var app;
try{
  if (!firebase?.apps?.length) {
    app = firebase?.initializeApp(firebaseConfig);
  }
} catch (error) {
  console.log('Firebase error:', error)
}


// const analytics = getAnalytics();
const storage = getStorage();
const db = getFirestore()
const auth = getAuth()

export { db, storage, auth };