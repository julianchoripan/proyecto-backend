import express from "express";
import fs from "fs";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { fileURLToPath } from "url";
import "dotenv/config";
import cors from "cors";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(cors());
// if (process.env.NODE_ENV !== "test") {
connectDB();
app.use("/api/avatars", express.static(path.join(__dirname || "", "avatar")));
//servidor en escucha
app.listen(process.env.APP_PORT, () => {
  console.log(`[Server] Server running at ${process.env.APP_PORT} port`);
});
// }

app.use(authRoutes);
app.use(orderRoutes);
app.use(userRoutes);
app.use(productRoutes);

export default app;

// import express from "express";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import userRoutes from "./routes/userRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import connectDB from "./config/database.js";
// import productRoutes from "./routes/productRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import "dotenv/config";
// import cors from "cors";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.use(express.json());
// app.use(cors());
// connectDB();
// app.use("/api/avatars", express.static(path.join(__dirname, "avatar")));

// app.use(authRoutes);
// app.use(orderRoutes);
// app.use(userRoutes);
// app.use(productRoutes);

// // servidor en escucha
// app.listen(process.env.APP_PORT, () => {
//   console.log(`[Server] Server running at ${process.env.APP_PORT} port`);
// });
