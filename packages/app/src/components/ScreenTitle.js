import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';

import SourceLogo from './SourceLogo';

export default function ScreenTitle({
  children,
  withLoading,
  loading,
  withDataSouceIcon,
  dataSource,
  dialog,
}) {
  const marginTop = dialog ? 0 : 32;
  const marginBottom = dialog ? 0 : 42;
  const variant = dialog ? 'headlineLarge' : 'displaySmall';
  if (withLoading && withDataSouceIcon) {
    return (
      <View
        style={{
          marginTop,
          marginBottom,
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
        }}
        variant={variant}>
        {children}
      </Text>
    );
  }
}
