import {View} from 'react-native';
import {TouchableRipple, Text} from 'react-native-paper';
import SourceLogo from './SourceLogo';
import React from 'react';

export default function OneVoy({dataSource, voyNumber, onPress}) {
  return (
    <TouchableRipple onPress={() => onPress({dataSource, voyNumber})}>
      <View
        style={{
          marginHorizontal: 24,
          marginVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <SourceLogo dataSource={dataSource} size={24} />
        <Text style={{marginHorizontal: 8}} variant="titleLarge">
          {voyNumber}
        </Text>
      </View>
    </TouchableRipple>
  );
}
