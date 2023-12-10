import {View, useColorScheme, StatusBar, BackHandler} from 'react-native';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {
  Text,
  Button,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import React from 'react';

import notifee from '@notifee/react-native';
import {lastAlarmNotificationData} from './scripts/NotificationHandler';
import SourceLogo from './SourceLogo';
import {format, parse, differenceInSeconds} from 'date-fns';

export default function Alarm() {
  const colorScheme = useColorScheme();
  const {theme} = useMaterial3Theme();
  const themeToApply =
    colorScheme === 'dark'
      ? {...MD3DarkTheme, colors: theme.dark}
      : {...MD3LightTheme, colors: theme.light};
  changeNavigationBarColor(
    themeToApply.colors.background,
    colorScheme !== 'dark',
  );
  const dismiss = () => {
    notifee.cancelNotification(lastAlarmNotificationData.id);
    BackHandler.exitApp();
  };
  const [timePassed, setTimePassed] = React.useState(0);
  const eventTime = parse(lastAlarmNotificationData.time, 'HH:mm', Date.now());
  React.useEffect(() => {
    const interval = setInterval(() => {
      const secondsPassed = differenceInSeconds(Date.now(), eventTime);
      const minutes = Math.floor(secondsPassed / 60);
      const seconds = secondsPassed % 60;
      const newDate = new Date();
      newDate.setMinutes(minutes);
      newDate.setSeconds(seconds);
      setTimePassed(format(newDate, 'mm:ss'));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <PaperProvider theme={themeToApply}>
      <StatusBar
        backgroundColor={themeToApply.colors.background}
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: 48,
          backgroundColor: themeToApply.colors.background,
        }}>
        {lastAlarmNotificationData.dataSource ? (
          <SourceLogo
            dataSource={lastAlarmNotificationData.dataSource}
            size={60}
          />
        ) : null}
        {lastAlarmNotificationData.title ? (
          <Text
            style={{marginTop: 24, marginHorizontal: 30, textAlign: 'center'}}
            variant="displayMedium">
            {lastAlarmNotificationData.title}
          </Text>
        ) : null}
        {lastAlarmNotificationData.stop && lastAlarmNotificationData.time ? (
          <Text
            style={{marginTop: 24, marginHorizontal: 30, textAlign: 'center'}}
            variant="displaySmall">
            {lastAlarmNotificationData.stop +
              ', ' +
              lastAlarmNotificationData.time}
          </Text>
        ) : null}
        <Text style={{marginTop: 60, marginBottom: 24}} variant="displayLarge">
          -{timePassed.toString()}
        </Text>
        <Button
          style={{marginHorizontal: 30}}
          onPress={dismiss}
          mode="contained">
          Dismiss
        </Button>
      </View>
    </PaperProvider>
  );
}
