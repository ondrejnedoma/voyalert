import apiURLProvider from './ApiURLProvider';
import messaging from '@react-native-firebase/messaging';

export default async function apiSetConfigForStop({
  dataSource,
  voyNumber,
  stop,
  field,
  value,
}) {
  const baseUrl = apiURLProvider();
  const token = await messaging().getToken();
  try {
    const res = await fetch(baseUrl + '/setConfigForStop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token, dataSource, voyNumber, stop, field, value}),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return {ok: false, error: e.toString()};
  }
}