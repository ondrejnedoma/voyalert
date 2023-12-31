import { differenceInDays } from "date-fns";

const releaseOutdatedCache = (cacheDbs) => {
  for (const cacheDb in cacheDbs) {
    const newCacheDb = cacheDb.data.routes.filter(
      (route) => differenceInDays(Date.now(), route.checked) < 14
    );
    cacheDb.data.routes = newCacheDb;
    cacheDb.write();
  }
};

export default releaseOutdatedCache;
