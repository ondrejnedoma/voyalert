import * as React from 'react';
import {AppRegistry, Text} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';
import Alarm from './src/Alarm';
import './src/scripts/NotificationHandler';

export default function Main() {
  return <App />;
}

AppRegistry.registerComponent(appName, () => Main);

AppRegistry.registerComponent('alarm', () => Alarm);
