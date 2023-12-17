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
}) {
  const marginTop = smallMarginTop ? 32 : 84;
  if (withLoading && withDataSouceIcon) {
    return (
      <View
        style={{
          marginTop,
          marginBottom: 42,
          marginHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <SourceLogo
          dataSource={dataSource}
          size={42}
        />
        <Text
          style={{marginLeft: 12}}
          variant="displaySmall">
          {children}
        </Text>
        {loading ? <ActivityIndicator style={{marginLeft: 16}} /> : null}
      </View>
    );
  } else if (withLoading) {
    return (
      <View
        style={{
          marginTop,
          marginBottom: 42,
          marginHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text variant="displaySmall">{children}</Text>
        {loading ? <ActivityIndicator style={{marginLeft: 16}} /> : null}
      </View>
    );
  } else if (withDataSouceIcon) {
    return (
      <View
        style={{
          marginTop,
          marginBottom: 42,
          marginHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <SourceLogo
          dataSource={dataSource}
          size={42}
        />
        <Text
          style={{marginLeft: 12}}
          variant="displaySmall">
          {children}
        </Text>
      </View>
    );
  } else {
    return (
      <Text
        style={{
          marginTop,
          marginBottom: 42,
          marginHorizontal: 24,
        }}
        variant="displaySmall">
        {children}
      </Text>
    );
  }
}
