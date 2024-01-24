import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

import ServerURLDialog, {
  serverURLState,
} from '../components/settings/ServerURLDialog';
import OneSettingsItem from '../components/OneSettingsItem';
import ScreenTitle from '../components/ScreenTitle';
import {useTranslation} from 'react-i18next';

export default function SettingsScreen() {
  const {t} = useTranslation();
  const [serverURLDialogVisible, setServerURLDialogVisible] =
    React.useState(false);
  const [settingsItems, setSettingsItems] = React.useState([
    {
      icon: 'server',
      name: t('settings.items.serverURL.name'),
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
      <ScreenTitle>{t('settings.title')}</ScreenTitle>
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
