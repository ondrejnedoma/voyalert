import mongoose from "mongoose";

const cachedRouteSchema = new mongoose.Schema({
  name: String,
  stops: [String],
  checked: Number,
});

const SzCachedRoute = mongoose.model("SzCachedRoute", cachedRouteSchema);
const IdsokCachedRoute = mongoose.model("IdsokCachedRoute", cachedRouteSchema);

export { SzCachedRoute, IdsokCachedRoute };
