import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {ActivityIndicator, Snackbar, Text} from 'react-native-paper';

import {useFocusEffect} from '@react-navigation/native';

import OneRouteStop from '../OneRouteStop';
import ScreenTitle from '../ScreenTitle';
import StopConfigDialog from '../StopConfigDialog';
import apiGetConfig from '../scripts/ApiGetConfig';
import apiRoute from '../scripts/ApiRoute';

export default function ConfigRouteScreen({route}) {
  const {dataSource, voyNumber} = route.params;
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
    const data = await apiRoute({dataSource, voyNumber});
    if (data.ok) {
      setStops(data.data);
    } else {
      setErrorSnackbarText(data.error);
      setShowErrorSnackbar(true);
    }
  };
  const handleGetConfig = async () => {
    const data = await apiGetConfig({dataSource, voyNumber});
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
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenTitle
        withLoading={true}
        loading={loading}>
        Configure stops
      </ScreenTitle>
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
          voyNumber={voyNumber}
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
