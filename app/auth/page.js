'use client';
import { useState } from 'react';
import '../../styles/styles.css';

export default function AuthPage() {
  const [tab, setTab] = useState('signin');
  const [signInData, setSignInData] = useState({ email: '', password: '', remember: false });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signInData.email,
          password: signInData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      // Save token
      localStorage.setItem('token', data.token);

      // Redirect
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
          role: 'provider', // or 'customer'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      // Save token
      localStorage.setItem('token', data.token);

      // Redirect
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="center-stack">
      <div className="brand">
        <div className="logo">🍴</div>
        <div>TiffinHub</div>
      </div>

      <section className="card auth-card">
        <div className="tabs" id="authTabs">
          <div
            className={`tab ${tab === 'signin' ? 'active' : ''}`}
            onClick={() => setTab('signin')}
          >
            Sign In
          </div>
          <div
            className={`tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </div>
        </div>

        <hr className="hr" />

        {error && <div className="error" style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <>
            <form className="auth-form" onSubmit={handleSignIn}>
              <label className="label" htmlFor="si-email">Email</label>
              <input
                id="si-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                required
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
              />

              <div className="space"></div>

              <label className="label" htmlFor="si-pass">Password</label>
              <input
                id="si-pass"
                className="input"
                type="password"
                placeholder="••••••••"
                required
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
              />

              <div className="row" style={{ justifyContent: 'space-between', margin: '12px 0' }}>
                <label className="row small">
                  <input
                    type="checkbox"
                    style={{ marginRight: 8, width: 16, height: 16 }}
                    checked={signInData.remember}
                    onChange={(e) => setSignInData({ ...signInData, remember: e.target.checked })}
                  />
                  Remember me
                </label>
                <a className="small" href="#">Forgot password?</a>
              </div>

              <button className="btn btn-primary" type="submit">Sign in</button>
            </form>

            {/* Google Sign-In Button */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
<a href="http://localhost:5000/api/auth/google">
  <button type="button" className="btn-google-full">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
      alt="Google"
      className="google-logo-full"
    />
    Continue with Google
  </button>
</a>

            </div>
          </>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          <form className="auth-form" onSubmit={handleSignUp}>
            <label className="label" htmlFor="su-name">Full Name</label>
            <input
              id="su-name"
              className="input"
              type="text"
              placeholder="Rahul Kumar"
              required
              value={signUpData.name}
              onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
            />

            <div className="space"></div>

            <label className="label" htmlFor="su-email">Email</label>
            <input
              id="su-email"
              className="input"
              type="email"
              placeholder="you@example.com"
              required
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
            />

            <div className="space"></div>

            <label className="label" htmlFor="su-pass">Password</label>
            <input
              id="su-pass"
              className="input"
              type="password"
              placeholder="Create a password"
              required
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
            />

            <div className="space"></div>

            <button className="btn btn-primary" type="submit">Create account</button>
             <a href="http://localhost:5000/api/auth/google">
  <button type="button" className="btn-google-full">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
      alt="Google"
      className="google-logo-full"
    />
    Continue with Google
  </button>
</a>

          </form>
        )}
      </section>
    </main>
  );
}
