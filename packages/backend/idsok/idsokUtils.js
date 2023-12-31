export const getAllConnections = async () => {
  const res = await fetch(
    "https://www.cestujok.cz/idspublicservices/api/service/position"
  );
  const data = await res.json();
  return data;
};
