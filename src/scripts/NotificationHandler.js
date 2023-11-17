import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

messaging().registerDeviceForRemoteMessages();

async function onMessageReceived(message) {
  const channelId = await notifee.createChannel({
    id: 'voyalert',
    name: 'VoyAlert',
    sound: 'default',
  });
  await notifee.displayNotification({
    title: message.data.title,
    body: message.data.body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      //   smallIcon: 'check', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
