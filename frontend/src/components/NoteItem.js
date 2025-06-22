import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function NoteItem({ note, onDelete, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags.join(', '));
  const [category, setCategory] = useState(note.category || '');
  const [visibility, setVisibility] = useState(note.visibility || 'private');

  const currentUserId = localStorage.getItem('userId'); // You should store this at login!

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this note?')) return;
    await axios.delete(`http://localhost:5000/api/notes/${note._id}`, {
      headers: { Authorization: token },
    });
    onDelete();
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/notes/${note._id}`, {
      content,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      category,
      visibility
    }, {
      headers: { Authorization: token },
    });
    setIsEditing(false);
    onUpdated();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="font-bold text-lg">{note.title}</h3>
      <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>

      {note.visibility === 'public' && note.user && (
        <p className="text-xs text-blue-600">
          Shared by: {note.user.name}
        </p>
      )}

      {isEditing ? (
        <div className="space-y-2 mt-2">
          <textarea
            className="w-full p-2 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-2 py-1 rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <ReactMarkdown>{note.content}</ReactMarkdown>
          {note.category && (
            <span className="inline-block mt-1 mr-2 text-xs bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 rounded px-2 py-1">
              {note.category}
            </span>
          )}
          {note.tags.map(tag => (
            <span
              key={tag}
              className="inline-block mt-1 mr-1 text-xs bg-gray-300 dark:bg-gray-700 rounded px-2 py-1"
            >
              {tag}
            </span>
          ))}
          <span className={`inline-block mt-1 mr-2 text-xs rounded px-2 py-1 
            ${note.visibility === 'public' 
              ? 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
            {note.visibility}
          </span>
        </div>
      )}

      <div className="mt-2 space-x-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-yellow-500 text-white px-2 py-1 rounded"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;
