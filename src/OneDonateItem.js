import React from 'react';
import {View} from 'react-native';
import {Icon, Text, TouchableRipple, useTheme} from 'react-native-paper';

import Clipboard from '@react-native-clipboard/clipboard';

export default function OneDonateItem({icon, address, note}) {
  const theme = useTheme();
  const shortenAddress = address => {
    const targetLength = 30;
    if (address.length > targetLength) {
      const halfLength = Math.floor((targetLength - 3) / 2); // Subtracting 3 for the "..."
      const firstHalf = address.substring(0, halfLength);
      const secondHalf = address.substring(address.length - halfLength);
      return `${firstHalf}...${secondHalf}`;
    }
    return address;
  };
  return (
    <TouchableRipple onPress={() => Clipboard.setString(address)}>
      <View
        style={{
          marginHorizontal: 24,
          marginVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
        <Icon
          source={icon}
          color={theme.colors.primary}
          size={28}
        />
        <View>
          <Text
            style={{flexShrink: 1}}
            variant="bodyMedium">
            {shortenAddress(address)}
          </Text>
          <Text variant="bodySmall">{note}</Text>
        </View>
      </View>
    </TouchableRipple>
  );
}
