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
      style={{paddingHorizontal: 24, paddingVertical: 16}}
      onPress={() => handleOnStopClick(stop)}
      disabled={loading}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          variant="bodyMedium"
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
            size={18}
            color={theme.colors.primary}
          />
        ) : null}
      </View>
    </TouchableRipple>
  );
}
