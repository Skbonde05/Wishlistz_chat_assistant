import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import plannerRoutes from "./routes/planner.routes.js";
import navigationRoutes from "./routes/navigate.routes.js";
import recommendRoutes from "./routes/recommendRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/navigate", navigationRoutes);
app.use("/api/recommend", recommendRoutes);

export default app;
