import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleBack = () => {
    if (location.pathname === '/login' && token) {
      handleLogout();
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
  Swal.fire({
    title: 'Logout?',
    text: "Are you sure you want to logout?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('ageGroup');
      navigate('/', { replace: true });  // ✅ Force redirect to home
      window.location.reload(); // ✅ Ensures fresh state (optional but ensures reset)
    }
  });
};


  const isHome = location.pathname === '/';

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        {!isHome ? (
          <button
            onClick={handleBack}
            className="text-white border rounded p-1 text-sm"
          >
            Back
          </button>
        ) : (
          <button
            disabled
            className="text-white border border-white opacity-50 rounded p-1 text-sm cursor-not-allowed"
          >
            Back
          </button>
        )}
        <Link to="/" className="text-white font-bold text-xl">NotesApp</Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-white border rounded p-1 text-sm"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-1 rounded text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
