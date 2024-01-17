import apiURLProvider from './ApiURLProvider';

export default async function apiRoute({dataSource, voyName}) {
  const baseUrl = await apiURLProvider();
  try {
    const res = await fetch(
      baseUrl + `/route?dataSource=${dataSource}&voyName=${voyName}`,
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return {ok: false, error: e.toString()};
  }
}
