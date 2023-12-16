import messaging from '@react-native-firebase/messaging';

import apiURLProvider from './ApiURLProvider';

export default async function apiRoute({dataSource, voyNumber}) {
  const baseUrl = apiURLProvider();
  const token = await messaging().getToken();
  try {
    const res = await fetch(
      baseUrl +
        `/getConfig?token=${token}&dataSource=${dataSource}&voyNumber=${voyNumber}`,
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return {ok: false, error: e.toString()};
  }
}
