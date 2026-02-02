import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cornRoutes from "./routes/corn.js";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use("/api/v1", cornRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
