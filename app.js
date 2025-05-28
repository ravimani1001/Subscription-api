const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require('cookie-parser');

const db = require("./config/db");

//Importing routes files
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');


const app = express();

// Allow other origins (like a frontend) to talk to your backend
app.use(cors());

// Add security headers
app.use(helmet());

// Parse JSON request bodies
app.use(express.json());

app.use(cookieParser())

// Home route
app.get("/", (req, res) => {
  res.send(
    "Subscription API is running! Please visit the github Repo for other endpoints"
  );
});

// Auth Routes
app.use('/auth', authRoutes);

// Plan Routes
app.use('/plans', planRoutes); 

// Subscription Routes
app.use('/subscriptions', subscriptionRoutes);




module.exports = app;
