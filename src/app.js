require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Connect to MongoDB
const connectDB = require('./config/dbConfig');
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api', require('./routes/index'));
app.use('/', (req, res) => {
    res.json('Welcome to the WorkWise API');
})

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});