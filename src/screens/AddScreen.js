import {View, SafeAreaView} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  RadioButton,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import RadioButtonWithLabel from '../RadioButtonWithLabel';
import {useNetInfo} from '@react-native-community/netinfo';
import apiAdd from '../scripts/ApiAdd';
import React from 'react';

export default function AddScreen({navigation}) {
  const {type, isConnected} = useNetInfo();
  const [dataSource, setDataSource] = React.useState('');
  const [voyNumber, setVoyNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const numberHelperTexts = {
    sz: 'Enter only the train number. Example: 14011.',
  };
  const handleAdd = () => {
    setLoading(true);
    apiAdd({dataSource, voyNumber}).then(data => {
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
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: 24}}>
        <Text style={{marginTop: 84}} variant="displaySmall">
          Add Voy...
        </Text>
        <Text style={{marginTop: 42, marginBottom: 8}}>Data source:</Text>
      </View>
      <RadioButton.Group
        onValueChange={newDataSource => setDataSource(newDataSource)}
        value={dataSource}>
        <RadioButton.Item
          style={{paddingHorizontal: 30}}
          position="leading"
          labelVariant="bodyMedium"
          label="Správa Železnic (GRAPP)"
          value="sz"
        />
      </RadioButton.Group>
      <View style={{marginHorizontal: 24}}>
        {dataSource ? (
          <>
            <TextInput
              style={{marginTop: 16}}
              mode="outlined"
              label="Number"
              value={voyNumber}
              onChangeText={text => setVoyNumber(text)}
            />
            <HelperText>{numberHelperTexts[dataSource]}</HelperText>
            <Button
              style={{alignSelf: 'flex-start', marginTop: 8}}
              icon="check"
              mode="contained"
              disabled={!isConnected || loading}
              loading={loading}
              onPress={handleAdd}>
              Finish
            </Button>
            {!isConnected ? (
              <HelperText>Not connected to internet</HelperText>
            ) : null}
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
