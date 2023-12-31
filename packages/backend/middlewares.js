import { subscriptionDb, routeCachesOfSources } from "./databases.js";

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
  if (!Object.keys(routeCachesOfSources).includes(reqData.dataSource)) {
    return res.json({
      ok: false,
      error: `Source ${reqData.dataSource} not accepted`,
    });
  }
  next();
};

export const isRouteCachedMiddleware = (req, res, next) => {
  const reqData = getReqData(req);
  if (
    !routeCachesOfSources[reqData.dataSource].data.routes.some(
      (route) => route.number === reqData.voyNumber
    )
  ) {
    return res.json({
      ok: false,
      error: `${reqData.voyNumber} does not seem to be a valid number (route not cached)`,
    });
  }
  next();
};

export const subscriptionExistsMiddleware = (req, res, next) => {
  const reqData = getReqData(req);
  if (
    !subscriptionDb.data.subscriptions.some(
      (subscription) =>
        subscription.token === reqData.token &&
        subscription.dataSource === reqData.dataSource &&
        subscription.voyNumber === reqData.voyNumber
    )
  ) {
    return res.json({ ok: false, error: "Voy not found" });
  }
  next();
};

export const subscriptionNotExistsMiddleware = (req, res, next) => {
  const reqData = getReqData(req);
  if (
    subscriptionDb.data.subscriptions.some(
      (subscription) =>
        subscription.token === reqData.token &&
        subscription.dataSource === reqData.dataSource &&
        subscription.voyNumber === reqData.voyNumber
    )
  ) {
    return res.json({
      ok: false,
      error: `Voy ${reqData.voyNumber} already added`,
    });
  }
  next();
};
