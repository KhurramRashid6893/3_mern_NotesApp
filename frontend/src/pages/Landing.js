import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Landing.css'; // optional if you want to style

function Landing() {
  return (
    <div className="landing-container">
      <h1>📝 Welcome to NotesApp</h1>
      <p>Your secure and powerful markdown note manager.</p>
      <div className="landing-actions">
        <Link to="/login" className="landing-btn">Login</Link>
        <Link to="/signup" className="landing-btn">Signup</Link>
      </div>
    </div>
  );
}

export default Landing;
