import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import notify from '../notify.js';
import {getAuth, getAllTrains} from './szUtils.js';

import Subscription from '../db-models/subscription.js';

const alertOneTrain = async ({
  token,
  sessionIdCookie,
  trainId,
  stops,
  voyName,
  id,
  notificationType,
}) => {
  const res = await fetch(
    `https://grapp.spravazeleznic.cz/OneTrain/RouteInfo/${token}?trainId=${trainId}`,
    {
      headers: {
        cookie: sessionIdCookie,
      },
    },
  );
  const html = await res.text();
  const $ = cheerio.load(html);
  if ($('div.alert').text().includes('nejsou dostupné')) {
    return {ok: false};
  }
  for (const stop of stops) {
    const stationElement = $('div.row > div.col-lg-4')
      .filter(function () {
        return $(this).text().trim() === stop.name;
      })
      .first();
    const stationParent = stationElement.parent();
    const allRows = $('div.row[style="align-items: center;display: flex;"]');
    // Check if the station is the first one to get around the shitty structure of the GRAPP HTML fragment
    if (allRows.index(stationParent) === 0) {
      const departureElement = stationParent
        .find('div:nth-child(5) > div:nth-child(3) > div:nth-child(1) > span')
        .first();
      if (departureElement.text()) {
        if (!departureElement.attr('class').includes('Future')) {
          if (stop.notifyDeparture && !stop.departureAlreadyAlerted) {
            await szNotify('departure', departureElement.text().trim());
            continue;
          }
        }
      }
    }
    const departureElement = stationParent
      .find('div:nth-child(8) > div:nth-child(1) > span')
      .first();
    const arrivalElement = stationParent
      .find('div:nth-child(5) > span')
      .first();
    if (departureElement.text()) {
      if (!departureElement.attr('class').includes('Future')) {
        if (stop.notifyDeparture && !stop.departureAlreadyAlerted) {
          await szNotify('departure', departureElement.text().trim());
        }
      }
    }
    if (arrivalElement.text()) {
      if (!arrivalElement.attr('class').includes('Future')) {
        if (stop.notifyArrival && !stop.arrivalAlreadyAlerted) {
          await szNotify('arrival', arrivalElement.text().trim());
        }
      }
    }
    async function szNotify(type, time) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      notify(id, notificationType, {
        dataSource: 'sz',
        voyName,
        type,
        time,
        stop: stop.name,
        notificationType: stop['alarm' + capitalizedType]
          ? 'alarm'
          : 'notification',
      });
      const subscription = await Subscription.findOne({
        dataSource: 'sz',
        voyName,
        id,
      });
      const stopIndex = subscription.config.stops.findIndex(
        oneStop => oneStop.name === stop.name,
      );
      subscription.config.stops[stopIndex][type + 'AlreadyAlerted'] = true;
      await subscription.save();
    }
  }
  return {ok: true};
};

const doSzNotifier = async () => {
  const {token, sessionIdCookie} = await getAuth();
  const allTrains = await getAllTrains(token, sessionIdCookie);
  const allSubscriptions = await Subscription.find({
    dataSource: 'sz',
    'config.stops': {$ne: []},
  });
  for (const subscription of allSubscriptions) {
    const {voyName, id, notificationType, config} = subscription;
    // Find the trainId from allTrains based on the subscription's voyName
    const trainId = allTrains.find(train => train.name === voyName).id;
    // Filter stops into stopsToCheck based on if arrivalAlreadyAlerted or departureAlreadyAlerted are false
    const stopsToCheck = config.stops.filter(
      stop => !stop.arrivalAlreadyAlerted || !stop.departureAlreadyAlerted,
    );
    // If the trainId is not found, meaning it's not available on GRAPP and at least some stop has been alerted about, assume it has finished its journey
    if (!trainId) {
      if (
        config.stops.some(
          stop => stop.arrivalAlreadyAlerted || stop.departureAlreadyAlerted,
        )
      ) {
        console.log(`Reset alerted stops for subscription sz ${voyName}`);
        await Subscription.updateOne(
          {dataSource: 'sz', voyName, id},
          {
            $set: {
              'config.stops.$[].arrivalAlreadyAlerted': false,
              'config.stops.$[].departureAlreadyAlerted': false,
            },
          },
        );
      }
      continue;
    }
    await alertOneTrain({
      token,
      sessionIdCookie,
      trainId,
      stops: stopsToCheck,
      voyName,
      id,
      notificationType,
    });
  }
};

export default doSzNotifier;
