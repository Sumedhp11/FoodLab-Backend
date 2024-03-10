import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth-routes.js";
import resRouter from "./routes/restaurant-routes.js";
import scrapeRouter from "./routes/scrape-route.js";
import cartRouter from "./routes/cart-routes.js";
import paymentRouter from "./routes/payment-routes.js";
import { connectDb, disconnectDb } from "./config/dbconnection.js";
import morgan from "morgan";
import Razorpay from "razorpay";

dotenv.config();
connectDb();

const server = express();
const port = process.env.PORT || 5000;

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

// Landing page route
server.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FoodLab API</title>
    </head>
    <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh;">
      <div style="text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333333;">Welcome to the Foodlab API</h1>
        <p style="color: #666666;">This is the first Landing Page to Buhrata!</p>
      </div>
    </body>
   </html>`);
});

// API status route
server.get("/api", (req, res) => {
  console.log("API is working");
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Status</title>
  </head>
  <body style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f4f4f4; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh;">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #333333;">Page 2 : API is working!!</h1>
    </div>
  </body>
  </html>
`);
});

// Mount routers
server.use("/auth", authRouter);
server.use("/restaurants", resRouter);
server.use("/", scrapeRouter);
server.use("/cart", cartRouter);
server.use("/api", paymentRouter);
server.use(express.urlencoded({ extended: true }));

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

server.listen(port, () => {
  console.log("Server Started at " + port);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await disconnectDb();
  process.exit(0);
});
