import { View, SafeAreaView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  RadioButton,
  Dialog, Portal,
  Snackbar,
  IconButton,
} from 'react-native-paper';
import apiAdd from '../scripts/ApiAdd';
import React from 'react';

export default function AddScreen({ navigation }) {
  const [dataSource, setDataSource] = React.useState('');
  const [voyNumber, setVoyNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const dataSourceInfo = [
    { value: "sz", name: "Správa Železnic (GRAPP)", use: 'This data source is applicable for all passenger trains on the Czech soil - grapp.spravazeleznic.cz', pros: ["Works with every carrier (ČD, RJ, LE, Arriva...)"], cons: ["Alerts only at railway stations with dispatchers"] },
    { value: "cd", name: "České Dráhy", use: 'This data source is applicable for all ČD trains - grapp.spravazeleznic.cz', pros: ["Notifies at every stop"], cons: ["Only works with ČD trains"] },
  ];
  const [dataSourceDialogVisible, setDataSourceDialogVisible] = React.useState(false)
  const handleAdd = () => {
    setLoading(true);
    apiAdd({ dataSource, voyNumber }).then(data => {
      setLoading(false);
      if (data.ok) {
        navigation.goBack();
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 24 }}>
        <Text style={{ marginTop: 84 }} variant="displaySmall">
          Add Voy...
        </Text>
        <Text style={{ marginTop: 42, marginBottom: 8 }}>Data source:</Text>
      </View>
      <RadioButton.Group
        onValueChange={newDataSource => setDataSource(newDataSource)}
        value={dataSource}>
        {dataSourceInfo.map(el => <View style={{ flexDirection: "row", justifyContent: "space-between" }}><RadioButton.Item
          key={el.value}
          style={{ paddingHorizontal: 30, elevation: 0, flex: 1 }}
          position="leading"
          labelVariant="bodyMedium"
          label={el.name}
          value={el.value}
        />
          <IconButton icon="information" style={{ elevation: 10 }} /></View>
        )}
      </RadioButton.Group>
      <Portal>
        <Dialog visible={dataSourceDialogVisible} onDismiss={() => setDataSourceDialogVisible(false)}>

        </Dialog>
      </Portal>
      <View style={{ marginHorizontal: 24 }}>
        {dataSource ? (
          <>
            <TextInput
              style={{ marginTop: 16 }}
              mode="outlined"
              label="Number"
              value={voyNumber}
              onChangeText={text => setVoyNumber(text)}
            />
            <Button
              style={{ alignSelf: 'flex-start', marginTop: 8 }}
              icon="check"
              mode="contained"
              disabled={loading}
              loading={loading}
              onPress={handleAdd}>
              Finish
            </Button>
          </>
        ) : null}
      </View>
      <Snackbar
        visible={showErrorSnackbar}
        onDismiss={() => setShowErrorSnackbar(false)}>
        {errorSnackbarText}
      </Snackbar>
    </SafeAreaView>
  );
}
