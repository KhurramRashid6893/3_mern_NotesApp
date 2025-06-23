import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/Navbar.css';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleBack = () => {
    if (location.pathname === '/login' && token) {
      handleLogout(true);
    } else {
      navigate(-1);
    }
  };

  const handleLogout = (fromBack = false) => {
    Swal.fire({
      title: 'Logout?',
      text: fromBack
        ? `If you go back now, you will be logged out.`
        : `Are you sure you want to logout?`,
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

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-left">
        <button
          onClick={handleBack}
          className={`back-btn ${location.pathname === '/' ? 'disabled' : ''}`}
          disabled={location.pathname === '/'}
        >
          ← Back
        </button>

        <Link to="/" className="logo">
          📝 <span className="logo-text">NotesApp</span>
          <span className="logo-tagline">Your thoughts, organized</span>
        </Link>
      </div>

      <div className="navbar-right">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
