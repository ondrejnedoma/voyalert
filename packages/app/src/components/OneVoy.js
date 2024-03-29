import React from 'react';
import {View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';

import SourceLogo from './SourceLogo';

export default function OneVoy({dataSource, voyName}) {
  const navigation = useNavigation();
  const handleOnPress = () => {
    navigation.navigate('Config', {dataSource, voyName});
  };
  return (
    <TouchableRipple onPress={handleOnPress}>
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
        <Text variant="titleLarge">{voyName}</Text>
      </View>
    </TouchableRipple>
  );
}
