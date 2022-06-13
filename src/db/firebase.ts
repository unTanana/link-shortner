import {
  App,
  getApps,
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";
import admin from "firebase-admin";

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

export const getUrlBySlugAndIncrementCount = async (
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
  const firstMatchingDocument = docs[0]?.data();

  if (firstMatchingDocument) {
    // don't await so we don't block the return
    incrementLinkCount(docs[0].id);
    return firstMatchingDocument?.url;
  }
};

export const incrementLinkCount = async (linkId: string) => {
  await firestoreDb
    .collection("links")
    .doc(linkId)
    .update({
      redirectCount: admin.firestore.FieldValue.increment(1),
      lastSeenDate: new Date().toISOString(),
    });
};

export const getUrlStats = async (shortcode: string) => {
  const urlSnapshot = await firestoreDb
    .collection("links")
    .where("shortcode", "==", shortcode)
    .get();
  if (urlSnapshot.empty) {
    return;
  }

  const docs = urlSnapshot.docs;
  const firstMatchingDocument = docs[0]?.data();

  if (firstMatchingDocument) {
    return {
      redirectCount: firstMatchingDocument?.redirectCount,
      lastSeenDate: firstMatchingDocument?.lastSeenDate,
      startDate: firstMatchingDocument?.startDate,
    };
  }
};

export const createLink = async (shortcode: string, url: string) => {
  const ref = await firestoreDb.collection("links").add({
    shortcode,
    url,
    redirectCount: 0,
    startDate: new Date().toISOString(),
    lastSeenDate: null,
  });

  const snapshot = await ref.get();
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getLinkBySlug = async (slug: string) => {
  const urlSnapshot = await firestoreDb
    .collection("links")
    .where("slug", "==", slug)
    .get();
  if (urlSnapshot.empty) {
    return;
  }

  const docs = urlSnapshot.docs;
  const firstMatchingDocument = docs[0]?.data();

  if (firstMatchingDocument) {
    return firstMatchingDocument;
  }
};

export type GetLinkBySlug = typeof getLinkBySlug;
export type GetUrlBySlugAndIncrementCount =
  typeof getUrlBySlugAndIncrementCount;
export type GetUrlStats = typeof getUrlStats;
export type CreateLink = typeof createLink;
