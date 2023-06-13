const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database is connected");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB
