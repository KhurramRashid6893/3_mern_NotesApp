const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS: Allow your frontend (set CLIENT_URL in Render env vars)
app.use(cors({
  origin: process.env.CLIENT_URL || '*',  // In production, set CLIENT_URL for security
  credentials: true
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Import routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// ✅ Health check route (optional but recommended)
app.get('/', (req, res) => {
  res.send('🚀 NotesApp API is running');
});

// ✅ 404 handler for unknown API routes
app.use((req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
