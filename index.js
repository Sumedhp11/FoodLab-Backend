require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
const authRouter = require("./routes/auth-routes");
const resRouter = require("./routes/restaurant-routes");
const { connectDb, disconnectDb } = require("./config/dbconnection");

connectDb();
port = process.env.PORT || 5000;

server.use(express.json());
server.use(cors());
server.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Influencer API</title>
    </head>
    <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh;">
      <div style="text-align: center; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333333;">Welcome to the Influencer API</h1>
        <p style="color: #666666;">This is the first Landing Page to Buhrata!</p>
      </div>
    </body>
   </html>`);
});

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
server.use("/auth", authRouter.router);
server.use("/restaurants", resRouter.router);

server.listen(port, () => {
  console.log("Server Started at " + port);
});
process.on("SIGINT", async () => {
  await disconnectDb();
  process.exit(0);
});
