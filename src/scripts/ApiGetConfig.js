import apiURLProvider from './ApiURLProvider';
import messaging from '@react-native-firebase/messaging';

export default async function apiRoute({dataSource, voyNumber, field}) {
  const baseUrl = apiURLProvider();
  const token = await messaging().getToken();
  try {
    const res = await fetch(
      baseUrl +
        `/getConfig?token=${token}&dataSource=${dataSource}&voyNumber=${voyNumber}&field=${field}`,
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return {ok: false, error: e.toString()};
  }
}
