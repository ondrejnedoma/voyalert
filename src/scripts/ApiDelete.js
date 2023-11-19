import apiURLProvider from './ApiURLProvider';
import messaging from '@react-native-firebase/messaging';

export default async function apiDelete({dataSource, voyNumber}) {
  const baseUrl = apiURLProvider();
  const token = await messaging().getToken();
  try {
    const res = await fetch(baseUrl + '/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token, dataSource, voyNumber}),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return {ok: false, error: e.toString()};
  }
}
