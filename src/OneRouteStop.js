import React from 'react';
import {View} from 'react-native';
import {Icon, Text, TouchableRipple, useTheme} from 'react-native-paper';

export default function OneRouteStop({
  stop,
  handleOnStopClick,
  isSomeAlertEnabled,
  loading,
}) {
  const theme = useTheme();
  return (
    <TouchableRipple
      onPress={() => handleOnStopClick(stop)}
      disabled={loading}>
      <View
        style={{
          marginHorizontal: 24,
          marginVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          variant="bodyLarge"
          style={{
            color: loading
              ? theme.colors.onSurfaceDisabled
              : theme.colors.onSurface,
          }}>
          {stop}
        </Text>
        {isSomeAlertEnabled(stop) ? (
          <Icon
            source="bell"
            size={20}
            color={theme.colors.primary}
          />
        ) : null}
      </View>
    </TouchableRipple>
  );
}
