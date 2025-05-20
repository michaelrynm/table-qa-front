import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1vlEM9Ch7opyL5vBL6MrMNqf_Uzz_H-Q",
  authDomain: "tableqa-12f7d.firebaseapp.com",
  projectId: "tableqa-12f7d",
  storageBucket: "tableqa-12f7d.firebasestorage.app",
  messagingSenderId: "737967879993",
  appId: "1:737967879993:web:32613c9692ce7bda9b5ae8",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
