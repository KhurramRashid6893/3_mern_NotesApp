const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    name: user.name,
    userId: user._id,
    ageGroup: user.ageGroup
  });
});

router.post('/register', async (req, res) => {
  const { username, password, name, ageGroup } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashed, name, ageGroup });
    res.json({ msg: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

module.exports = router;
