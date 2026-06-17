require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const pinRoutes = require('./routes/pins');
const userRoutes = require('./routes/users');
const collectionRoutes = require('./routes/collections');

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Must run before routes — no-op when already connected (local dev / warm serverless)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app;
