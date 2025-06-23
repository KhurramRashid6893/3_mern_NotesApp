import React, { useState } from 'react';
//import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../css/NoteForm.css';

// ✅ Import your api.js instead of hardcoded axios
import apiClient from '../api'; // <--- Added line to use your centralized API client

function NoteForm({ onSaved }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/notes',  // <--- Changed from axios + localhost to apiClient
        {
          title,
          content,
          tags: tags.split(',').map(t => t.trim()).filter(t => t),
          category,
          visibility
        }
      );
      setTitle('');
      setContent('');
      setTags('');
      setCategory('');
      setVisibility('private');
      onSaved();
    } catch {
      alert('Error saving note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="note-form-container">
      <div className="note-form-header">
        <h2 className="form-title">
          <span className="emoji">✨</span> Create New Note
        </h2>
        <p className="form-subtitle">Capture your thoughts and ideas in Markdown format</p>
      </div>
      
      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">📌</span> Title
          </label>
          <input 
            className="form-input" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Note title" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">📝</span> Content (Markdown)
          </label>
          <textarea 
            className="form-textarea" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Write your note here in Markdown format..." 
            rows="6"
          />
        </div>
        
        <div className="form-columns">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏷️</span> Tags
            </label>
            <input 
              className="form-input" 
              value={tags} 
              onChange={e => setTags(e.target.value)} 
              placeholder="Comma separated tags (e.g., work, ideas)"
            />
            <div className="input-hint">Separate tags with commas</div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🗂️</span> Category
            </label>
            <input 
              className="form-input" 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              placeholder="Category (e.g., Personal, Work)"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👁️</span> Visibility
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="private" 
                  checked={visibility === 'private'} 
                  onChange={() => setVisibility('private')} 
                />
                <span className="radio-label">Private</span>
              </label>
              <label className="radio-option">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="public" 
                  checked={visibility === 'public'} 
                  onChange={() => setVisibility('public')} 
                />
                <span className="radio-label">Public</span>
              </label>
            </div>
          </div>
        </div>
        
        <button 
          className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span> Saving...
            </>
          ) : (
            <>
              <span className="icon">💾</span> Save Note
            </>
          )}
        </button>
      </form>
      
      {content && (
        <div className="preview-container">
          <div className="preview-header">
            <h3 className="preview-title">
              <span className="emoji">👁️</span> Preview
            </h3>
            <div className="preview-hint">Live Markdown rendering</div>
          </div>
          <div className="markdown-preview">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteForm;
