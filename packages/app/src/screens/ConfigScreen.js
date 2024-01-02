import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {Button, IconButton, Snackbar, Text} from 'react-native-paper';

import notifee from '@notifee/react-native';

import apiDelete from '../api/ApiDelete';
import ScreenTitle from '../components/ScreenTitle';
import SourceLogo from '../components/SourceLogo';

export default function ConfigScreen({route, navigation}) {
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
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <IconButton
          icon="delete"
          size={24}
          onPress={handleDelete}
          disabled={loading}
        />
      </View>
      <ScreenTitle
        smallMarginTop={true}
        withDataSouceIcon={true}
        dataSource={dataSource}
        withLoading={true}
        loading={loading}>
        {voyName}
      </ScreenTitle>
      <View style={{marginHorizontal: 24}}>
        <Text variant="titleMedium">Stops to alert at:</Text>
        <Button
          style={{alignSelf: 'flex-start', marginTop: 8}}
          icon="timeline-alert"
          mode="outlined"
          onPress={() =>
            navigation.navigate('ConfigRoute', {dataSource, voyName})
          }>
          Select stops
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
