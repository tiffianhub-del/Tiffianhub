'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = 'dark';
    }
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.nav__inner')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  return (
    <div>
      {/* NAVBAR */}
      <header className="nav">
        <div className="container nav__inner">
          <Link href="/" className="brand">
            <span className="brand__icon">🍽️</span>
            <span className="brand__name">FreshillyMeal</span>
          </Link>
          <button 
            className={`nav__toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className="nav__links">
            <Link href="/" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Browse Tiffins</Link>
            <Link href="/help" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Help</Link>
            <Link href="/auth" className="btn btn--dark" onClick={() => setMobileMenuOpen(false)}>Register as Provider</Link>
          </nav>
          <nav className={`nav__mobile ${mobileMenuOpen ? 'active' : ''}`}>
            <Link href="/" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Browse Tiffins</Link>
            <Link href="/help" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Help</Link>
            <Link href="/auth" className="btn btn--dark" onClick={() => setMobileMenuOpen(false)}>Register as Provider</Link>
          </nav>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="pagehead" style={{ padding: '3rem 0' }}>
        <div className="container">
          <h1 className="pagehead__title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            PRIVACY POLICY
          </h1>
          <p className="pagehead__subtitle" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Last updated: 9/01/2026
          </p>
        </div>
      </section>

      {/* PRIVACY CONTENT */}
      <section className="container" style={{ padding: '2rem 0 4rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          background: 'var(--card)', 
          padding: '2rem', 
          borderRadius: '12px',
          border: '1px solid var(--line)'
        }}>
          <p style={{ marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6', color: 'var(--text)' }}>
            FreshillyMeal respects your privacy.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 600, 
              marginBottom: '0.75rem',
              color: 'var(--text)'
            }}>
              1. Information We Collect
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)',
              marginBottom: '0.5rem'
            }}>
              We may collect basic information such as:
            </p>
            <ul style={{ 
              listStyle: 'disc', 
              paddingLeft: '1.5rem',
              fontSize: '1rem',
              lineHeight: '1.7',
              color: 'var(--text)'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>Name</li>
              <li style={{ marginBottom: '0.5rem' }}>Email address</li>
              <li style={{ marginBottom: '0.5rem' }}>Location</li>
              <li style={{ marginBottom: '0.5rem' }}>Account details</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 600, 
              marginBottom: '0.75rem',
              color: 'var(--text)'
            }}>
              2. How We Use Information
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)',
              marginBottom: '0.5rem'
            }}>
              We use your information to:
            </p>
            <ul style={{ 
              listStyle: 'disc', 
              paddingLeft: '1.5rem',
              fontSize: '1rem',
              lineHeight: '1.7',
              color: 'var(--text)'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>Provide platform functionality</li>
              <li style={{ marginBottom: '0.5rem' }}>Communicate with users</li>
              <li style={{ marginBottom: '0.5rem' }}>Improve our services</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 600, 
              marginBottom: '0.75rem',
              color: 'var(--text)'
            }}>
              3. Cookies
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              We may use cookies for basic functionality and analytics.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 600, 
              marginBottom: '0.75rem',
              color: 'var(--text)'
            }}>
              4. Data Sharing
            </h2>
            <ul style={{ 
              listStyle: 'disc', 
              paddingLeft: '1.5rem',
              fontSize: '1rem',
              lineHeight: '1.7',
              color: 'var(--text)'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>We do not sell or rent personal data.</li>
              <li style={{ marginBottom: '0.5rem' }}>We only share data if required by law.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 600, 
              marginBottom: '0.75rem',
              color: 'var(--text)'
            }}>
              5. Data Security
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              We take reasonable steps to protect user data but cannot guarantee absolute security.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 600, 
              marginBottom: '0.75rem',
              color: 'var(--text)'
            }}>
              6. Your Rights
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              You may request access, correction, or deletion of your data by contacting us.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 600, 
              marginBottom: '0.75rem',
              color: 'var(--text)'
            }}>
              7. Contact Information
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)',
              marginBottom: '0.5rem'
            }}>
              For privacy-related questions, contact:
            </p>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              📧 <a href="mailto:tiffianhub@gmail.com" style={{ color: '#6366f1', textDecoration: 'none' }}>tiffianhub@gmail.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ marginTop: '4rem' }}>
        <div className="container footer__grid">
          <div>
            <h4 className="footer__title">FreshillyMeal</h4>
            <p className="muted">Connecting hungry customers with local tiffin service providers since 2025.</p>
          </div>
          <div>
            <h5 className="footer__subtitle">Quick Links</h5>
            <ul className="linklist">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#listings">Browse Tiffins</Link></li>
              <li><Link href="/auth" className="btn btn--dark">Become a Provider</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="footer__subtitle">Support</h5>
            <ul className="linklist">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="footer__subtitle">Contact Us</h5>
            <ul className="contactlist">
              <li>
                <a href="mailto:tiffianhub@gmail.com" style={{ color: '#4a5568' }}>
                  tiffianhub@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container footer__bar">© 2025 FreshillyMeal. All rights reserved.</div>
      </footer>
    </div>
  );
}

