import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/auth.css';

function Login({ toggleTheme, currentTheme }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('ageGroup', res.data.ageGroup);

      await Swal.fire({
        title: `🎉 Welcome ${res.data.name}!`,
        text: `Age Group: ${res.data.ageGroup}`,
        icon: 'success',
        confirmButtonText: 'Continue'
      });

      navigate('/');
    } catch (err) {
      Swal.fire({
        title: '⚠️ Login Failed',
        text: err.response?.data?.error || 'Invalid credentials. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-container ${currentTheme}`}>
      <div className="theme-toggle" onClick={toggleTheme}>
        {currentTheme === 'dark' ? '☀️' : '🌙'}
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">🔒 Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your notes</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">📱 Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">🔑 Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button login-button"
            disabled={isLoading}
          >
            {isLoading ? '🔐 Logging in...' : '👉 Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>New to NotesApp? <span onClick={() => navigate('/register')}>Create account</span></p>
          {/* <Link to="/register" className="auth-link">Create account</Link> */}

          <p className="password-hint">Forgot password? <span>Reset it</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;