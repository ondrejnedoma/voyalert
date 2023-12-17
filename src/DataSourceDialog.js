import React from 'react';
import {View} from 'react-native';
import {Dialog, Icon, Portal, Text, useTheme} from 'react-native-paper';

export default function DataSourceDialog({visible, setVisible, content}) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}>
        <Dialog.Title>{content.name}</Dialog.Title>
        <Dialog.Content>
          <Text
            style={{marginBottom: 16}}
            variant="bodyMedium">
            {content.use}
          </Text>
          <View style={{gap: 8, marginBottom: 16}}>
            {content.pros.map(el => (
              <View
                key={el}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  source="thumb-up"
                  color={theme.colors.primary}
                  size={20}
                />
                <Text
                  style={{paddingHorizontal: 8}}
                  variant="bodyMedium">
                  {el}
                </Text>
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
                <Text
                  style={{paddingHorizontal: 8}}
                  variant="bodyMedium">
                  {el}
                </Text>
              </View>
            ))}
          </View>
          <Text variant="bodySmall">{content.hint}</Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
