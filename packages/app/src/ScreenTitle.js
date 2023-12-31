import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';

import SourceLogo from './SourceLogo';

export default function ScreenTitle({
  children,
  smallMarginTop,
  withLoading,
  loading,
  withDataSouceIcon,
  dataSource,
  dialog,
}) {
  const marginTop = dialog ? 0 : smallMarginTop ? 32 : 84;
  const marginBottom = dialog ? 0 : 42;
  const marginHorizontal = dialog ? 0 : 24;
  const variant = dialog ? 'headlineLarge' : 'displaySmall';
  if (withLoading && withDataSouceIcon) {
    return (
      <View
        style={{
          marginTop,
          marginBottom,
          marginHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}>
        <SourceLogo
          dataSource={dataSource}
          size={42}
        />
        <Text variant={variant}>{children}</Text>
        {loading ? <ActivityIndicator /> : null}
      </View>
    );
  } else if (withLoading) {
    return (
      <View
        style={{
          marginTop,
          marginBottom,
          marginHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}>
        <Text variant={variant}>{children}</Text>
        {loading ? <ActivityIndicator /> : null}
      </View>
    );
  } else if (withDataSouceIcon) {
    return (
      <View
        style={{
          marginTop,
          marginBottom,
          marginHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}>
        <SourceLogo
          dataSource={dataSource}
          size={42}
        />
        <Text variant={variant}>{children}</Text>
      </View>
    );
  } else {
    return (
      <Text
        style={{
          marginTop,
          marginBottom,
          marginHorizontal,
        }}
        variant={variant}>
        {children}
      </Text>
    );
  }
}
