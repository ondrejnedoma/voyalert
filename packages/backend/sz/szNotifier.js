import fetch from "node-fetch";
import * as cheerio from "cheerio";
import firebaseNotify from "../notify.js";
import { getAuth, getAllTrains } from "./szUtils.js";

const alertOneTrain = async (
  token,
  sessionIdCookie,
  id,
  stops,
  firebaseToken,
  voyNumber
) => {
  const res = await fetch(
    `https://grapp.spravazeleznic.cz/OneTrain/RouteInfo/${token}?trainId=${id}`,
    {
      headers: {
        cookie: sessionIdCookie,
      },
    }
  );
  const html = await res.text();
  const $ = cheerio.load(html);
  if ($("div.alert").text().includes("nejsou dostupné")) {
    return { ok: false };
  }
  const alertedStops = [];
  for (const stop of stops) {
    const stationElement = $("div.row > div.col-lg-4")
      .filter(function () {
        return $(this).text().trim() === stop.name;
      })
      .first();
    const stationParent = stationElement.parent();
    const allRows = $('div.row[style="align-items: center;display: flex;"]');
    // Check if the station is the first one to get around the shitty structure of the GRAPP HTML fragment
    if (allRows.index(stationParent) === 0) {
      const departureElement = stationParent
        .find("div:nth-child(5) > div:nth-child(3) > div:nth-child(1) > span")
        .first();
      if (departureElement.text()) {
        if (!departureElement.attr("class").includes("Future")) {
          if (stop.notifyDeparture) {
            firebaseNotify(firebaseToken, {
              dataSource: "sz",
              voyNumber,
              type: "departure",
              time: departureElement.text().trim(),
              stop: stop.name,
              notificationType: stop.alarmDeparture ? "alarm" : "notification",
            });
            alertedStops.push(stop.name);
          }
        }
      }
      continue;
    }
    const departureElement = stationParent
      .find("div:nth-child(8) > div:nth-child(1) > span")
      .first();
    const arrivalElement = stationParent
      .find("div:nth-child(5) > span")
      .first();
    if (departureElement.text()) {
      if (!departureElement.attr("class").includes("Future")) {
        if (stop.notifyDeparture) {
          firebaseNotify(firebaseToken, {
            dataSource: "sz",
            voyNumber,
            type: "departure",
            time: departureElement.text().trim(),
            stop: stop.name,
            notificationType: stop.alarmDeparture ? "alarm" : "notification",
          });
          alertedStops.push(stop.name);
        }
      }
    }
    if (arrivalElement.text()) {
      if (!arrivalElement.attr("class").includes("Future")) {
        if (stop.notifyArrival) {
          firebaseNotify(firebaseToken, {
            dataSource: "sz",
            voyNumber,
            type: "arrival",
            time: arrivalElement.text().trim(),
            stop: stop.name,
            notificationType: stop.alarmArrival ? "alarm" : "notification",
          });
          alertedStops.push(stop.name);
        }
      }
    }
  }
  return { ok: true, alertedStops: alertedStops };
};

const doSzNotifier = async (subscriptionDb) => {
  const { token, sessionIdCookie } = await getAuth();
  const allTrains = await getAllTrains(token, sessionIdCookie);
  for (const [
    index,
    subscription,
  ] of subscriptionDb.data.subscriptions.entries()) {
    if (subscription.dataSource !== "sz") continue;
    let trainId;
    allTrains.Trains.some((train) => {
      if (train.Title.replace(/\D/g, "") === subscription.voyNumber) {
        trainId = train.Id;
        return true;
      }
      return false;
    });
    let stopsToCheck;
    if (subscription.config.stops) {
      stopsToCheck = subscription.config.stops.filter(
        (stop) => !subscription.stopsAlertedToday.includes(stop.name)
      );
    } else {
      continue;
    }
    if (!trainId) {
      if (subscription.stopsAlertedToday.length > 0) {
        console.log("Wipe subscription " + subscription.voyNumber);
        subscriptionDb.data.subscriptions[index].stopsAlertedToday = [];
        subscriptionDb.write();
      }
      continue;
    }
    const data = await alertOneTrain(
      token,
      sessionIdCookie,
      trainId,
      stopsToCheck,
      subscription.token,
      subscription.voyNumber
    );
    if (data.ok) {
      if (data.alertedStops && data.alertedStops.length > 0) {
        for (const alertedStop of data.alertedStops) {
          subscriptionDb.data.subscriptions[index].stopsAlertedToday.push(
            alertedStop
          );
        }
        subscriptionDb.write();
      }
    }
  }
};

export default doSzNotifier;
