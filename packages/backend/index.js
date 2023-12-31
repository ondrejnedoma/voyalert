import express from "express";
import { subscriptionDb, routeCachesOfSources } from "./databases.js";
import {
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  subscriptionExistsMiddleware,
  subscriptionNotExistsMiddleware,
} from "./middlewares.js";
const app = express();

app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.post(
  "/add",
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  subscriptionNotExistsMiddleware,
  async (req, res) => {
    subscriptionDb.data.subscriptions.push({
      ...req.body,
      config: { stops: [] },
      stopsAlertedToday: [],
    });
    subscriptionDb.write();
    res.json({ ok: true });
  }
);

app.post(
  "/delete",
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    let foundIndex = -1;
    subscriptionDb.data.subscriptions.some((subscription, index) => {
      if (
        subscription.token === req.body.token &&
        subscription.dataSource === req.body.dataSource &&
        subscription.voyNumber === req.body.voyNumber
      ) {
        foundIndex = index;
        return true;
      } else {
        return false;
      }
    });

    if (foundIndex < 0) {
      return res.json({ ok: false, error: "Voy not found" });
    }
    subscriptionDb.data.subscriptions.splice(foundIndex, 1);
    subscriptionDb.write();
    res.json({ ok: true });
  }
);

app.get("/list", (req, res) => {
  if (!req.query.token) {
    return res.json({
      ok: false,
      error: "No Firebase cloud messaging token provided",
    });
  }
  const subscriptionList = [];
  for (const subscription of subscriptionDb.data.subscriptions) {
    if (subscription.token === req.query.token) {
      subscriptionList.push(subscription);
    }
  }
  res.json({ ok: true, data: subscriptionList });
});

app.get(
  "/route",
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  (req, res) => {
    const stops = routeCachesOfSources[req.query.dataSource].data.routes.find(
      (route) => route.number === req.query.voyNumber
    ).stops;
    return res.json({ ok: true, data: stops });
  }
);

app.get(
  "/getConfig",
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  (req, res) => {
    const subscription = subscriptionDb.data.subscriptions.find(
      (subscription) =>
        subscription.token === req.query.token &&
        subscription.dataSource === req.query.dataSource &&
        subscription.voyNumber === req.query.voyNumber
    );
    return res.json({
      ok: true,
      data: subscription.config,
    });
  }
);

app.post(
  "/setConfigForStop",
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  (req, res) => {
    const subscription = subscriptionDb.data.subscriptions.find(
      (subscription) =>
        subscription.token === req.body.token &&
        subscription.dataSource === req.body.dataSource &&
        subscription.voyNumber === req.body.voyNumber
    );
    const subscriptionIndex =
      subscriptionDb.data.subscriptions.indexOf(subscription);
    const stop = subscriptionDb.data.subscriptions[
      subscriptionIndex
    ].config.stops.find((stop) => stop.name === req.body.stop);
    let stopIndex =
      subscriptionDb.data.subscriptions[subscriptionIndex].config.stops.indexOf(
        stop
      );
    if (stopIndex < 0) {
      const newStopToSet = {
        name: req.body.stop,
        notifyArrival: false,
        notifyDeparture: false,
        alarmArrival: false,
        alarmDeparture: false,
      };
      subscriptionDb.data.subscriptions[subscriptionIndex].config.stops.push(
        newStopToSet
      );
      stopIndex =
        subscriptionDb.data.subscriptions[
          subscriptionIndex
        ].config.stops.indexOf(newStopToSet);
    }
    subscriptionDb.data.subscriptions[subscriptionIndex].config.stops[
      stopIndex
    ][req.body.field] = req.body.value;
    subscriptionDb.write();
    return res.json({ ok: true });
  }
);

app.get("/privacypolicy", (req, res) => {
  res.sendFile("voyalertprivacypolicy.docx", { root: "." });
});

process.on("SIGINT", () => {
  console.log("Received SIGINT signal. Shutting down gracefully...");
  process.exit(0);
});

app.listen(3000);
