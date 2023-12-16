import React from 'react';
import {IconButton, Menu} from 'react-native-paper';

export default function HomeScreenMenu({visible, setVisible, handleItemPress}) {
  return (
    <Menu
      style={{marginTop: 8}}
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton
          icon="dots-vertical"
          size={24}
          onPress={() => setVisible(true)}
        />
      }>
      <Menu.Item
        title="Settings ⚙️"
        onPress={() => handleItemPress('settings')}
        disabled={true}
      />
      <Menu.Item
        title="Donate 💸"
        onPress={() => handleItemPress('donate')}
      />
      <Menu.Item
        title="Report a bug 🪲"
        onPress={() => handleItemPress('bug')}
      />
    </Menu>
  );
}
