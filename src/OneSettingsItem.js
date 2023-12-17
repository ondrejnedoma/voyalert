import React from 'react';
import {View} from 'react-native';
import {Icon, Text, TouchableRipple, useTheme} from 'react-native-paper';

export default function OneSettingsItem({icon, name, state, onPress}) {
  const theme = useTheme();
  return (
    <TouchableRipple onPress={onPress}>
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
            style={{
              marginBottom: 4,
            }}
            variant="titleMedium">
            {name}
          </Text>
          <Text variant="bodySmall">{state}</Text>
        </View>
      </View>
    </TouchableRipple>
  );
}
