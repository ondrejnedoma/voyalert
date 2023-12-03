import {View, SafeAreaView} from 'react-native';
import {Text, ActivityIndicator, Checkbox, Snackbar} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import apiRoute from '../scripts/ApiRoute';
import apiGetConfig from '../scripts/ApiGetConfig';
import apiSetConfig from '../scripts/ApiSetConfig';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';

export default function ConfigRouteScreen({route, navigation}) {
  const {dataSource, voyNumber} = route.params;
  const [stops, setStops] = React.useState([]);
  const [checkedStops, setCheckedStops] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const handleRoute = async () => {
    setLoading(true);
    const data = await apiRoute({dataSource, voyNumber});
    setLoading(false);
    if (data.ok) {
      setStops(data.data);
    } else {
      setErrorSnackbarText(data.error);
      setShowErrorSnackbar(true);
    }
  };
  const handleGetConfigStops = async () => {
    setLoading(true);
    const data = await apiGetConfig({
      dataSource,
      voyNumber,
      field: 'stops',
    });
    setLoading(false);
    if (data.ok) {
      setCheckedStops(data.data);
    } else {
      setErrorSnackbarText(data.error);
      setShowErrorSnackbar(true);
    }
  };
  const handleSetConfigStops = async stopsToSet => {
    setLoading(true);
    const data = await apiSetConfig({
      dataSource,
      voyNumber,
      field: 'stops',
      value: stopsToSet,
    });
    setLoading(false);
    if (!data.ok) {
      setErrorSnackbarText(data.error);
      setShowErrorSnackbar(true);
      return false;
    }
    return true;
  };
  const handleOnStopClick = async stop => {
    const prevCheckedStops = [...checkedStops];
    const checkedStopsIndex = prevCheckedStops.indexOf(stop);
    let newCheckedStops = [...prevCheckedStops];

    if (checkedStopsIndex > -1) {
      newCheckedStops.splice(checkedStopsIndex, 1);
    } else {
      newCheckedStops.push(stop);
    }
    const ok = await handleSetConfigStops(newCheckedStops);
    if (ok) {
      setCheckedStops(newCheckedStops);
    } else {
      setCheckedStops(prevCheckedStops);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      handleRoute();
      handleGetConfigStops();
    }, []),
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          marginTop: 84,
          marginHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text variant="displaySmall">Select stops</Text>
        {loading ? <ActivityIndicator style={{marginHorizontal: 16}} /> : null}
      </View>
      <ScrollView>
        {stops.length > 0
          ? stops.map(stop => (
              <Checkbox.Item
                key={stop}
                style={{paddingHorizontal: 30}}
                labelVariant="bodyMedium"
                label={stop}
                status={checkedStops.includes(stop) ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleOnStopClick(stop);
                }}
                disabled={loading}
              />
            ))
          : null}
      </ScrollView>
      <Snackbar
        visible={showErrorSnackbar}
        onDismiss={() => setShowErrorSnackbar(false)}>
        {errorSnackbarText}
      </Snackbar>
    </SafeAreaView>
  );
}
