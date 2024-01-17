import React from 'react';
import {Linking, View} from 'react-native';
import {Icon, Text, TouchableRipple, useTheme} from 'react-native-paper';

export default function OneCreditsItem({icon, name, link}) {
  const theme = useTheme();
  return (
    <TouchableRipple onPress={() => Linking.openURL(link)}>
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
        </View>
      </View>
    </TouchableRipple>
  );
}
