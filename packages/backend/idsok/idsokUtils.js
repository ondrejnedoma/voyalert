export const getAllConnections = async () => {
  const res = await fetch(
    "https://www.cestujok.cz/idspublicservices/api/service/position"
  );
  const data = await res.json();
  const allConnections = data.map((connection) => ({
    id: connection.id,
    name: connection.name.replace(/[^0-9\s]/g, "").trim(),
  }));
  return allConnections;
};
