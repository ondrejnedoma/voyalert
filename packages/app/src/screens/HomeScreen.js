import React from 'react';
import {Linking, SafeAreaView, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  FAB,
  IconButton,
  Menu,
  Snackbar,
  Text,
} from 'react-native-paper';

import {useFocusEffect} from '@react-navigation/native';

import apiList from '../api/ApiList';
import HomeScreenMenu from '../components/HomeScreenMenu';
import OneVoy from '../components/OneVoy';
import ScreenTitle from '../components/ScreenTitle';
import AppBar from '../components/AppBar';

export default function HomeScreen({navigation}) {
  const [voyList, setVoyList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);
  const [errorSnackbarText, setErrorSnackbarText] = React.useState('');
  const [menuVisible, setMenuVisible] = React.useState(false);
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
  const handleItemPress = item => {
    setMenuVisible(false);
    switch (item) {
      case 'donate':
        navigation.navigate('Donate');
        break;
      case 'bug':
        Linking.openURL('https://github.com/ondrejnedoma/voyalert/issues/new');
        break;
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      handleList();
    }, []),
  );
  const appBarButtonsRight = [
    {
      icon: 'refresh',
      onPress: handleList,
      disabled: loading,
    },
  ];
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: 24}}>
        <AppBar buttonsRight={appBarButtonsRight}>
          <HomeScreenMenu
            visible={menuVisible}
            setVisible={setMenuVisible}
            handleItemPress={handleItemPress}
          />
        </AppBar>
        <ScreenTitle>VoyAlert</ScreenTitle>
      </View>
      {voyList.map(el => (
        <OneVoy
          key={el.dataSource + el.voyName}
          dataSource={el.dataSource}
          voyName={el.voyName}
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
