import { getMessaging } from "firebase-admin/messaging";

const removeInvalidSubscriptions = (subscriptionDb, cacheDbs) => {
  let newSubscriptionDb = [];

  //Remove subscriptions for Voys which are not cached anymore
  for (const cacheDb of cacheDbs) {
    const validSubscriptions = subscriptionDb.data.subscriptions.filter(
      (subscription) => {
        const isValidRoute = cacheDb.data.routes.some(
          (route) => subscription.voyNumber === route.number
        );
        return isValidRoute;
      }
    );
    newSubscriptionDb = [...newSubscriptionDb, ...validSubscriptions];
  }
  subscriptionDb.data.subscriptions = newSubscriptionDb;

  // Remove subscriptions for FCM tokens which are not registered
  for (const [
    index,
    subscription,
  ] of subscriptionDb.data.subscriptions.entries()) {
    const message = {
      token: subscription.token,
      data: {
        notificationType: "silent",
      },
      android: {
        priority: "HIGH",
      },
    };
    getMessaging()
      .send(message)
      .catch((e) => {
        if (e.code === "messaging/registration-token-not-registered") {
          console.warn("Removing invalid token " + subscription.token);
          subscriptionDb.data.subscriptions.splice(index, 1);
        } else {
          console.warn("Unexpected FCM error: " + e);
        }
      });
  }

  subscriptionDb.write();
};

export default removeInvalidSubscriptions;
