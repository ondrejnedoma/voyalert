import mongoose from 'mongoose';
import * as cron from 'node-cron';
import releaseOutdatedCache from './db-cleanup/releaseOutdatedCache.js';
import removeInvalidSubscriptions from './db-cleanup/removeInvalidSubscriptions.js';
import doSzCache from './sz/szRouteCacher.js';
import doIdsokCache from './idsok/idsokRouteCacher.js';
import doSzNotifier from './sz/szNotifier.js';
import doIdsokNotifier from './idsok/idsokNotifier.js';
import 'dotenv/config';

let mongoURL = process.env.MONGODB_URL;
if (!mongoURL) {
  console.warn(
    'No MONGODB_URL environmental variable was specified. Using the default: mongodb://127.0.0.1:27017/voyalert',
  );
  mongoURL = 'mongodb://127.0.0.1:27017/voyalert';
}
mongoose.connect(mongoURL);

import {SzCachedRoute, IdsokCachedRoute} from './db-models/cachedRoute.js';
export const routeCaches = {sz: SzCachedRoute, idsok: IdsokCachedRoute};

const isMidnight = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return currentHour === 0 && currentMinute === 0;
};

cron.schedule('0 0 * * *', () => {
  releaseOutdatedCache(routeCaches);
  removeInvalidSubscriptions(routeCaches);
});

cron.schedule('*/5 * * * *', () => {
  if (!isMidnight()) {
    doSzCache();
    doIdsokCache();
  }
});

cron.schedule('*/10 * * * * *', () => {
  if (!isMidnight()) {
    doSzNotifier();
    doIdsokNotifier();
  }
});
