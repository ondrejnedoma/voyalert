import fetch from "node-fetch";
import firebaseNotify from "../notify.js";
import { getAllConnections } from "./idsokUtils.js";
import { parse, addMinutes, format } from "date-fns";

const alertOneConnection = async (id, stops, firebaseToken, voyNumber) => {
  const res = await fetch(
    "https://www.cestujok.cz/idspublicservices/api/servicedetail?id=" + id
  );
  const data = await res.data();
  for (const stop of stops) {
    let stopObject;
    data.stations.some((station) => {
      if (station.name === stop.name) {
        stopObject = station;
        return true;
      }
      return false;
    });
    if (stopObject.passed) {
      if (stopObject.departureTime) {
        const parsedTime = parse(stopObject.departureTime, "H:mm", new Date());
        const delayedTime = addMinutes(parsedTime, stopObject.delay || 0);
        const newTime = format(delayedTime, "HH:mm");
        if (stop.notifyDeparture) {
          firebaseNotify(firebaseToken, {
            dataSource: "idsok",
            voyNumber,
            type: "departure",
            time: newTime,
            stop: stop.name,
            notificationType: stop.alarmDeparture ? "alarm" : "notification",
          });
        }
      }
    }
  }
};

const doIdsokNotifier = async (subscriptionDb) => {
  const allConnections = await getAllConnections();
  for (const [
    index,
    subscription,
  ] of subscriptionDb.data.subscriptions.entries()) {
    let connectionId;
    if (subscription.dataSource !== "idsok") continue;
    allConnections.some((connection) => {
      if (connection.name === subscription.voyNumber) {
        connectionId = connection.id;
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
    if (!connectionId) {
      if (subscription.stopsAlertedToday.length > 0) {
        console.log("Wipe subscription " + subscription.voyNumber);
        subscriptionDb.data.subscriptions[index].stopsAlertedToday = [];
        subscriptionDb.write();
      }
      continue;
    }
    const data = await alertOneConnection(
      connectionId,
      stopsToCheck,
      subscription.token
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

export default doIdsokNotifier;
