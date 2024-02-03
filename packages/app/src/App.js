import React from 'react';
import {PermissionsAndroid, StatusBar, useColorScheme} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';

import merge from 'deepmerge';

import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddScreen from './screens/AddScreen';
import ConfigRouteScreen from './screens/ConfigRouteScreen';
import ConfigScreen from './screens/ConfigScreen';
import CreditsScreen from './screens/CreditsScreen';
import DonateScreen from './screens/DonateScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import StartScreen from './screens/StartScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function App() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const colorScheme = useColorScheme();
  const {theme} = useMaterial3Theme();
  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
  const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);
  const themeToApply =
    colorScheme === 'dark'
      ? {...CombinedDarkTheme, colors: theme.dark}
      : {...CombinedDefaultTheme, colors: theme.light};
  changeNavigationBarColor(
    themeToApply.colors.background,
    colorScheme !== 'dark',
  );
  let initialRouteName = 'Start';
  AsyncStorage.getItem('started').then(started => {
    if (started !== null) {
      if (started === true) {
        initialRouteName = 'Home';
      }
    }
  });
  return (
    <PaperProvider theme={themeToApply}>
      <NavigationContainer theme={themeToApply}>
        <StatusBar
          backgroundColor={themeToApply.colors.background}
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen
            name="Start"
            component={StartScreen}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
          />
          <Stack.Screen
            name="Donate"
            component={DonateScreen}
          />
          <Stack.Screen
            name="Credits"
            component={CreditsScreen}
          />
          <Stack.Screen
            name="Add"
            component={AddScreen}
          />
          <Stack.Screen
            name="Config"
            component={ConfigScreen}
          />
          <Stack.Screen
            name="ConfigRoute"
            component={ConfigRouteScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
