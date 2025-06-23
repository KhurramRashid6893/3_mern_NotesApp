import React, { useState } from 'react';
// ✅ Replaced axios with apiClient
import apiClient from '../api';  // Added this line for centralized API client
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/auth.css';

function Register({ toggleTheme, currentTheme }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    ageGroup: ''
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
      // ✅ Use apiClient
      await apiClient.post('/api/auth/register', formData);

      await Swal.fire({
        title: '🎉 Registration Successful!',
        text: 'You can now login with your credentials',
        icon: 'success',
        confirmButtonText: 'Go to Login'
      });

      navigate('/login');
    } catch (err) {
      Swal.fire({
        title: '⚠️ Registration Failed',
        text: err.response?.data?.error || 'Something went wrong. Please try again.',
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
          <h2 className="auth-title">👋 Create Account</h2>
          <p className="auth-subtitle">Join to start creating markdown notes</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">👤 Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ageGroup">🎂 Age Group</label>
            <select
              id="ageGroup"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select your age group</option>
              <option value="Under 18">Under 18 👶</option>
              <option value="18-25">18-25 🎓</option>
              <option value="26-35">26-35 💼</option>
              <option value="36-50">36-50 🏠</option>
              <option value="51+">51+ 👴👵</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">📱 Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
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
              placeholder="Create a password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <p className="password-hint">Use at least 6 characters</p>
          </div>
          
          <button 
            type="submit" 
            className="auth-button register-button"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Creating account...' : '🚀 Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <span onClick={() => navigate('/login')}>Sign in</span></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
