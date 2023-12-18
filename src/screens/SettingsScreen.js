import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import OneSettingsItem from '../OneSettingsItem';
import ScreenTitle from '../ScreenTitle';
import ServerURLDialog, {serverURLState} from '../ServerURLDialog';

export default function SettingsScreen() {
  const [serverURLDialogVisible, setServerURLDialogVisible] =
    React.useState(false);
  const [settingsItems, setSettingsItems] = React.useState([
    {
      icon: 'server',
      name: 'Set server URL',
      stateFunction: serverURLState,
      onPress: () => setServerURLDialogVisible(true),
    },
  ]);
  React.useEffect(() => {
    const fetchData = async () => {
      let newSettingsItems = [...settingsItems];
      for (const [index, settingsItem] of settingsItems.entries()) {
        const state = await settingsItem.stateFunction();
        newSettingsItems[index].state = state;
      }
      setSettingsItems(newSettingsItems);
    };
    if (!serverURLDialogVisible) {
      fetchData();
    }
  }, [serverURLDialogVisible]);
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
