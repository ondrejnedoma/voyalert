import {Appearance} from 'react-native';

import {parse} from 'date-fns';

import notifee, {
  AndroidCategory,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

messaging().registerDeviceForRemoteMessages();

const notificationIcons = {
  sz: {
    light: require(`../img/sz.png`),
    dark: require(`../img/sz-dark.png`),
  },
  idsok: {
    light: require(`../img/idsok.png`),
    dark: require(`../img/idsok-dark.png`),
  },
};

export let lastAlarmNotificationData = {};

async function onMessageReceived(message) {
  const {notificationType, dataSource, voyName, type, stop, time} =
    message.data;
  if (notificationType === 'silent') {
    return;
  }
  const darkScheme = Appearance.getColorScheme() === 'dark';
  const notificationChannel = dataSource + voyName + ' ' + notificationType;
  const title = voyName + ' ' + type;
  const body = stop + ', ' + time;
  const id = title + '_' + body;
  const icon = darkScheme
    ? notificationIcons[dataSource].dark
    : notificationIcons[dataSource].light;
  const parsedDate = parse(time, 'HH:mm', Date.now());
  if (notificationType === 'alarm') {
    const channelId = await notifee.createChannel({
      id: notificationChannel,
      name: notificationChannel,
      vibrationPattern: Array(100).fill(2000),
      sound: 'voyalert_alarm',
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      id,
      title,
      body: body,
      subtitle: notificationType,
      timestamp: parsedDate.getTime(),
      showTimestamp: true,
      android: {
        channelId,
        category: AndroidCategory.ALARM,
        largeIcon: icon,
        pressAction: {
          id: 'dismiss',
        },
        fullScreenAction: {
          id: 'default',
          launchActivity: 'me.ondrejnedoma.voyalert.AlarmActivity',
        },
        lightUpScreen: true,
        loopSound: true,
        ongoing: true,
      },
    });
    lastAlarmNotificationData = {
      id,
      dataSource,
      title,
      stop,
      time,
    };
  } else {
    const channelId = await notifee.createChannel({
      id: notificationChannel,
      name: notificationChannel,
      sound: 'voyalert_notification',
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title,
      body,
      subtitle: notificationType,
      android: {
        channelId,
        category: AndroidCategory.MESSAGE,
        largeIcon: icon,
        pressAction: {
          id: 'dismiss',
        },
        timestamp: parsedDate.getTime(),
        showTimestamp: true,
      },
    });
  }
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS && detail.pressAction.id === 'dismiss') {
    notifee.cancelNotification(detail.notification.id);
  }
});
