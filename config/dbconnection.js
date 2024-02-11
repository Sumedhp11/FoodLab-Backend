const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(process.env.MONGODB_URL);
    console.log(
      "Connected to the database",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
    process.exit(1);
  }
};

module.exports = { connectDb, disconnectDb };
