import messaging from '@react-native-firebase/messaging';

import apiURLProvider from './ApiURLProvider';

export default async function apiSetConfigForStop({
  dataSource,
  voyNumber,
  stop,
  field,
  value,
}) {
  const baseUrl = await apiURLProvider();
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
