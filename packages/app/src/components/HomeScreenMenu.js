import React from 'react';
import {IconButton, Linking, Menu} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

export default function HomeScreenMenu({visible, setVisible}) {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const menuItems = [
    {
      title: t('home.menu.settings'),
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: t('home.menu.donate'),
      onPress: () => navigation.navigate('Donate'),
    },
    {
      title: t('home.menu.reportBug'),
      onPress: () =>
        Linking.openURL('https://github.com/ondrejnedoma/voyalert/issues/new'),
    },
    {
      title: t('home.menu.credits'),
      onPress: () => navigation.navigate('Credits'),
    },
  ];
  const handleOnPress = onPress => {
    setVisible(false);
    onPress();
  };
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton
          icon="dots-vertical"
          size={24}
          onPress={() => setVisible(true)}
        />
      }>
      {menuItems.map(el => (
        <Menu.Item
          key={el.title}
          title={el.title}
          onPress={() => handleOnPress(el.onPress)}
        />
      ))}
    </Menu>
  );
}
