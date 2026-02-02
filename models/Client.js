import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  lastPurchaseAt: { type: Date },
  cornCount: { type: Number, default: 0 },
});

export default mongoose.model("Client", ClientSchema);
