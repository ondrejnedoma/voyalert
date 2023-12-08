import {View, SafeAreaView, TouchableWithoutFeedback} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  RadioButton,
  Dialog,
  Portal,
  Snackbar,
  Icon,
  useTheme,
} from 'react-native-paper';
import apiAdd from '../scripts/ApiAdd';
import React from 'react';
import DataSourceDialog from '../DataSourceDialog';

export default function AddScreen({navigation}) {
  const theme = useTheme();
  const [dataSource, setDataSource] = React.useState('');
  const [voyNumber, setVoyNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const dataSourceInfo = [
    {
      value: 'sz',
      name: 'Správa Železnic (GRAPP)',
      use: 'This data source is applicable for all passenger trains on the Czech soil - grapp.spravazeleznic.cz',
      pros: ['Works with every carrier (ČD, RJ, LE, Arriva...)'],
      cons: [
        'Alerts only at railway stations with dispatchers',
        'Alerts can be around 2 minutes delayed',
      ],
      disabled: false,
    },
    {
      value: 'cd',
      name: 'České Dráhy (soon)',
      use: 'This data source is applicable for all ČD trains - cd.cz',
      pros: ['Alerts at every stop'],
      cons: ['Only works with ČD trains'],
      disabled: true,
    },
    {
      value: 'idsok',
      name: 'IDSOK (CestujOK)',
      use: 'This data source is applicable for all vehicles in the IDSOK system',
      pros: ["Data based on real-time vehicle position - precise data"],
      cons: ["Can't be set to alert about the arrival to the final stop"],
      disabled: false,
    },
  ];
  const [dataSourceDialogVisible, setDataSourceDialogVisible] =
    React.useState(false);
  const [dataSourceDialogContent, setDataSourceDialogContent] = React.useState({
    value: '',
    name: '',
    use: '',
    pros: [],
    cons: [],
  });
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
  const handleLongPressDataSource = dataSource => {
    const content = dataSourceInfo.find(el => (el.value = dataSource));
    setDataSourceDialogContent(content);
    setDataSourceDialogVisible(true);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: 24}}>
        <Text style={{marginTop: 84}} variant="displaySmall">
          Add Voy...
        </Text>
        <Text style={{marginTop: 42, marginBottom: 4}} variant="titleMedium">
          Data source:
        </Text>
        <Text style={{marginBottom: 8}} variant="bodySmall">
          Long press on data sources for details
        </Text>
      </View>
      <RadioButton.Group
        onValueChange={newDataSource => setDataSource(newDataSource)}
        value={dataSource}>
        {dataSourceInfo.map(el => (
          <RadioButton.Item
            key={el.value}
            style={{paddingHorizontal: 30}}
            position="leading"
            labelVariant="bodyMedium"
            label={el.name}
            value={el.value}
            disabled={el.disabled}
            onLongPress={() => handleLongPressDataSource(el.value)}
          />
        ))}
      </RadioButton.Group>
      <DataSourceDialog
        visible={dataSourceDialogVisible}
        setVisible={setDataSourceDialogVisible}
        content={dataSourceDialogContent}
      />
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
            <Button
              style={{alignSelf: 'flex-start', marginTop: 8}}
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
