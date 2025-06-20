import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, onIdTokenChanged, signInWithEmailAndPassword } from "firebase/auth";
import { child, Database, get, getDatabase, ref } from "firebase/database";
import Cookies from "js-cookie";

// Your web app's Firebase configuration
const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? '{}')

// Initialize Firebase
export function setupFirebase(): { app: FirebaseApp, auth: Auth, realtimeDb: Database } {
  if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    throw new Error("Firebase configuration is not set in environment variables");
  }

  const app: FirebaseApp = initializeApp(firebaseConfig);
  if (!app) {
    throw new Error("Firebase app is not initialized");
  }

  const auth = getAuth(app);
  const realtimeDb = getDatabase(app);

  if (!auth || !realtimeDb) {
    throw new Error("Firebase Auth or Realtime Database is not initialized");
  }

  return { app, auth, realtimeDb };
}

export async function signIn(email: string, password: string) {
  try {
    const { auth } = setupFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const idToken = await userCredential.user.getIdToken();
    await Cookies.set("__session", idToken, {
      expires: 7
    })

    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function getUser() {
  try {
    const { auth } = setupFirebase();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { auth } = setupFirebase();
    await auth.signOut();
    Cookies.remove("__session");
    window.location.reload();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export async function getChatList() {
  try {
    const { auth, realtimeDb } = setupFirebase();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }
    
    const dbRef = ref(realtimeDb);
    const chats = await get(child(dbRef, `${user.uid}/chats`))
    console.log("Chats:", chats.val());
    return chats
  } catch (error) {
    console.error("Error getting chat list:", error);
    throw error;
  }
}