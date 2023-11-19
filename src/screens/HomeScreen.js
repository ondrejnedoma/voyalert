import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  FAB,
  Text,
  IconButton,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import apiList from '../scripts/ApiList';
import React from 'react';
import OneVoy from '../OneVoy';

export default function HomeScreen({route, navigation}) {
  const [voyList, setVoyList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const handleList = () => {
    setLoading(true);
    apiList().then(data => {
      setLoading(false);
      if (data.ok) {
        setVoyList(data.data);
      } else {
        setErrorSnackbarText(data.error);
        setShowErrorSnackbar(true);
      }
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      handleList();
    }, []),
  );
  const handleOneVoyClick = ({dataSource, voyNumber}) => {
    navigation.navigate('Config', {dataSource, voyNumber});
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <IconButton
          icon="refresh"
          size={24}
          onPress={handleList}
          disabled={loading}
        />
      </View>
      <View
        style={{
          marginTop: 32,
          marginBottom: 42,
          marginHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text variant="displaySmall">VoyAlert</Text>
        {loading ? <ActivityIndicator style={{marginHorizontal: 16}} /> : null}
      </View>
      {voyList.map(voy => (
        <OneVoy
          key={voy.dataSource + voy.voyNumber}
          dataSource={voy.dataSource}
          voyNumber={voy.voyNumber}
          onPress={handleOneVoyClick}
        />
      ))}
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
