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
  const number = $(
    "body > div > div > div.routeHeader > div.row.hname.bold > div"
  )
    .text()
    .trim()
    .replace(/\D/g, "");
  const stops = [];
  let i = 1;
  while (true) {
    if (i === 1) {
      stops.push(
        $("body > div > div > div.route > div > div:nth-child(1)").text().trim()
      );
    } else if (i === 2) {
      stops.push(
        $(
          "body > div > div > div.route > div > div:nth-child(5) > div:nth-child(4) > div:nth-child(1)"
        )
          .text()
          .trim()
      );
    } else {
      const stop = $(
        "body > div > div > div.route > div > div:nth-child(5) > div:nth-child(4)" +
          " > div:nth-child(9)".repeat(i - 2) +
          " > div:nth-child(1)"
      )
        .text()
        .trim();
      if (stop === "Informace o vlaku") {
        break;
      } else {
        stops.push(stop);
      }
      if (stop === "") {
        console.warn("TRAIN " + number + " HAS AN EMPTY STOP!!!");
      }
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
  const filteredTrains = allTrains.Trains.map((train) => {
    return { name: train.Title.replace(/\D/g, ""), id: train.Id };
  });
  for (const train of filteredTrains) {
    const { name, id } = train;
    const cachedRoute = await SzCachedRoute.findOne({ name });
    if (!cachedRoute || !isSameDay(cachedRoute.checked, Date.now())) {
      const route = await getOneTrain(token, sessionIdCookie, id);
      if (route.ok) {
        await SzCachedRoute.updateOne(
          {
            name,
          },
          {
            $set: {
              stops: route.stops,
              checked: Date.now(),
            },
          },
          { upsert: true }
        );
        console.log("Upserted SZ " + name);
      }
    }
  }
  console.timeEnd("szTimer");
};

export default doSzCache;
