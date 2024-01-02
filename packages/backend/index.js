import express from "express";
import { routeCaches } from "./databases.js";
import {
  requireFieldsMiddleware,
  voyNameOnlyNumbersMiddleware,
  isDataSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  subscriptionExistsMiddleware,
  subscriptionNotExistsMiddleware,
} from "./middlewares.js";

import Subscription from "./db-models/subscription.js";

const app = express();

app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.post(
  "/add",
  requireFieldsMiddleware(["dataSource", "voyName", "firebaseToken"]),
  voyNameOnlyNumbersMiddleware,
  isDataSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  subscriptionNotExistsMiddleware,
  async (req, res) => {
    const { dataSource, voyName, firebaseToken } = req.body;
    Subscription.create({
      dataSource,
      voyName,
      firebaseToken,
    });
    res.json({ ok: true });
  }
);

app.post(
  "/delete",
  requireFieldsMiddleware(["dataSource", "voyName", "firebaseToken"]),
  voyNameOnlyNumbersMiddleware,
  isDataSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const { dataSource, voyName, firebaseToken } = req.body;
    await Subscription.deleteOne({
      dataSource,
      voyName,
      firebaseToken,
    });
    res.json({ ok: true });
  }
);

app.get(
  "/list",
  requireFieldsMiddleware(["firebaseToken"]),
  async (req, res) => {
    const { firebaseToken } = req.query;
    const list = await Subscription.find({ firebaseToken });
    res.json({ ok: true, data: list });
  }
);

app.get(
  "/route",
  requireFieldsMiddleware(["dataSource", "voyName"]),
  voyNameOnlyNumbersMiddleware,
  isDataSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  async (req, res) => {
    const { dataSource, voyName } = req.query;
    const stops = (await routeCaches[dataSource].findOne({ name: voyName }))
      .stops;
    return res.json({ ok: true, data: stops });
  }
);

app.get(
  "/getConfig",
  requireFieldsMiddleware(["dataSource", "voyName", "firebaseToken"]),
  voyNameOnlyNumbersMiddleware,
  isDataSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const { dataSource, voyName, firebaseToken } = req.query;
    const config = (
      await Subscription.findOne({
        dataSource,
        voyName,
        firebaseToken,
      })
    ).config;
    return res.json({
      ok: true,
      data: config,
    });
  }
);

app.post(
  "/setConfigForStop",
  requireFieldsMiddleware([
    "dataSource",
    "voyName",
    "firebaseToken",
    "stop",
    "field",
    "value",
  ]),
  voyNameOnlyNumbersMiddleware,
  isDataSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const { dataSource, voyName, firebaseToken, stop, field, value } = req.body;
    const subscription = await Subscription.findOne({
      dataSource,
      voyName,
      firebaseToken,
    });
    const stopIndex = subscription.config.stops.findIndex(
      (oneStop) => oneStop.name === stop
    );
    if (stopIndex < 0) {
      let newStop = {
        name: stop,
        notifyArrival: false,
        notifyDeparture: false,
        alarmArrival: false,
        alarmDeparture: false,
        arrivalAlreadyAlerted: false,
        departureAlreadyAlerted: false,
      };
      newStop[field] = value;
      subscription.config.stops.push(newStop);
    } else {
      subscription.config.stops[stopIndex][field] = value;
    }
    subscription.save();
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
