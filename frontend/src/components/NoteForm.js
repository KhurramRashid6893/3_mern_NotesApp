import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function NoteForm({ onSaved }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('private');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/notes',
        {
          title,
          content,
          tags: tags.split(',').map(t => t.trim()).filter(t => t),
          category,
          visibility
        },
        { headers: { Authorization: token } }
      );
      setTitle('');
      setContent('');
      setTags('');
      setCategory('');
      setVisibility('private');
      onSaved();
    } catch {
      alert('Error saving note');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="font-bold mb-2">Create Note</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input className="w-full p-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <textarea className="w-full p-2 border rounded" value={content} onChange={e => setContent(e.target.value)} placeholder="Write in Markdown..." rows="4" />
        <input className="w-full p-2 border rounded" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" />
        <input className="w-full p-2 border rounded" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <select className="w-full p-2 border rounded" value={visibility} onChange={e => setVisibility(e.target.value)}>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
        <button className="bg-blue-600 text-white p-2 rounded">Save</button>
      </form>
      {content && (
        <div className="mt-4 p-2 border rounded">
          <h3 className="font-bold">Preview</h3>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default NoteForm;
