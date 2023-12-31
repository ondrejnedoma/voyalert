import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import "dotenv/config";

admin.initializeApp();

const firebaseNotify = (token, data) => {
  const message = {
    token,
    data,
    android: {
      priority: "HIGH",
    },
  };
  getMessaging().send(message);
};

export default firebaseNotify;
