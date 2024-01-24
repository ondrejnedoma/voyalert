import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {Snackbar} from 'react-native-paper';

import {useFocusEffect} from '@react-navigation/native';

import StopConfigDialog from '../StopConfigDialog';
import apiGetConfig from '../api/ApiGetConfig';
import apiRoute from '../api/ApiRoute';
import OneRouteStop from '../components/OneRouteStop';
import ScreenTitle from '../components/ScreenTitle';
import {useTranslation} from 'react-i18next';

export default function ConfigRouteScreen({route, navigation}) {
  const {dataSource, voyName} = route.params;
  const {t} = useTranslation();
  const [stops, setStops] = React.useState();
  const [config, setConfig] = React.useState();
  const [stopConfigDialogVisible, setStopConfigDialogVisible] =
    React.useState(false);
  const [stopConfigDialogConfig, setStopConfigDialogConfig] = React.useState({
    notifyArrival: false,
    notifyDeparture: false,
    alarmArrival: false,
    alarmDeparture: false,
  });
  const [stopConfigDialogStopName, setStopConfigDialogStopName] =
    React.useState('');
  const [stopConfigDialogOptions, setStopConfigDialogOptions] = React.useState({
    isArrivalEnabled: true,
    isDepartureEnabled: true,
  });
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const handleRoute = async () => {
    const data = await apiRoute({dataSource, voyName});
    if (data.ok) {
      setStops(data.data);
    } else {
      setErrorSnackbarText(data.error);
      setShowErrorSnackbar(true);
    }
  };
  const handleGetConfig = async () => {
    const data = await apiGetConfig({dataSource, voyName});
    if (data.ok) {
      setConfig(data.data);
    } else {
      setErrorSnackbarText(data.error);
      setShowErrorSnackbar(true);
    }
  };
  const handleOnStopPress = stopName => {
    if (config.stops && config.stops.some(stop => stop.name === stopName)) {
      const stopConfig = config.stops.find(stop => stop.name === stopName);
      setStopConfigDialogConfig(stopConfig);
    }
    setStopConfigDialogStopName(stopName);
    let dialogOptions = {...stopConfigDialogOptions};
    if (stops[stops.length - 1] === stopName) {
      dialogOptions.isDepartureEnabled = false;
    } else if (stops[0] === stopName) {
      dialogOptions.isArrivalEnabled = false;
    }
    if (dataSource === 'idsok') {
      dialogOptions.isArrivalEnabled = false;
    }
    setStopConfigDialogOptions(dialogOptions);
    setStopConfigDialogVisible(true);
  };
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await handleRoute();
        await handleGetConfig();
        setLoading(false);
      };
      fetchData();
    }, []),
  );
  const onDialogDismissed = async () => {
    setStopConfigDialogVisible(false);
    setStopConfigDialogStopName('');
    setStopConfigDialogConfig({
      notifyArrival: false,
      notifyDeparture: false,
      alarmArrival: false,
      alarmDeparture: false,
    });
    setStopConfigDialogOptions({
      isArrivalEnabled: true,
      isDepartureEnabled: true,
    });
    setLoading(true);
    await handleGetConfig();
    setLoading(false);
  };
  const isSomeAlertEnabled = stopName => {
    if (config.stops && config.stops.some(stop => stop.name === stopName)) {
      const stopData = config.stops.find(stop => stop.name === stopName);
      if (
        stopData.notifyArrival ||
        stopData.notifyDeparture ||
        stopData.alarmArrival ||
        stopData.alarmDeparture
      ) {
        return true;
      }
    }
    return false;
  };
  const appBarButtonsLeft = [
    {
      icon: 'arrow-left',
      onPress: navigation.goBack,
    },
  ];
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: 24}}>
        <AppBar buttonsLeft={appBarButtonsLeft} />
        <ScreenTitle
          withLoading={true}
          loading={loading}>
          {t('configRoute.title')}
        </ScreenTitle>
      </View>
      <ScrollView>
        {stops && config
          ? stops.map(stop => (
              <OneRouteStop
                key={stop}
                stop={stop}
                onPress={handleOnStopPress}
                isSomeAlertEnabled={isSomeAlertEnabled}
                loading={loading}
              />
            ))
          : null}
      </ScrollView>
      {config ? (
        <StopConfigDialog
          visible={stopConfigDialogVisible}
          onDismiss={onDialogDismissed}
          dataSource={dataSource}
          voyName={voyName}
          stopName={stopConfigDialogStopName}
          config={stopConfigDialogConfig}
          options={stopConfigDialogOptions}
          setShowErrorSnackbar={setShowErrorSnackbar}
          setErrorSnackbarText={setErrorSnackbarText}
        />
      ) : null}
      <Snackbar
        visible={showErrorSnackbar}
        onDismiss={() => setShowErrorSnackbar(false)}>
        {errorSnackbarText}
      </Snackbar>
    </SafeAreaView>
  );
}
