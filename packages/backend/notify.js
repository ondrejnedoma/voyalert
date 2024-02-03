import admin from 'firebase-admin';
import {getMessaging} from 'firebase-admin/messaging';
import serviceAccount from './firebase.json' assert {type: 'json'};
import PendingNotification from './db-models/pendingNotification.js';

console.log(
  'Initializing Firebase with serviceAccount.client_id: ' +
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

const httpNotify = (id, data) => {
  PendingNotification.create({id, data});
};

const notify = (id, notificationType, data) => {
  if (notificationType === 'firebase') {
    firebaseNotify(id, data);
  } else if (notificationType === 'http') {
    httpNotify(id, data);
  }
};

export default notify;
