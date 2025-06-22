const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Create note
router.post('/', auth, async (req, res) => {
  const { title, content, tags, category, visibility } = req.body;
  const note = await Note.create({
    user: req.user,
    title,
    content,
    tags,
    category,
    visibility: visibility || 'private'
  });
  res.json(note);
});

// Update note
router.put('/:id', auth, async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// Get notes
router.get('/', auth, async (req, res) => {
  const { search, sort, page = 1, limit = 5, visibility } = req.query;

  let query = {};

  if (visibility === 'public') {
    query.visibility = 'public';
  } 
  else if (visibility === 'private') {
    query.user = req.user;
    query.visibility = 'private';
  } 
  else {
    query = {
      $or: [
        { user: req.user },
        { visibility: 'public' }
      ]
    };
  }

  if (search) {
    query.title = new RegExp(search, 'i');
  }

  const notes = await Note.find(query)
    .populate('user', 'name') // Populate user's name
    .sort(sort ? { createdAt: sort === 'asc' ? 1 : -1 } : { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(notes);
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json({ msg: 'Deleted' });
});

module.exports = router;
