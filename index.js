require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const server = express();
const authRouter = require("./routes/auth-routes");
const resRouter = require("./routes/restaurant-routes");
const { connectDb, disconnectDb } = require("./config/dbconnection");

connectDb();
port = process.env.PORT || 5000;

server.use(express.json());
server.use(cors());

server.use("/auth", authRouter.router);
server.use("/restaurants", resRouter.router);

server.listen(port, () => {
  console.log("Server Started at " + port);
});
process.on("SIGINT", async () => {
  await disconnectDb();
  process.exit(0);
});
