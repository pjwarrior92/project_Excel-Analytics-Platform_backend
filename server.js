// excel-analytics-backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://exceladmin:excelpass123@cluster0.ceklvxs.mongodb.net/excelAnalytics?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
