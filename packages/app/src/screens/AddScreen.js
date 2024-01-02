import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {
  Button,
  RadioButton,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import DataSourceDialog from '../DataSourceDialog';
import apiAdd from '../api/ApiAdd';
import ScreenTitle from '../components/ScreenTitle';

export default function AddScreen({navigation}) {
  const [dataSource, setDataSource] = React.useState('');
  const [voyName, setVoyName] = React.useState('');
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
        'Alerts will be around 2-3 minutes delayed',
      ],
      hint: 'Enter the train number without the train type - 11085',
      disabled: false,
    },
    {
      value: 'idsok',
      name: 'IDSOK (CestujOK)',
      use: 'This data source is applicable for all vehicles in the IDSOK system - cestujok.cz',
      pros: [
        'Based on real-time vehicle position - alerts should arrive on time',
      ],
      cons: ["Can't be set to alert about arrivals"],
      hint: 'Enter the connection name exactly as it appears on CestujOK, without letters - 890302 39, 14018',
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
    apiAdd({dataSource, voyName}).then(data => {
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
    const content = dataSourceInfo.find(el => el.value === dataSource);
    setDataSourceDialogContent(content);
    setDataSourceDialogVisible(true);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenTitle
        withLoading={true}
        loading={loading}>
        Add Voy
      </ScreenTitle>
      <View style={{marginHorizontal: 24}}>
        <Text
          style={{marginBottom: 4}}
          variant="titleMedium">
          Data source:
        </Text>
        <Text
          style={{marginBottom: 4}}
          variant="bodySmall">
          Long press on individual data sources for details. More data sources
          coming soon.
        </Text>
      </View>
      <RadioButton.Group
        onValueChange={newDataSource => setDataSource(newDataSource)}
        value={dataSource}>
        {dataSourceInfo.map(el => (
          <RadioButton.Item
            key={el.value}
            style={{paddingHorizontal: 24}}
            position="leading"
            labelVariant="bodyLarge"
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
        <TextInput
          style={{marginVertical: 16}}
          mode="outlined"
          disabled={loading || !dataSource}
          label="Name/number/line"
          value={voyName}
          onChangeText={text => setVoyName(text)}
        />
        <Text
          style={{marginBottom: 16}}
          variant="bodySmall">
          After adding the voy, press it from the home screen to configure it.
        </Text>
        <Button
          style={{alignSelf: 'flex-end'}}
          icon="check"
          mode="contained"
          disabled={loading || !dataSource}
          onPress={handleAdd}>
          Finish
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
