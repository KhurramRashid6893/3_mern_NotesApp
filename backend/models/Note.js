const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String },
  tags: [{ type: String }],
  category: { type: String },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' }
}, { timestamps: true });


module.exports = mongoose.model('Note', noteSchema);
