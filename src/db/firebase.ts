import {
  App,
  getApps,
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let firebase: App | undefined;
let firestoreDb: Firestore;

if (!getApps().length) {
  firebase = initializeApp({
    credential: applicationDefault(),
    databaseURL: process.env.FIREBASE_DB_URL,
  });
  firestoreDb = getFirestore(firebase);
  firestoreDb.settings({ ignoreUndefinedProperties: true });
} else {
  firebase = getApps()[0];
  firestoreDb = getFirestore(firebase);
}

export { firestoreDb };

export const getUrlBySlug = async (
  shortcode: string
): Promise<string | undefined> => {
  const urlSnapshot = await firestoreDb
    .collection("links")
    .where("shortcode", "==", shortcode)
    .get();
  if (urlSnapshot.empty) {
    return;
  }

  const docs = urlSnapshot.docs;
  const firstMatch = docs[0]?.data()?.url;
  return firstMatch;
};

export type GetUrlBySlug = typeof getUrlBySlug;
