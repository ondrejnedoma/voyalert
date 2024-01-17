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
import {useTranslation} from 'react-i18next';

export default function AddScreen({navigation}) {
  const {t} = useTranslation();
  const [dataSource, setDataSource] = React.useState('');
  const [voyName, setVoyName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const dataSourceList = t('add.dataSourceList', {returnObjects: true});
  const dataSourceValues = Object.keys(dataSourceList);
  const dataSourceInfo = Object.values(dataSourceList);
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
          {t('add.dataSource')}
        </Text>
        <Text
          style={{marginBottom: 4}}
          variant="bodySmall">
          {t('add.dataSourceHint')}
        </Text>
      </View>
      <RadioButton.Group
        onValueChange={newDataSource => setDataSource(newDataSource)}
        value={dataSource}>
        {dataSourceInfo.map((el, i) => (
          <RadioButton.Item
            key={dataSourceValues[i]}
            style={{paddingHorizontal: 24}}
            position="leading"
            labelVariant="bodyLarge"
            label={el.name}
            value={dataSourceValues[i]}
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
          label={t('add.namePlaceholder')}
          value={voyName}
          onChangeText={text => setVoyName(text)}
        />
        <Text
          style={{marginBottom: 16}}
          variant="bodySmall">
          {t('add.voyConfigHint')}
        </Text>
        <Button
          style={{alignSelf: 'flex-end'}}
          icon="check"
          mode="contained"
          disabled={loading || !dataSource}
          onPress={handleAdd}>
          {t('add.addButton')}
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
