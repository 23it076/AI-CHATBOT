import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile } from

"firebase/auth";
import { getFirestore, collection, getDocs, addDoc, query, where, orderBy, serverTimestamp, enableIndexedDbPersistence, writeBatch, doc } from "firebase/firestore";
import { apiRequest } from "./queryClient";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy-app-id"
};

let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
}
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Enable offline persistence (helpful for better performance and offline support)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn('Firebase persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the features required for persistence
    console.warn('Firebase persistence not supported by this browser');
  }
});

// Register user with email and password
export const registerWithEmailAndPassword = async (
username,
email,
password) =>
{
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return user;
  } catch (error) {
    console.error("Error registering with email and password:", error);
    throw error;
  }
};

// Login with email and password
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in with email and password:", error);
    throw error;
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore college cutoffs functions











// Fetch college cutoffs from Firestore
export const getCollegeCutoffs = async (filters) => {
  try {
    const cutoffsCollectionRef = collection(db, "collegeCutoffs");
    let queryRef = query(cutoffsCollectionRef);

    // Apply filters if they exist
    if (filters) {
      if (filters.university) {
        queryRef = query(queryRef, where("university", "==", filters.university));
      }
      if (filters.program) {
        queryRef = query(queryRef, where("program", "==", filters.program));
      }
      if (filters.country) {
        queryRef = query(queryRef, where("country", "==", filters.country));
      }
      if (filters.academicYear) {
        queryRef = query(queryRef, where("academicYear", "==", filters.academicYear));
      }
    }

    const querySnapshot = await getDocs(queryRef);
    const cutoffs = [];

    querySnapshot.forEach((doc) => {
      cutoffs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return cutoffs;
  } catch (error) {
    console.error("Error fetching college cutoffs from Firebase:", error);
    throw error;
  }
};

// Get unique programs from Firestore
export const getUniquePrograms = async () => {
  try {
    const cutoffsCollectionRef = collection(db, "collegeCutoffs");
    const querySnapshot = await getDocs(cutoffsCollectionRef);
    const programs = new Set();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.program) {
        programs.add(data.program);
      }
    });

    return Array.from(programs).sort();
  } catch (error) {
    console.error("Error fetching unique programs from Firebase:", error);
    throw error;
  }
};

// Get unique universities from Firestore
export const getUniqueUniversities = async () => {
  try {
    const cutoffsCollectionRef = collection(db, "collegeCutoffs");
    const querySnapshot = await getDocs(cutoffsCollectionRef);
    const universities = new Set();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.university) {
        universities.add(data.university);
      }
    });

    return Array.from(universities).sort();
  } catch (error) {
    console.error("Error fetching unique universities from Firebase:", error);
    throw error;
  }
};

// Get unique countries from Firestore
export const getUniqueCountries = async () => {
  try {
    const cutoffsCollectionRef = collection(db, "collegeCutoffs");
    const querySnapshot = await getDocs(cutoffsCollectionRef);
    const countries = new Set();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.country) {
        countries.add(data.country);
      }
    });

    return Array.from(countries).sort();
  } catch (error) {
    console.error("Error fetching unique countries from Firebase:", error);
    throw error;
  }
};

// Chat message interface








// Save chat message to Firebase
export const saveChatMessage = async (message) => {
  try {
    const chatMessagesRef = collection(db, "chatMessages");

    const messageData = {
      ...message,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(chatMessagesRef, messageData);

    return {
      id: docRef.id,
      ...messageData
    };
  } catch (error) {
    console.error("Error saving chat message to Firebase:", error);
    throw error;
  }
};

// Get chat messages from Firebase for a specific user
export const getChatMessages = async (userId) => {
  try {
    const chatMessagesRef = collection(db, "chatMessages");

    // Try to use a composite query with ordering
    try {
      const q = query(
        chatMessagesRef,
        where("userId", "==", userId),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      const messages = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firebase Timestamp to Date if it exists
        let messageDate;
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
          messageDate = data.timestamp.toDate();
        } else if (data.timestamp && data.timestamp.seconds) {
          // Handle Firestore timestamp that might be serialized
          messageDate = new Date(data.timestamp.seconds * 1000);
        } else {
          // Fallback to current date if no timestamp
          messageDate = new Date();
        }

        messages.push({
          id: doc.id,
          content: data.content,
          isUserMessage: data.isUserMessage,
          userId: data.userId,
          timestamp: messageDate
        });
      });

      return messages;
    } catch (indexError) {
      // If we get a failed-precondition error, it likely means we need an index
      // For now, let's try a simpler query without ordering
      console.warn("Composite query failed, trying simpler query", indexError);

      const simpleQuery = query(
        chatMessagesRef,
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(simpleQuery);
      const messages = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firebase Timestamp to Date if it exists
        let messageDate;
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
          messageDate = data.timestamp.toDate();
        } else if (data.timestamp && data.timestamp.seconds) {
          // Handle Firestore timestamp that might be serialized
          messageDate = new Date(data.timestamp.seconds * 1000);
        } else {
          // Fallback to current date if no timestamp
          messageDate = new Date();
        }

        messages.push({
          id: doc.id,
          content: data.content,
          isUserMessage: data.isUserMessage,
          userId: data.userId,
          timestamp: messageDate
        });
      });

      // Sort messages by timestamp client-side
      messages.sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
        const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
        return timeA - timeB;
      });

      return messages;
    }
  } catch (error) {
    console.error("Error fetching chat messages from Firebase:", error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (user, profileData) => {
  try {
    await firebaseUpdateProfile(user, profileData);
    return user;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Gujarat College interface













// Add a new college to Firestore
export const addCollege = async (college) => {
  try {
    const collegesRef = collection(db, "colleges");
    const docRef = await addDoc(collegesRef, college);

    return {
      id: docRef.id,
      ...college
    };
  } catch (error) {
    console.error("Error adding college to Firebase:", error);
    throw error;
  }
};

// Get colleges from Firestore with optional district filter
export const getColleges = async (district) => {
  try {
    const collegesRef = collection(db, "colleges");
    let queryRef = query(collegesRef);

    // Apply district filter if provided
    if (district && district !== "all") {
      queryRef = query(queryRef, where("district", "==", district));
    }

    const querySnapshot = await getDocs(queryRef);
    const colleges = [];

    querySnapshot.forEach((doc) => {
      colleges.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return colleges;
  } catch (error) {
    console.error("Error fetching colleges from Firebase:", error);
    throw error;
  }
};

// Get unique districts from Firestore colleges collection
export const getUniqueDistricts = async () => {
  try {
    const collegesRef = collection(db, "colleges");
    const querySnapshot = await getDocs(collegesRef);
    const districts = new Set();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.district) {
        districts.add(data.district);
      }
    });

    return Array.from(districts).sort();
  } catch (error) {
    console.error("Error fetching unique districts from Firebase:", error);
    throw error;
  }
};

// Function to add multiple colleges at once (for admin use)
export const addMultipleColleges = async (colleges) => {
  try {
    const collegesRef = collection(db, "colleges");
    let addedCount = 0;

    // Using a batch write for better performance with multiple documents
    const batch = writeBatch(db);

    colleges.forEach((college) => {
      const docRef = doc(collegesRef);
      batch.set(docRef, college);
      addedCount++;
    });

    await batch.commit();
    return addedCount;
  } catch (error) {
    console.error("Error adding multiple colleges to Firebase:", error);
    throw error;
  }
};

export { auth, db };