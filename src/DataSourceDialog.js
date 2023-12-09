import {View} from 'react-native';
import {Text, Icon, Dialog, Portal, useTheme} from 'react-native-paper';
import React from 'react';

export default function DataSourceDialog({visible, setVisible, content}) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>{content.name}</Dialog.Title>
        <Dialog.Content>
          <Text style={{marginBottom: 12}} variant="bodyMedium">
            {content.use}
          </Text>
          <View style={{gap: 4}}>
            {content.pros.map(el => (
              <View
                key={el}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  source="thumb-up"
                  color={theme.colors.primary}
                  size={20}
                />
                <Text style={{paddingHorizontal: 8}}>{el}</Text>
              </View>
            ))}
            {content.cons.map(el => (
              <View
                key={el}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  source="thumb-down"
                  color={theme.colors.primary}
                  size={20}
                />
                <Text style={{paddingHorizontal: 8}}>{el}</Text>
              </View>
            ))}
          </View>
          <Text style={{marginTop: 18}} variant="bodyMedium">
            {content.hint}
          </Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
