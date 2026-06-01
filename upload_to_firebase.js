import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadData() {
  const data = JSON.parse(fs.readFileSync("cutoffs.json", "utf8"));
  console.log(`Read ${data.length} records. Starting upload...`);

  const cutoffsRef = collection(db, "acpcCutoffs");
  
  // Firestore batch limit is 500
  const BATCH_SIZE = 400;
  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (let i = 0; i < data.length; i++) {
    const docRef = doc(cutoffsRef);
    batch.set(docRef, data[i]);
    count++;

    if (count === BATCH_SIZE) {
      await batch.commit();
      batchCount++;
      console.log(`Committed batch ${batchCount} (${count} items)`);
      batch = writeBatch(db);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    batchCount++;
    console.log(`Committed final batch ${batchCount} (${count} items)`);
  }

  console.log("Upload complete!");
  process.exit(0);
}

uploadData().catch(console.error);
