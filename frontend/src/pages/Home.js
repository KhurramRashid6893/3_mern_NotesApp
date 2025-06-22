import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import NoteItem from '../components/NoteItem';
import '../css/Home.css';

function Home() {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const ageGroup = localStorage.getItem('ageGroup');
  const [notes, setNotes] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [visibilityFilter, setVisibilityFilter] = useState('all');

  useEffect(() => {
    if (!token) return;

    const fetchNotes = async () => {
      try {
        let url = `http://localhost:5000/api/notes?sort=${sort}`;
        if (search) url += `&search=${search}`;
        if (visibilityFilter !== 'all') url += `&visibility=${visibilityFilter}`;

        const res = await axios.get(url, {
          headers: { Authorization: token },
        });
        setNotes(res.data);
      } catch (err) {
        alert('Failed to load notes. Please login again.');
      }
    };

    fetchNotes();
  }, [token, refresh, search, sort, visibilityFilter]);

  if (!token) {
    return (
      <div className="home-welcome-container">
        <div className="home-welcome-card fade-in">
          <h1 className="home-welcome-title">📝 Welcome to NotesApp</h1>
          <p className="home-welcome-description">
            A secure, fast, and beautiful app to manage your notes with markdown, tags, and categories.
          </p>
          
          <ul className="home-features-list">
            <li>✨ Create rich-text notes with Markdown</li>
            <li>🏷️ Organize with tags and categories</li>
            <li>🌓 Dark / light mode</li>
            <li>🔍 Search, sort, and filter</li>
            <li>🎯 100% free & open-source</li>
          </ul>
          
          <div className="home-auth-buttons">
            <Link to="/signup" className="home-signup-btn">
              Signup
            </Link>
            <Link to="/login" className="home-login-btn">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header fade-in">
        <div className="home-greeting">
          <h2>👋 Welcome back, {name}!</h2>
          <p className="home-age-group">Age Group: {ageGroup}</p>
        </div>
      </div>

      <NoteForm onSaved={() => setRefresh(!refresh)} />

      <div className="notes-controls fade-in">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-container">
          <div className="filter-group">
            <label>📅 Sort:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="filter-select"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>👁️ Visibility:</label>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Notes</option>
              <option value="public">Public Notes</option>
              <option value="private">My Private Notes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="empty-notes fade-in">
            <p className="empty-icon">📭</p>
            <h3>No notes found</h3>
            <p>Create your first note to get started!</p>
          </div>
        ) : (
          notes.map(note => (
            <NoteItem
              key={note._id}
              note={note}
              onDelete={() => setRefresh(!refresh)}
              onUpdated={() => setRefresh(!refresh)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;