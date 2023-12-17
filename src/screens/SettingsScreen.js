import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

import OneSettingsItem from '../OneSettingsItem';
import ScreenTitle from '../ScreenTitle';
import ServerURLDialog, {serverURLDialogState} from '../ServerURLDialog';

export default function SettingsScreen() {
  const [serverURLDialogVisible, setServerURLDialogVisible] =
    React.useState(false);
  let settingsItems = [
    {
      icon: 'server',
      name: 'Set server URL',
      onPress: () => setServerURLDialogVisible(true),
    },
  ];
  const handleCheckStates = () => {
    //TODO: Check individual settings states
  };
  React.useEffect(() => {
    handleCheckStates();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenTitle>Settings</ScreenTitle>
      <ScrollView>
        {settingsItems.map(el => (
          <OneSettingsItem
            key={el.name}
            icon={el.icon}
            name={el.name}
            state={el.state}
            onPress={el.onPress}
          />
        ))}
      </ScrollView>
      <ServerURLDialog
        visible={serverURLDialogVisible}
        setVisible={setServerURLDialogVisible}
      />
    </SafeAreaView>
  );
}
