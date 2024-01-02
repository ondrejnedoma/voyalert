import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { getAuth, getAllTrains } from "./szUtils.js";
import { isSameDay } from "date-fns";

import { SzCachedRoute } from "../db-models/cachedRoute.js";

const getOneTrain = async (token, sessionIdCookie, trainId) => {
  const res = await fetch(
    `https://grapp.spravazeleznic.cz/OneTrain/RouteInfo/${token}?trainId=${trainId}`,
    {
      headers: { cookie: sessionIdCookie },
    }
  );
  const html = await res.text();
  const $ = cheerio.load(html);
  if (
    $("body > div > div > div.modal-body > div")
      .text()
      .includes("nejsou dostupné")
  ) {
    return { ok: false };
  }
  if (
    $("body > div > div > div.routeHeader").text().includes("náhradní dopravou")
  ) {
    return { ok: false };
  }
  const stops = [];
  let i = 1;
  while (true) {
    let stopElement;
    if (i === 1) {
      stopElement = $("body > div > div > div.route > div > div:nth-child(1)");
    } else if (i === 2) {
      stopElement = $(
        "body > div > div > div.route > div > div:nth-child(5) > div:nth-child(4) > div:nth-child(1)"
      );
    } else {
      stopElement = $(
        "body > div > div > div.route > div > div:nth-child(5) > div:nth-child(4)" +
          " > div:nth-child(9)".repeat(i - 2) +
          " > div:nth-child(1)"
      );
    }
    const isLastStop = stopElement
      .parent()
      .children()
      .toArray()
      .some((el) => $(el).hasClass("routeFooter"));
    stops.push(stopElement.text().trim());
    if (isLastStop) {
      break;
    }
    i++;
  }
  const uniqueStops = stops.filter((item, index, array) => {
    // Check if the current index is the first occurrence of the item in the array
    return array.indexOf(item) === index;
  });
  return { ok: true, stops: uniqueStops };
};

const doSzCache = async () => {
  console.time("szTimer");
  const { token, sessionIdCookie } = await getAuth();
  const allTrains = await getAllTrains(token, sessionIdCookie);
  for (const train of allTrains) {
    const { name, id } = train;
    const cachedRoute = await SzCachedRoute.findOne({ name });
    if (!cachedRoute || !isSameDay(cachedRoute.checked, Date.now())) {
      const { ok, stops } = await getOneTrain(token, sessionIdCookie, id);
      if (ok) {
        await SzCachedRoute.updateOne(
          {
            name,
          },
          {
            $set: {
              stops: stops,
              checked: Date.now(),
            },
          },
          { upsert: true }
        );
        console.log(`Upserted SZ "${name}"`);
      }
    }
  }
  console.timeEnd("szTimer");
};

export default doSzCache;
