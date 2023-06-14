const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on("connected", () => {
      console.log("database is connected");
    });

    mongoose.connection.on("error", () => {
      console.log("error connecting to the database");
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
