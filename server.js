const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

app.get('/', (req, res) => {
  res.send('API Running');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
