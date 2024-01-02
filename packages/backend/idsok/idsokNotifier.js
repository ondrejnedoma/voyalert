import fetch from "node-fetch";
import firebaseNotify from "../notify.js";
import { getAllConnections } from "./idsokUtils.js";
import { parse, addMinutes, format } from "date-fns";

import Subscription from "../db-models/subscription.js";

const alertOneConnection = async ({
  connectionId,
  stops,
  firebaseToken,
  voyName,
}) => {
  const res = await fetch(
    "https://www.cestujok.cz/idspublicservices/api/servicedetail?id=" +
      connectionId
  );
  const data = await res.json();
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
        if (stop.notifyDeparture && !stop.departureAlreadyAlerted) {
          idsokNotify("departure", newTime);
        }
      }
    }
    async function idsokNotify(type, time) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      firebaseNotify(firebaseToken, {
        dataSource: "idsok",
        voyName,
        type,
        time,
        stop: stop.name,
        notificationType: stop["alarm" + capitalizedType]
          ? "alarm"
          : "notification",
      });
      const subscription = await Subscription.findOne({
        dataSource: "idsok",
        voyName,
        firebaseToken,
      });
      const stopIndex = subscription.config.stops.findIndex(
        (oneStop) => oneStop.name === stop.name
      );
      subscription.config.stops[stopIndex][type + "AlreadyAlerted"] = true;
      await subscription.save();
    }
  }
};

const doIdsokNotifier = async () => {
  const allConnections = await getAllConnections();
  const allSubscriptions = await Subscription.find({
    dataSource: "idsok",
    "config.stops": { $ne: [] },
  });
  for (const subscription of allSubscriptions) {
    const { voyName, firebaseToken, config } = subscription;
    // Find the id from allConnections based on the subscription's voyName
    const connectionId = allConnections.find(
      (connection) => connection.name === voyName
    ).id;
    // Filter stops into stopsToCheck based on if arrivalAlreadyAlerted or departureAlreadyAlerted are false
    const stopsToCheck = config.stops.filter(
      (stop) => !stop.arrivalAlreadyAlerted || !stop.departureAlreadyAlerted
    );
    // If the connectionId is not found, meaning it's not available on CestukOK and at least some stop has been alerted about, assume it has finished its journey
    if (!connectionId) {
      if (
        config.stops.some(
          (stop) => stop.arrivalAlreadyAlerted || stop.departureAlreadyAlerted
        )
      ) {
        console.log(`Reset alerted stops for subscription idsok ${voyName}`);
        await Subscription.updateOne(
          { dataSource: "idsok", voyName, firebaseToken },
          {
            $set: {
              "config.stops.$[].arrivalAlreadyAlerted": false,
              "config.stops.$[].departureAlreadyAlerted": false,
            },
          }
        );
      }
      continue;
    }
    await alertOneConnection({
      connectionId,
      stops: stopsToCheck,
      firebaseToken,
      voyName,
    });
  }
};

export default doIdsokNotifier;
