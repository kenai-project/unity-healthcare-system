import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="auth-container">
        <div className="auth-card">
          <h2>Login to Your Account</h2>
          <form>
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <div className="checkbox-wrapper">
                <input type="checkbox" id="staySignedIn" />
                <label htmlFor="staySignedIn">Stay signed in</label>
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--full-width" style={{color: '#fff'}}>Login</button>
          </form>
          <div className="auth-links">
            <p>Don't have an account? <a href="/register">Register here</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}
