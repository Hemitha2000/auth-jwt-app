const express = require('express');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const app = express();

// middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
// test route
app.get('/', (req, res) => {
  res.send('Auth API is running');
});
app.use(errorHandler);
module.exports = app;