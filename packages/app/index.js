import * as React from 'react';
import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';
import App from './src/App';
import AlarmScreen from './src/screens/AlarmScreen';
import './src/scripts/i18nHandler';
import './src/scripts/NotificationHandler';

export default function Main() {
  return <App />;
}

AppRegistry.registerComponent(appName, () => Main);

AppRegistry.registerComponent('alarm', () => AlarmScreen);
