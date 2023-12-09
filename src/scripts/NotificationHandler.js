import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidCategory,
} from '@notifee/react-native';
import {Appearance} from 'react-native';

messaging().registerDeviceForRemoteMessages();

const notificationIcons = {
  sz: {
    light: require(`../img/sz.png`),
    dark: require(`../img/sz-dark.png`),
  },
};

async function onMessageReceived(message) {
  console.log(message.data.notificationType);
  const darkScheme = Appearance.getColorScheme() === 'dark';
  const channelId = await notifee.createChannel({
    id: 'voyalert',
    name: 'VoyAlert',
    importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    title: message.data.voyNumber,
    body:
      (message.data.type === 'arrival' ? 'Arrived at ' : 'Departed ') +
      `${message.data.stop} at ${message.data.time}`,
    android: {
      channelId,
      category:
        message.data.notificationType === 'alarm'
          ? AndroidCategory.CALL
          : undefined,
      importance: AndroidImportance.HIGH,
      //   smallIcon: 'check', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      // pressAction: {
      //   id: 'default',
      // },
      largeIcon: darkScheme
        ? notificationIcons[message.data.dataSource].dark
        : notificationIcons[message.data.dataSource].light,
      fullScreenAction:
        message.data.notificationType === 'alarm'
          ? {
              id: 'default',
            }
          : undefined,
      actions: [
        {
          title: 'Decline',
          pressAction: {
            id: 'decline-call',
          },
        },
        {
          title: 'Answer',
          pressAction: {
            id: 'answer-call',
          },
        },
      ],
      lightUpScreen: true,
    },
  });
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
