import { db } from "./firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export async function getWorkerProfile(docId) {
  const ref = doc(db, "workers", docId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

export async function setWorkerProfile(docId, data) {
  const ref = doc(db, "workers", docId);
  await setDoc(ref, data, { merge: true });
}

export async function getUserAccount(userId) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

export async function setUserAccount(userId, data) {
  const ref = doc(db, "users", userId);
  await setDoc(ref, data, { merge: true });
}

export async function getWorkersStats() {
  const snap = await getDocs(collection(db, "workers"));
  const workers = snap.docs.map((d) => d.data());
  const count = workers.length;
  const avgScore = count
    ? Math.round(workers.reduce((sum, w) => sum + (w.score || 0), 0) / count)
    : 0;
  const approvalRate = count
    ? Math.round((workers.filter((w) => (w.score || 0) > 700).length / count) * 100)
    : 0;
  const avgMonthlyIncome = count
    ? Math.round(workers.reduce((sum, w) => sum + (w.avgMonthlyGigIncome || 0), 0) / count)
    : 0;
  return { count, avgScore, approvalRate, avgMonthlyIncome };
}
