// Import the Firebase app and messaging modules
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmJXMmu-v3T6BfnKadWWtsBLIXnwQbGkA",
    authDomain: "reabilite-pro-efd1d.firebaseapp.com",
    projectId: "reabilite-pro-efd1d",
    storageBucket: "reabilite-pro-efd1d.appspot.com",
    messagingSenderId: "35066393789",
    appId: "1:35066393789:web:76db1723fce0a7a8b3b3d4",
    measurementId: "G-XVZX7QWTBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
