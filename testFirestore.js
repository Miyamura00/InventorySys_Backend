require("dotenv").config();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

console.log("Using Firebase config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
  try {
    const docRef = await addDoc(collection(db, "test"), {
      message: "Hello Firestore!",
      createdAt: new Date().toISOString(),
    });
    console.log("✅ Document written with ID:", docRef.id);
  } catch (err) {
    console.error("❌ Firestore test failed:", err);
  }
})();