import React from 'react';
import {IconButton, Linking, Menu} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';

export default function HomeScreenMenu({visible, setVisible}) {
  const navigation = useNavigation();
  const menuItems = [
    {
      title: 'Settings ⚙️',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: 'Donate 💸',
      onPress: () => navigation.navigate('Donate'),
    },
    {
      title: 'Report a bug 🪲',
      onPress: () =>
        Linking.openURL('https://github.com/ondrejnedoma/voyalert/issues/new'),
    },
    {
      title: 'Credits 🏆',
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
