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
import OneVoy from '../OneVoy';

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
      <View style={{marginHorizontal: 24}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <Text style={{marginTop: 32, marginBottom: 42}} variant="displaySmall">VoyAlert</Text>
        {listLoading ? (
          <ActivityIndicator style={{marginHorizontal: 16}} />
        ) : null}
      </View>
      {voyList.map(voy => (
        <OneVoy key={voy.dataSource + voy.voyNumber} dataSource={voy.dataSource} voyNumber={voy.voyNumber}/>
      ))}
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        size="medium"
        onPress={() => navigation.navigate('Add')}
      />
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
