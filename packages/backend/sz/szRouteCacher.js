import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { getAuth, getAllTrains } from "./szUtils.js";
import { isSameDay } from "date-fns";

const getOneTrain = async (token, sessionIdCookie, id) => {
  const res = await fetch(
    `https://grapp.spravazeleznic.cz/OneTrain/RouteInfo/${token}?trainId=${id}`,
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
        process.exit();
      }
    }
    i++;
  }
  const uniqueStops = stops.filter((item, index, array) => {
    // Check if the current index is the first occurrence of the item in the array
    return array.indexOf(item) === index;
  });
  return { ok: true, stops: uniqueStops, number };
};

const doSzCache = async (szCacheDb) => {
  console.time("szTimer");
  const { token, sessionIdCookie } = await getAuth();
  const allTrains = await getAllTrains(token, sessionIdCookie);
  const filteredTrains = allTrains.Trains.map((train) => {
    return { number: train.Title.replace(/\D/g, ""), id: train.Id };
  });
  const trainNumbers = filteredTrains.map((train) => train.number);
  const existingNums = szCacheDb.data.routes.map((route) => route.number);
  for (const [index, number] of trainNumbers.entries()) {
    const routeDbIndex = existingNums.indexOf(number);
    if (
      routeDbIndex < 0 ||
      !isSameDay(szCacheDb.data.routes[routeDbIndex].checked, Date.now())
    ) {
      const route = await getOneTrain(
        token,
        sessionIdCookie,
        filteredTrains[index].id
      );
      if (route.ok) {
        if (routeDbIndex > -1) {
          szCacheDb.data.routes.splice(routeDbIndex, 1);
        }
        szCacheDb.data.routes.push({
          number: route.number,
          stops: route.stops,
          checked: Date.now(),
        });
        console.log("Added SZ " + route.number);
      }
    }
  }
  try {
    await szCacheDb.write();
  } catch (e) {
    console.log("Error writing SZ DB: " + e);
  }
  console.log("Written SZ into DB");
  console.timeEnd("szTimer");
};

export default doSzCache;
