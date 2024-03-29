import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth-routes.js";
import resRouter from "./routes/restaurant-routes.js";
import scrapeRouter from "./routes/scrape-route.js";
import cartRouter from "./routes/cart-routes.js";
import paymentRouter from "./routes/payment-routes.js";
import addressRouter from "./routes/address-routes.js";
import orderRouter from "./routes/order-routes.js";
import favRouter from "./routes/favourites-routes.js";
import adminRouter from "./routes/admin-routes.js";
import { connectDb, disconnectDb } from "./config/dbconnection.js";
import morgan from "morgan";

dotenv.config();
connectDb();

const server = express();
const port = process.env.PORT || 5000;

server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
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
server.use("/", paymentRouter);
server.use("/address", addressRouter);
server.use("/order", orderRouter);
server.use("/fav", favRouter);
server.use("/admin", adminRouter);

server.listen(port, () => {
  console.log("Server Started at " + port);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await disconnectDb();
  process.exit(0);
});
