import React, { useState } from 'react';
import apiClient from '../api';  // ✅ ADDED: Use apiClient instead of axios
import ReactMarkdown from 'react-markdown';
import { FiEdit2, FiTrash2, FiSave, FiX, FiUser, FiLock, FiUnlock } from 'react-icons/fi';
import '../css/NoteItem.css';

function NoteItem({ note, onDelete, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags.join(', '));
  const [category, setCategory] = useState(note.category || '');
  const [visibility, setVisibility] = useState(note.visibility || 'private');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = localStorage.getItem('userId');

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/notes/${note._id}`);  // ✅ UPDATED: Use apiClient
      onDelete();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await apiClient.put(`/api/notes/${note._id}`, {  // ✅ UPDATED: Use apiClient
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        category,
        visibility
      });
      setIsEditing(false);
      onUpdated();
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`note-item ${isEditing ? 'editing' : ''}`}>
      <div className="note-header">
        <div className="note-title-group">
          <h3 className="note-title">{note.title}</h3>
          <div className="note-meta">
            <span className="note-date">
              {new Date(note.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="visibility-badge" data-visibility={visibility}>
              {visibility === 'public' ? <FiUnlock size={12} /> : <FiLock size={12} />}
              {visibility}
            </span>
          </div>
        </div>

        {note.visibility === 'public' && note.user && note.user._id !== currentUserId && (
          <div className="shared-by">
            <FiUser className="user-icon" />
            <span>Shared by {note.user.name}</span>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="edit-mode">
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                className="form-input"
                placeholder="Comma separated tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                className="form-input"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Visibility</label>
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

          <div className="button-group">
            <button
              onClick={handleUpdate}
              className="btn save-btn"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="spinner"></span>
              ) : (
                <FiSave className="icon" />
              )}
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn cancel-btn"
            >
              <FiX className="icon" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="markdown-content">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>

          {(note.category || note.tags.length > 0) && (
            <div className="tags-container">
              {note.category && (
                <span className="category-tag">
                  {note.category}
                </span>
              )}
              {note.tags.map(tag => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="note-footer">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="action-btn edit-btn"
        >
          <FiEdit2 className="icon" />
          {isEditing ? 'Cancel Edit' : 'Edit Note'}
        </button>
        <button
          onClick={handleDelete}
          className="action-btn delete-btn"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="spinner"></span>
          ) : (
            <FiTrash2 className="icon" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;
