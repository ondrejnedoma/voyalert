import React from 'react';
import {View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';

import SourceLogo from './SourceLogo';

export default function OneVoy({dataSource, voyNumber, onPress}) {
  return (
    <TouchableRipple onPress={() => onPress({dataSource, voyNumber})}>
      <View
        style={{
          marginHorizontal: 24,
          marginVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
        <SourceLogo
          dataSource={dataSource}
          size={28}
        />
        <Text variant="titleLarge">{voyNumber}</Text>
      </View>
    </TouchableRipple>
  );
}
