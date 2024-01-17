import { routeCaches } from "./databases.js";

import Subscription from "./db-models/subscription.js";

const getReqData = (req) => {
  if (req.method === "GET") {
    return req.query;
  } else if (req.method === "POST") {
    return req.body;
  }
};

export const requireFieldsMiddleware = (fields) => {
  return (req, res, next) => {
    const reqData = getReqData(req);
    const missingFields = fields.filter(
      (field) => !Object.keys(reqData).includes(field)
    );
    if (missingFields.length > 0) {
      return res.json({
        ok: false,
        error: req.t("backendErrors.missingFields", {
          missingFields,
          count: missingFields.length,
        }),
      });
    }
    next();
  };
};

export const isDataSourceAcceptedMiddleware = (req, res, next) => {
  const { dataSource } = getReqData(req);
  const acceptedDataSources = Object.keys(routeCaches);
  if (!acceptedDataSources.includes(dataSource)) {
    return res.json({
      ok: false,
      error: req.t("backendErrors.dataSourceNotAccepted", {
        dataSource,
        acceptedDataSources: acceptedDataSources,
      }),
    });
  }
  next();
};

export const isRouteCachedMiddleware = async (req, res, next) => {
  const { dataSource, voyName } = getReqData(req);
  const route = await routeCaches[dataSource].findOne({
    name: voyName,
  });
  if (!route) {
    return res.json({
      ok: false,
      error: req.t("backendErrors.routeNotCached", {
        dataSource,
        voyName,
      }),
    });
  }
  next();
};

export const subscriptionExistsMiddleware = async (req, res, next) => {
  const { dataSource, voyName, firebaseToken } = getReqData(req);
  const subscription = await Subscription.findOne({
    dataSource,
    voyName,
    firebaseToken,
  });
  if (!subscription) {
    return res.json({
      ok: false,
      error: req.t("backendErrors.subscriptionNotFound", {
        dataSource,
        voyName,
        firebaseToken,
      }),
    });
  }
  next();
};

export const subscriptionNotExistsMiddleware = async (req, res, next) => {
  const { dataSource, voyName, firebaseToken } = getReqData(req);
  const subscription = await Subscription.findOne({
    dataSource,
    voyName,
    firebaseToken,
  });
  if (subscription) {
    return res.json({
      ok: false,
      error: req.t("backendErrors.subscriptionAlreadyExists", {
        dataSource,
        voyName,
        firebaseToken,
      }),
    });
  }
  next();
};
