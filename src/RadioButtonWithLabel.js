import {View} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';
import React from 'react';

export default function RadioButtonWithLabel({label, value}) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <RadioButton value={value} />
      <Text>{label}</Text>
    </View>
  );
}
