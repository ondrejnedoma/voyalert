import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import React from 'react';
import {PermissionsAndroid, useColorScheme, StatusBar} from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import merge from 'deepmerge';

import HomeScreen from './screens/HomeScreen';
import AddScreen from './screens/AddScreen';

const Stack = createStackNavigator();

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
  return (
    <PaperProvider theme={themeToApply}>
      <NavigationContainer theme={themeToApply}>
        <StatusBar
          backgroundColor={themeToApply.colors.background}
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Add" component={AddScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
