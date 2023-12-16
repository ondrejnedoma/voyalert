import React from 'react';
import {View} from 'react-native';
import {Icon, Text, TouchableRipple, useTheme} from 'react-native-paper';

import Clipboard from '@react-native-clipboard/clipboard';

export default function OneDonationItem({icon, address, note}) {
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
    <TouchableRipple
      style={{paddingHorizontal: 24, paddingVertical: 12}}
      onPress={() => Clipboard.setString(address)}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
        <Icon
          source={icon}
          color={theme.colors.primary}
          size={24}
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
