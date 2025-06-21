import { FirebaseServerApp, initializeApp, initializeServerApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? '{}')

export async function setupServerFirebase(): Promise<{ app: FirebaseServerApp; auth: Auth; }> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    throw new Error("Firebase configuration is not set in environment variables");
  }
  const authIdToken = (await cookies()).get("__session")?.value;

  const app = await initializeServerApp(
    initializeApp(firebaseConfig),
    {
      authIdToken,
    }
  );

  const auth = getAuth(app);
  await auth.authStateReady();
  return { app, auth };
}