import * as cron from "node-cron";
import releaseOutdatedCache from "./db-cleanup/releaseOutdatedCache.js";
import removeInvalidSubscriptions from "./db-cleanup/removeInvalidSubscriptions.js";
import doSzCache from "./sz/szRouteCacher.js";
import doIdsokCache from "./idsok/idsokRouteCacher.js";
import doSzNotifier from "./sz/szNotifier.js";
import doIdsokNotifier from "./idsok/idsokNotifier.js";

import { JSONPreset } from "lowdb/node";
export const subscriptionDb = await JSONPreset("db/subscriptionDb.json", {
  subscriptions: [],
});
const szCacheDb = await JSONPreset("db/szCacheDb.json", { routes: [] });
const idsokCacheDb = await JSONPreset("db/idsokCacheDb.json", { routes: [] });

export const routeCachesOfSources = {
  sz: szCacheDb,
  idsok: idsokCacheDb,
};

const isMidnight = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return currentHour === 0 && currentMinute === 0;
};

cron.schedule("0 0 * * *", () => {
  const allCacheDbs = Object.values(routeCaches);
  releaseOutdatedCache(allCacheDbs);
  removeInvalidSubscriptions(subscriptionDb, allCacheDbs);
});

cron.schedule("*/5 * * * *", () => {
  if (!isMidnight()) {
    doSzCache(szCacheDb);
    doIdsokCache(idsokCacheDb);
  }
});

cron.schedule("*/10 * * * * *", () => {
  if (!isMidnight()) {
    doSzNotifier(subscriptionDb);
    doIdsokNotifier(subscriptionDb);
  }
});
