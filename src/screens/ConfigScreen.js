import {View, SafeAreaView} from 'react-native';
import {
  Text,
  TextInput,
  HelperText,
  IconButton,
  RadioButton,
  Snackbar,
  Button,
} from 'react-native-paper';
import RadioButtonWithLabel from '../RadioButtonWithLabel';
import SourceLogo from '../SourceLogo';
import apiDelete from '../scripts/ApiDelete';
import React from 'react';

export default function ConfigScreen({route, navigation}) {
  const {dataSource, voyNumber} = route.params;
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const handleDelete = () => {
    setLoading(true);
    apiDelete({dataSource, voyNumber}).then(data => {
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
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <IconButton
          icon="delete"
          size={24}
          onPress={handleDelete}
          disabled={loading}
        />
      </View>
      <View style={{marginHorizontal: 24}}>
        <View
          style={{marginTop: 32, flexDirection: 'row', alignItems: 'center'}}>
          <SourceLogo dataSource={dataSource} size={36} />
          <Text style={{marginHorizontal: 12}} variant="displaySmall">
            {voyNumber}
          </Text>
        </View>
        <Text style={{marginTop: 42}}>Stops to alert at:</Text>
        <Button
          style={{alignSelf: 'flex-start', marginTop: 8}}
          icon="timeline-alert"
          mode="outlined"
          onPress={() =>
            navigation.navigate('ConfigRoute', {dataSource, voyNumber})
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
