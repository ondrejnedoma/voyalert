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
  const [addLoading, setAddLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const helperTexts = {
    sz: 'Enter only the train number. Examples: 3713, 511, 14011',
  };
  const handleAdd = () => {
    setAddLoading(true);
    apiAdd({dataSource, voyNumber}).then(data => {
      setAddLoading(false);
      if (data.ok) {
        navigation.goBack();
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    });
  };
  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View style={{marginHorizontal: 24}}>
        <Text style={{marginTop: 32}} variant="displaySmall">
          Add Voy...
        </Text>
        <Text style={{marginTop: 42}}>Data source:</Text>
        <RadioButton.Group
          onValueChange={newDataSource => setDataSource(newDataSource)}
          value={dataSource}>
          <RadioButtonWithLabel label="Správa Železnic (GRAPP)" value="sz" />
        </RadioButton.Group>
        {dataSource ? (
          <>
            <TextInput
              style={{marginTop: 16}}
              mode="outlined"
              label="Number"
              value={voyNumber}
              onChangeText={text => setVoyNumber(text)}
            />
            <HelperText>{helperTexts[dataSource]}</HelperText>
            <Button
              style={{alignSelf: 'flex-start', marginTop: 8}}
              icon="check"
              mode="contained"
              disabled={!isConnected}
              loading={addLoading}
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
