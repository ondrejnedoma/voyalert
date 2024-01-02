import { subDays } from "date-fns";

const releaseOutdatedCache = async (routeCaches) => {
  for (const routeCache in routeCaches) {
    const fourteenDaysAgo = subDays(Date.now(), 14);
    await routeCache.deleteMany({ checked: { $lt: fourteenDaysAgo } });
  }
};

export default releaseOutdatedCache;
