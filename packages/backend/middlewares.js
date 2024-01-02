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
        error: `Field(s) ${missingFields} are required`,
      });
    }
    next();
  };
};

export const voyNameOnlyNumbersMiddleware = (req, res, next) => {
  const { voyName } = getReqData(req);
  if (!/^ *\d+ *( \d+)* *$/.test(voyName)) {
    return res.json({
      ok: false,
      error: "Only numbers allowed for the voyName field",
    });
  }
  next();
};

export const isDataSourceAcceptedMiddleware = (req, res, next) => {
  const { dataSource } = getReqData(req);
  const acceptedDataSources = Object.keys(routeCaches);
  if (!acceptedDataSources.includes(dataSource)) {
    return res.json({
      ok: false,
      error: `"${dataSource}" not accepted for field dataSource. Accepted values are: ${acceptedDataSources}`,
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
      error: `The route for voy ${dataSource} ${voyName} is not cached`,
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
      error: `Voy ${dataSource} ${voyName} for Firebase token ${firebaseToken} not found`,
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
      error: `Voy ${dataSource} ${voyName} already exists for Firebase token ${firebaseToken}`,
    });
  }
  next();
};
