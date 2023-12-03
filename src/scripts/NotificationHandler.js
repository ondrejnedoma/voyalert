import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {Appearance} from 'react-native';

messaging().registerDeviceForRemoteMessages();

const notificationIcons = {
  sz: {
    light: require(`../img/sz.png`),
    dark: require(`../img/sz-dark.png`),
  },
};

async function onMessageReceived(message) {
  const darkScheme = Appearance.getColorScheme() === 'dark';
  const channelId = await notifee.createChannel({
    id: 'voyalert',
    name: 'VoyAlert',
    sound: 'default',
  });
  await notifee.displayNotification({
    title: message.data.voyNumber,
    body:
      (message.data.type === 'arrival' ? 'Arrived at ' : 'Departed ') +
      `${message.data.stop} at ${message.data.time}`,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      //   smallIcon: 'check', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      // pressAction: {
      //   id: 'default',
      // },
      largeIcon: darkScheme
        ? notificationIcons[message.data.dataSource].dark
        : notificationIcons[message.data.dataSource].light,
    },
  });
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
