import apiURLProvider from './ApiURLProvider';

export default async function apiRoute({dataSource, voyNumber}) {
  const baseUrl = apiURLProvider();
  try {
    const res = await fetch(
      baseUrl + `/route?dataSource=${dataSource}&voyNumber=${voyNumber}`,
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return {ok: false, error: e.toString()};
  }
}
