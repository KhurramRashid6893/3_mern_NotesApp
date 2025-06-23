import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import NoteForm from '../components/NoteForm';
import NoteItem from '../components/NoteItem';
import '../css/Home.css';

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const ageGroup = localStorage.getItem('ageGroup');
  const [notes, setNotes] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [visibilityFilter, setVisibilityFilter] = useState('all');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

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
        console.error(err);
        alert('Failed to load notes. Please login again.');
        localStorage.clear();
        navigate('/login');
      }
    };

    fetchNotes();
  }, [token, refresh, search, sort, visibilityFilter, navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: `Are you sure you want to logout, ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/', { replace: true });
        window.location.reload();
      }
    });
  };

  if (!token) {
    return null;
  }

  return (
    <div className="home-container">
      <div className="home-header fade-in">
        <div className="home-greeting">
          <h2>👋 Welcome back, {name}!</h2>
          <p className="home-age-group">Age Group: {ageGroup}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn-inline">
          🚪 Logout
        </button>
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
