import express from 'express';
import {routeCaches} from './databases.js';
import {
  requireFieldsMiddleware,
  isDataSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  isNotificationTypeAcceptedMiddleware,
  subscriptionExistsMiddleware,
  subscriptionNotExistsMiddleware,
} from './middlewares.js';
import {i18nRegister} from './i18nHandler.js';
import Subscription from './db-models/subscription.js';
import PendingNotification from './db-models/pendingNotification.js';

const app = express();

app.use(express.json());
i18nRegister(app);

app.get('/ping', (req, res) => {
  res.json({ok: true});
});

app.post(
  '/add',
  requireFieldsMiddleware(['dataSource', 'voyName', 'id', 'notificationType']),
  isDataSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  isNotificationTypeAcceptedMiddleware,
  subscriptionNotExistsMiddleware,
  async (req, res) => {
    const {dataSource, voyName, id, notificationType} = req.body;
    Subscription.create({
      dataSource,
      voyName,
      id,
      notificationType,
    });
    res.json({ok: true});
  },
);

app.post(
  '/delete',
  requireFieldsMiddleware(['dataSource', 'voyName', 'id']),
  isDataSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const {dataSource, voyName, id} = req.body;
    await Subscription.deleteOne({
      dataSource,
      voyName,
      id,
    });
    res.json({ok: true});
  },
);

app.get('/list', requireFieldsMiddleware(['id']), async (req, res) => {
  const {id} = req.query;
  const data = await Subscription.find({id});
  res.json({ok: true, data});
});

app.get(
  '/pendingNotifications',
  requireFieldsMiddleware(['id']),
  async (req, res) => {
    const {id} = req.query;
    const pendingNotifications = await PendingNotification.find({id});
    const data = pendingNotifications.map(notification => notification.data);
    PendingNotification.deleteMany({id});
    res.json({ok: true, data});
  },
);

app.get(
  '/route',
  requireFieldsMiddleware(['dataSource', 'voyName']),
  isDataSourceAcceptedMiddleware,
  isRouteCachedMiddleware,
  async (req, res) => {
    const {dataSource, voyName} = req.query;
    const data = (await routeCaches[dataSource].findOne({name: voyName})).stops;
    return res.json({ok: true, data});
  },
);

app.get(
  '/getConfig',
  requireFieldsMiddleware(['dataSource', 'voyName', 'id']),
  isDataSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const {dataSource, voyName, id} = req.query;
    const data = (
      await Subscription.findOne({
        dataSource,
        voyName,
        id,
      })
    ).config;
    return res.json({
      ok: true,
      data,
    });
  },
);

app.post(
  '/setConfigForStop',
  requireFieldsMiddleware([
    'dataSource',
    'voyName',
    'id',
    'stop',
    'field',
    'value',
  ]),
  isDataSourceAcceptedMiddleware,
  subscriptionExistsMiddleware,
  async (req, res) => {
    const {dataSource, voyName, id, stop, field, value} = req.body;
    const subscription = await Subscription.findOne({
      dataSource,
      voyName,
      id,
    });
    const stopIndex = subscription.config.stops.findIndex(
      oneStop => oneStop.name === stop,
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
    return res.json({ok: true});
  },
);

app.get('/privacypolicy', (req, res) => {
  res.sendFile('voyalertprivacypolicy.docx', {root: '.'});
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Shutting down gracefully...');
  process.exit(0);
});

app.listen(3000);
