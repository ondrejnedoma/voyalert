import { routeCaches } from "./databases.js";

import Subscription from "./db-models/subscription.js";

const getReqData = (req) => {
  if (req.method === "GET") {
    return req.query;
  } else if (req.method === "POST") {
    return req.body;
  }
};

export const voyNumberOnlyNumbersMiddleware = (req, res, next) => {
  const reqData = getReqData(req);
  if (!/^ *\d+ *( \d+)* *$/.test(reqData.voyNumber)) {
    return res.json({ ok: false, error: "Only numbers allowed" });
  }
  next();
};

export const isSourceAcceptedMiddleware = (req, res, next) => {
  const reqData = getReqData(req);
  if (!Object.keys(routeCaches).includes(reqData.dataSource)) {
    return res.json({
      ok: false,
      error: `Source ${reqData.dataSource} not accepted`,
    });
  }
  next();
};

export const isRouteCachedMiddleware = (req, res, next) => {
  const { dataSource, voyNumber } = getReqData(req);
  const route = routeCaches[dataSource].findOne({
    name: voyNumber,
  });
  if (!route) {
    return res.json({
      ok: false,
      error: `${voyNumber} does not seem to be a valid number (route not cached)`,
    });
  }
  next();
};

export const subscriptionExistsMiddleware = async (req, res, next) => {
  const { dataSource, voyNumber, token } = getReqData(req);
  const subscription = await Subscription.findOne({
    dataSource,
    voyNumber,
    token,
  });
  if (!subscription) {
    return res.json({
      ok: false,
      error: `Voy ${dataSource} ${voyNumber} for Firebase token ${token} not found`,
    });
  }
  next();
};

export const subscriptionNotExistsMiddleware = async (req, res, next) => {
  const { dataSource, voyNumber, token } = getReqData(req);
  const subscription = await Subscription.findOne({
    dataSource,
    voyNumber,
    token,
  });
  if (subscription) {
    return res.json({
      ok: false,
      error: `Voy ${dataSource} ${voyNumber} already exists for Firebase token ${token}`,
    });
  }
  next();
};
