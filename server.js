require('dotenv').config();
require('./cronJobs/expireSubscriptions');

// Load the express app from app.js
const app = require('./app');

// Load the port from .env or default to 5000
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
