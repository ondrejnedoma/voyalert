import fetch from "node-fetch";
import { getAllConnections } from "./idsokUtils.js";
import { isSameDay } from "date-fns";

const getOneConnection = async (id) => {
  const res = await fetch(
    "https://www.cestujok.cz/idspublicservices/api/servicedetail?id=" + id
  );
  const data = await res.json();
  const stops = data.stations.map((station) => station.name);
  return { ok: true, stops };
};

const doIdsokCache = async (idsokCacheDb) => {
  console.time("idsokTimer");
  const allConnections = await getAllConnections();
  const existingNums = idsokCacheDb.data.routes.map((route) => route.number);
  for (const connection of allConnections) {
    const routeDbIndex = existingNums.indexOf(connection.name);
    if (
      routeDbIndex < 0 ||
      !isSameDay(idsokCacheDb.data.routes[routeDbIndex].checked, Date.now())
    ) {
      const route = await getOneConnection(connection.id);
      if (route.ok) {
        if (routeDbIndex > -1) {
          idsokCacheDb.data.routes.splice(routeDbIndex, 1);
        }
        const noLetterNumber = connection.name.replace(/[^0-9\s]/g, "").trim();
        idsokCacheDb.data.routes.push({
          id: connection.id,
          number: noLetterNumber,
          stops: route.stops,
          checked: Date.now(),
        });
        console.log("Added IDSOK " + noLetterNumber);
      }
    }
  }
  await idsokCacheDb.write();
  console.log("Written IDSOK into DB");
  console.timeEnd("idsokTimer");
};

export default doIdsokCache;
