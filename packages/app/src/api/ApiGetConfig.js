import messaging from '@react-native-firebase/messaging';

import apiURLProvider from './ApiURLProvider';

export default async function apiRoute({dataSource, voyName}) {
  const baseUrl = await apiURLProvider();
  const firebaseToken = await messaging().getToken();
  try {
    const res = await fetch(
      baseUrl +
        `/getConfig?firebaseToken=${firebaseToken}&dataSource=${dataSource}&voyName=${voyName}`,
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return {ok: false, error: e.toString()};
  }
}
