import { initializeApp } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
};
 export const app = initializeApp(firebaseConfig);
let messaging: Messaging;
if (
  typeof window !== 'undefined' &&
  'Notification' in window &&
  ['FB_IAB', 'FB4A', 'FBAN', 'FBAV'].find((agent) => navigator.userAgent.includes(agent)) === undefined
) {
   messaging = getMessaging(app);
}
export { messaging };
