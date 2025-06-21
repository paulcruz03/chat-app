import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { child, Database, get, getDatabase, orderByChild, query, ref } from "firebase/database";
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
    Cookies.set("__session", idToken, {
      expires: 7
    })

    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function signInWithGoogle() {
  const { auth } = setupFirebase();
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider)
    .then(async (result) => {
      const userCredential = await GoogleAuthProvider.credentialFromResult(result);
      if (userCredential?.idToken) {
        await Cookies.set("__session", userCredential?.idToken, {
          expires: 7
        })

        return userCredential;
      }
      return null
    }).catch((error) => {
      console.error("Error signing in:", error);
      throw error;
    });
}

export async function getUser() {
  try {
    const { auth } = setupFirebase();
    const user = auth.currentUser;

    const userCookie = Cookies.get("__session")
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
    const chats = await query(child(dbRef, `${user.uid}/chats`), orderByChild('createdAt'))
    return await get(chats.ref)
  } catch (error) {
    console.error("Error getting chat list:", error);
    throw error;
  }
}