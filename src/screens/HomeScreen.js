import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  FAB,
  Text,
  IconButton,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import apiList from '../scripts/ApiList';
import React from 'react';

export default function HomeScreen({navigation}) {
  const [voyList, setVoyList] = React.useState([]);
  const [listLoading, setListLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const handleList = () => {
    setListLoading(true);
    apiList().then(data => {
      setListLoading(false);
      if (data.ok) {
        setVoyList(data.data);
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    });
  };
  React.useEffect(() => {
    handleList();
  }, []);
  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <IconButton
          icon="refresh"
          size={24}
          onPress={handleList}
          disabled={listLoading}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 32,
          marginHorizontal: 24,
        }}>
        <Text variant="displaySmall">VoyAlert</Text>
        {listLoading ? (
          <ActivityIndicator style={{marginHorizontal: 16}} />
        ) : null}
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        size="medium"
        onPress={() => navigation.navigate('Add')}
      />
      {voyList.map(voy => (
        <Text key={voy.dataSource + voy.voyNumber}>{voy.voyNumber}</Text>
      ))}
      <Snackbar
        visible={showErrorSnackbar}
        onDismiss={() => setShowErrorSnackbar(false)}>
        {errorSnackbarText}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 32,
  },
});
