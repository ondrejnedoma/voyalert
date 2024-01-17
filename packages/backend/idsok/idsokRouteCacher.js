import fetch from "node-fetch";
import { getAllConnections } from "./idsokUtils.js";
import { isSameDay } from "date-fns";

import { IdsokCachedRoute } from "../db-models/cachedRoute.js";

const getOneConnection = async (id) => {
  const res = await fetch(
    "https://www.cestujok.cz/idspublicservices/api/servicedetail?id=" + id
  );
  const data = await res.json();
  const stops = data.stations.map((station) => station.name);
  const uniqueStops = stops.filter((item, index, array) => {
    // Check if the current index is the first occurrence of the item in the array
    return array.indexOf(item) === index;
  });
  return { ok: true, stops: uniqueStops };
};

const doIdsokCache = async () => {
  console.time("idsokTimer");
  const allConnections = await getAllConnections();
  for (const connection of allConnections) {
    const { id, name } = connection;
    const cachedRoute = await IdsokCachedRoute.findOne({ name });
    if (!cachedRoute || !isSameDay(cachedRoute.checked, Date.now())) {
      const { ok, stops } = await getOneConnection(id);
      if (ok) {
        await IdsokCachedRoute.updateOne(
          {
            name,
          },
          {
            $set: {
              stops,
              checked: Date.now(),
            },
          },
          { upsert: true }
        );
        console.log(`Upserted IDSOK "${name}"`);
      }
    }
  }
  console.timeEnd("idsokTimer");
};

export default doIdsokCache;
