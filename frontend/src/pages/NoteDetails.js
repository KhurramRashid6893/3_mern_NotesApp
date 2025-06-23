// Description: Displays details of a single note with options to edit it.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../css/NoteDetails.css';

function NoteDetails({ params }) {
  const id = window.location.pathname.split('/').pop();
  const [note, setNote] = useState(null);
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: token }
      });
      setNote(res.data);
      setContent(res.data.content);
    };
    fetchNote();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/notes/${id}`, { content }, {
      headers: { Authorization: token }
    });
    setNote(prev => ({ ...prev, content }));
    setEdit(false);
  };

  if (!note) return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loading-text">Loading your note...</p>
    </div>
  );

  return (
    <div className="note-details-container">
      <div className="note-header">
        <h2 className="note-title">
          <span className="emoji">📝</span> {note.title}
        </h2>
        <div className="last-updated">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </div>
      </div>

      {edit ? (
        <div className="edit-mode">
          <textarea
            className="note-edit-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your note here..."
            autoFocus
          />
          <div className="button-group">
            <button 
              className="btn save-btn"
              onClick={handleUpdate}
            >
              💾 Save Changes
            </button>
            <button 
              className="btn cancel-btn"
              onClick={() => setEdit(false)}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="markdown-content">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
          <button 
            className="btn edit-btn"
            onClick={() => setEdit(true)}
          >
            ✏️ Edit Note
          </button>
        </div>
      )}
    </div>
  );
}

export default NoteDetails;