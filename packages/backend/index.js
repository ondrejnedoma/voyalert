import express from "express";
import { routeCaches } from "./databases.js";
import {
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
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
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  subscriptionNotExistsMiddleware,
  async (req, res) => {
    const { dataSource, voyNumber, token } = req.body;
    Subscription.create({
      dataSource,
      voyNumber,
      token,
    });
    res.json({ ok: true });
  }
);

app.post(
  "/delete",
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const { dataSource, voyNumber, token } = req.body;
    await Subscription.deleteOne({
      dataSource,
      voyNumber,
      token,
    });
    res.json({ ok: true });
  }
);

app.get("/list", async (req, res) => {
  if (!req.query.token) {
    return res.json({
      ok: false,
      error: "No Firebase cloud messaging token provided",
    });
  }
  const list = await Subscription.find({ token: req.query.token });
  res.json({ ok: true, data: list });
});

app.get(
  "/route",
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  async (req, res) => {
    const { dataSource, voyNumber } = req.query;
    const stops = (await routeCaches[dataSource].findOne({ name: voyNumber }))
      .stops;
    return res.json({ ok: true, data: stops });
  }
);

app.get(
  "/getConfig",
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const { dataSource, voyNumber, token } = req.query;
    const config = (
      await Subscription.findOne({
        dataSource,
        voyNumber,
        token,
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
  voyNumberOnlyNumbersMiddleware,
  isSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const { dataSource, voyNumber, token, stop, field, value } = req.body;
    const updateObject = {};
    updateObject[`config.stops.$.${field}`] = value;
    const subscription = await Subscription.findOne({
      dataSource,
      voyNumber,
      token,
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
