import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export async function signInWithEmailPassword(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function signUpWithEmailPassword(email, password) {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function signOutFirebase() {
  await signOut(auth);
}
