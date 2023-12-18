import React from 'react';
import {Linking, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  RadioButton,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenTitle from './ScreenTitle';
import apiPing from './scripts/ApiPing';

export default function ServerURLDialog({visible, setVisible}) {
  const [serverType, setServerType] = React.useState('default');
  const [customServerURL, setCustomServerURL] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const handleOnDonePress = async () => {
    if (serverType === 'default') {
      setCustomServerURL('');
      await AsyncStorage.removeItem('settings.customServerURL');
      setVisible(false);
    } else if (serverType === 'custom') {
      setLoading(true);
      const data = await apiPing({url: customServerURL});
      setLoading(false);
      if (data.ok) {
        await AsyncStorage.setItem('settings.customServerURL', customServerURL);
        setVisible(false);
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const valueCustomServerURL = await AsyncStorage.getItem(
        'settings.customServerURL',
      );
      if (valueCustomServerURL !== null) {
        setServerType('custom');
        setCustomServerURL(valueCustomServerURL);
      }
    };
    fetchData();
  }, []);
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}>
        <Dialog.Title>
          <ScreenTitle
            dialog={true}
            withLoading={true}
            loading={loading}>
            Set Server URL
          </ScreenTitle>
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={{marginBottom: 16}}
            variant="bodyMedium">
            VoyAlert can be set up in a way to use a custom server. This is
            useful for testing, or if you are self-hosting{' '}
            <Text
              style={{
                textDecorationLine: 'underline',
                color: theme.colors.primary,
              }}
              variant="bodyMedium"
              onPress={() =>
                Linking.openURL(
                  'https://github.com/ondrejnedoma/voyalert-backend',
                )
              }>
              voyalert-backend
            </Text>{' '}
            for any reason. If you are not sure what the previous sentence
            means, it's a wise choice not to touch this setting. Changes won't
            be saved until "Done" is pressed.
          </Text>
          <RadioButton.Group
            onValueChange={newServerType => setServerType(newServerType)}
            value={serverType}>
            <RadioButton.Item
              position="leading"
              labelVariant="bodyLarge"
              label="Use the default server"
              value="default"
            />
            <RadioButton.Item
              position="leading"
              labelVariant="bodyLarge"
              label="Use a custom server"
              value="custom"
            />
          </RadioButton.Group>
          {serverType === 'custom' ? (
            <>
              <TextInput
                style={{
                  marginTop: 16,
                  marginBottom: 8,
                  backgroundColor: theme.colors.elevation.level3,
                }}
                mode="outlined"
                label="Server URL"
                value={customServerURL}
                onChangeText={text => setCustomServerURL(text)}
              />
              <Text variant="bodySmall">
                The server will be tested by GET /ping
              </Text>
            </>
          ) : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleOnDonePress}>Done</Button>
        </Dialog.Actions>
      </Dialog>
      <Snackbar
        visible={showErrorSnackbar}
        onDismiss={() => setShowErrorSnackbar(false)}>
        {errorSnackbarText}
      </Snackbar>
    </Portal>
  );
}

export const serverURLState = async () => {
  const valueCustomServerURL = await AsyncStorage.getItem(
    'settings.customServerURL',
  );
  if (valueCustomServerURL !== null) {
    return valueCustomServerURL;
  } else {
    return 'Use the default server';
  }
};
