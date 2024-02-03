import {getMessaging} from 'firebase-admin/messaging';

import Subscription from '../db-models/subscription.js';

const removeInvalidSubscriptions = async routeCaches => {
  // Remove subscriptions for Voys which are not cached anymore
  for (const routeCache of routeCaches) {
    const cachedNames = (await routeCache.find({})).map(route => route.name);
    await Subscription.deleteMany({voyName: {$nin: cachedNames}});
  }

  // Remove subscriptions for FCM tokens which are not registered
  const allFirebaseTokens = (
    await Subscription.find({notificationType: 'firebase'})
  ).map(subscription => subscription.id);
  const uniqueFirebaseTokens = [...new Set(allFirebaseTokens)];
  const invalidFirebaseTokens = [];
  for (const firebaseToken of uniqueFirebaseTokens) {
    const message = {
      token: firebaseToken,
      data: {
        notificationType: 'silent',
      },
      android: {
        priority: 'HIGH',
      },
    };
    getMessaging()
      .send(message)
      .catch(e => {
        if (e.code === 'messaging/registration-token-not-registered') {
          invalidFirebaseTokens.push(firebaseToken);
        } else {
          console.warn('Unexpected FCM error: ' + e);
        }
      });
  }
  Subscription.deleteMany({firebaseToken: {$in: invalidFirebaseTokens}});
};

export default removeInvalidSubscriptions;
