import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  dataSource: String,
  voyName: String,
  firebaseToken: String,
  config: {
    type: {
      stops: [
        {
          name: String,
          notifyArrival: Boolean,
          notifyDeparture: Boolean,
          alarmArrival: Boolean,
          alarmDeparture: Boolean,
          arrivalAlreadyAlerted: Boolean,
          departureAlreadyAlerted: Boolean,
        },
      ],
    },
    default: { stops: [] },
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
