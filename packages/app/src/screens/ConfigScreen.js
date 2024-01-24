import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {Button, IconButton, Snackbar, Text} from 'react-native-paper';

import notifee from '@notifee/react-native';

import apiDelete from '../api/ApiDelete';
import ScreenTitle from '../components/ScreenTitle';
import {useTranslation} from 'react-i18next';
import AppBar from '../components/AppBar';

export default function ConfigScreen({route, navigation}) {
  const {t} = useTranslation();
  const {dataSource, voyName} = route.params;
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const handleDelete = () => {
    setLoading(true);
    apiDelete({dataSource, voyName}).then(data => {
      setLoading(false);
      if (data.ok) {
        notifee.deleteChannel(`${dataSource} ${voyName} notification`);
        notifee.deleteChannel(`${dataSource} ${voyName} alarm`);
        navigation.goBack();
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    });
  };
  const appBarButtonsLeft = [
    {
      icon: 'arrow-left',
      onPress: navigation.goBack,
    },
  ];
  const appBarButtonsRight = [
    {
      icon: 'delete',
      onPress: handleDelete,
      disabled: loading,
    },
  ];
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: 24}}>
        <AppBar
          buttonsLeft={appBarButtonsLeft}
          buttonsRight={appBarButtonsRight}
        />
        <ScreenTitle
          withDataSouceIcon={true}
          dataSource={dataSource}
          withLoading={true}
          loading={loading}>
          {voyName}
        </ScreenTitle>
        <Text variant="titleMedium">{t('config.stopsToAlertAt')}</Text>
        <Button
          style={{alignSelf: 'flex-start', marginTop: 8}}
          icon="timeline-alert"
          mode="outlined"
          onPress={() =>
            navigation.navigate('ConfigRoute', {dataSource, voyName})
          }>
          {t('config.selectStopsButton')}
        </Button>
      </View>
      <Snackbar
        visible={showErrorSnackbar}
        onDismiss={() => setShowErrorSnackbar(false)}>
        {errorSnackbarText}
      </Snackbar>
    </SafeAreaView>
  );
}
