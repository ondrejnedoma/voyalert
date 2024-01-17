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

import apiPing from './api/ApiPing';
import i18next from 'i18next';
import ScreenTitle from './components/ScreenTitle';
import {useTranslation} from 'react-i18next';

export default function ServerURLDialog({visible, setVisible}) {
  const {t} = useTranslation();
  const [serverType, setServerType] = React.useState('default');
  const [customServerURL, setCustomServerURL] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const handleOnDonePress = async () => {
    if (serverType === 'default') {
      setCustomServerURL('');
      await AsyncStorage.removeItem('settings.serverURL');
      setVisible(false);
    } else if (serverType === 'custom') {
      setLoading(true);
      const data = await apiPing({url: customServerURL});
      setLoading(false);
      if (data.ok) {
        await AsyncStorage.setItem('settings.serverURL', customServerURL);
        setVisible(false);
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const valueCustomServerURL =
        await AsyncStorage.getItem('settings.serverURL');
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
            {t('settings.items.serverURL.name')}
          </ScreenTitle>
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={{marginBottom: 16}}
            variant="bodyMedium">
            {t('settings.items.serverURL.description')}
          </Text>
          <RadioButton.Group
            onValueChange={newServerType => setServerType(newServerType)}
            value={serverType}>
            <RadioButton.Item
              position="leading"
              labelVariant="bodyLarge"
              label={t('settings.items.serverURL.defaultOption')}
              value="default"
            />
            <RadioButton.Item
              position="leading"
              labelVariant="bodyLarge"
              label={t('settings.items.serverURL.customOption')}
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
                label={t('settings.items.serverURL.customOptionPlaceholder')}
                value={customServerURL}
                onChangeText={text => setCustomServerURL(text)}
              />
              <Text variant="bodySmall">
                {t('settings.items.serverURL.ping')}
              </Text>
            </>
          ) : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleOnDonePress}>
            {t('settings.doneButton')}
          </Button>
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

export async function serverURLState() {
  const valueCustomServerURL = await AsyncStorage.getItem('settings.serverURL');
  if (valueCustomServerURL !== null) {
    return valueCustomServerURL;
  } else {
    return i18next.t('settings.item.serverURL.default');
  }
}
