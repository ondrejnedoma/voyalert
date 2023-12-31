export default async function apiPing({url}) {
  try {
    const res = await fetch(url + '/ping');
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return {ok: false, error: e.toString()};
  }
}
