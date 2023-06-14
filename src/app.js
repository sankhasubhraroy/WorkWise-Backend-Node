require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();


// Connect to Database
const connectDB = require("./config/dbConfig");
connectDB();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Routes
const apiRoute = require("./routes/index");
const indexRoute = (req, res) => {
  res.json("Welcome to the WorkWise API");
};

app.use("/api", apiRoute);
app.use("/", indexRoute);


// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
