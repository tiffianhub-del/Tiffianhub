'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
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
          <h1 className="pagehead__title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            About Us
          </h1>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="container" style={{ padding: '2rem 0 4rem 0', maxWidth: '800px', margin: '0 auto' }}>
        {/* Who We Are */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '2rem', 
          borderRadius: '12px',
          border: '1px solid var(--line)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text)'
          }}>
            Who We Are
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            marginBottom: '1rem'
          }}>
            FreshillyMeal is a community-driven platform that connects people looking for homemade tiffin services with independent local food providers.
          </p>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)'
          }}>
            We created FreshillyMeal to make it easier for students, professionals, and families to discover nearby tiffin services without the hassle of searching across multiple platforms.
          </p>
        </div>

        {/* What We Do */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '2rem', 
          borderRadius: '12px',
          border: '1px solid var(--line)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text)'
          }}>
            What We Do
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            marginBottom: '0.75rem'
          }}>
            FreshillyMeal acts as a listing and discovery platform.
          </p>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '1.5rem',
            fontSize: '1rem',
            lineHeight: '1.7',
            color: 'var(--text)',
            marginBottom: '0.75rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>We help customers find local tiffin service providers</li>
            <li style={{ marginBottom: '0.5rem' }}>We help providers showcase their services and reach more customers</li>
            <li style={{ marginBottom: '0.5rem' }}>We make connections simple, transparent, and local</li>
          </ul>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            fontWeight: 500,
            marginTop: '0.75rem'
          }}>
            FreshillyMeal does not prepare food, deliver meals, or handle payments.
          </p>
        </div>

        {/* How It Works */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '2rem', 
          borderRadius: '12px',
          border: '1px solid var(--line)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text)'
          }}>
            How It Works
          </h2>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '1.5rem',
            fontSize: '1rem',
            lineHeight: '1.7',
            color: 'var(--text)'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Providers list their tiffin services with service locations</li>
            <li style={{ marginBottom: '0.5rem' }}>Customers browse and discover providers</li>
            <li style={{ marginBottom: '0.5rem' }}>Customers contact providers directly</li>
            <li style={{ marginBottom: '0.5rem' }}>All pricing, payment, and delivery details are handled directly between them</li>
          </ul>
        </div>

        {/* Our Mission */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '2rem', 
          borderRadius: '12px',
          border: '1px solid var(--line)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text)'
          }}>
            Our Mission
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            marginBottom: '0.75rem'
          }}>
            Our mission is to support local food providers while helping customers find reliable, nearby tiffin services with ease.
          </p>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)'
          }}>
            We believe local food businesses deserve visibility, and customers deserve simple access to them.
          </p>
        </div>

        {/* Transparency & Responsibility */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '2rem', 
          borderRadius: '12px',
          border: '1px solid var(--line)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text)'
          }}>
            Transparency & Responsibility
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            marginBottom: '0.75rem'
          }}>
            FreshillyMeal is a connection platform only.
          </p>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            marginBottom: '0.75rem'
          }}>
            All providers listed on FreshillyMeal operate independently and are responsible for:
          </p>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '1.5rem',
            fontSize: '1rem',
            lineHeight: '1.7',
            color: 'var(--text)',
            marginBottom: '0.75rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Food quality and hygiene</li>
            <li style={{ marginBottom: '0.5rem' }}>Pricing and payments</li>
            <li style={{ marginBottom: '0.5rem' }}>Delivery and customer service</li>
            <li style={{ marginBottom: '0.5rem' }}>Compliance with local regulations</li>
          </ul>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)'
          }}>
            We encourage users to communicate clearly and make informed decisions.
          </p>
        </div>

        {/* Why FreshillyMeal */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '2rem', 
          borderRadius: '12px',
          border: '1px solid var(--line)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: 'var(--text)'
          }}>
            Why FreshillyMeal
          </h2>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '1.5rem',
            fontSize: '1rem',
            lineHeight: '1.7',
            color: 'var(--text)'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Local-first approach</li>
            <li style={{ marginBottom: '0.5rem' }}>Simple and easy-to-use platform</li>
            <li style={{ marginBottom: '0.5rem' }}>No hidden commissions</li>
            <li style={{ marginBottom: '0.5rem' }}>Direct connection between customers and providers</li>
          </ul>
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

