import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function apiURLProvider() {
  const valueCustomServerURL = await AsyncStorage.getItem(
    'settings.serverURL',
  );
  if (valueCustomServerURL !== null) {
    return valueCustomServerURL;
  } else {
    return 'https://voyalert.102.nedomovi.net'
  }
}
