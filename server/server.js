import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./configs/dbConnection.js";
import { clerkWebhooks, stripeWebHooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import { connectCloudinary } from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

// application initialization
const app = express();

// Connect with Data Base
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(clerkMiddleware());

// routes
app.get("/", (req, res) => res.send("API is Working"));
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

// PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, (req, res) => {
  console.log(`Server is Running on port ${PORT} ------>>> http://localhost:${PORT}`);
});
