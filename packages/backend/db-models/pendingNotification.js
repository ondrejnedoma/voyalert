import mongoose from 'mongoose';

const pendingNotificationSchema = new mongoose.Schema({
  id: String,
  data: {
    dataSource: String,
    voyName: String,
    firebaseToken: String,
    type: String,
    time: String,
    stop: String,
    notificationType: String,
  },
});

const PendingNotification = mongoose.model(
  'PendingNotification',
  pendingNotificationSchema,
);

export default PendingNotification;
