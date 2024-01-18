import admin from 'firebase-admin';
import {getMessaging} from 'firebase-admin/messaging';
import serviceAccount from './firebase.json' assert {type: 'json'};

console.log(
  'Initializing Firebase with serviceAccount with client_id: ' +
    serviceAccount.client_id,
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseNotify = (token, data) => {
  const message = {
    token,
    data,
    android: {
      priority: 'HIGH',
    },
  };
  getMessaging().send(message);
};

export default firebaseNotify;
