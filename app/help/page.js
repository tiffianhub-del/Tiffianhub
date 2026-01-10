'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HelpPage() {
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
          <h1 className="pagehead__title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>HELP CENTER</h1>
        </div>
      </section>

      {/* HELP CONTENT */}
      <section className="container" style={{ padding: '2rem 0 4rem 0', maxWidth: '800px', margin: '0 auto' }}>
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
            marginBottom: '1.5rem',
            color: 'var(--text)'
          }}>
            How It Works
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            marginBottom: '1rem'
          }}>
            FreshillyMeal is a listing platform that connects customers with independent local tiffin service providers.
          </p>
          <ul style={{ 
            listStyle: 'disc', 
            paddingLeft: '1.5rem',
            fontSize: '1rem',
            lineHeight: '1.7',
            color: 'var(--text)'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>We do not prepare food</li>
            <li style={{ marginBottom: '0.5rem' }}>We do not deliver food</li>
            <li style={{ marginBottom: '0.5rem' }}>We do not handle payments</li>
            <li style={{ marginBottom: '0.5rem' }}>All communication, payment, and delivery are handled directly between customers and providers</li>
            <li style={{ marginBottom: '0.5rem' }}>FreshillyMeal only provides visibility and connection.</li>
          </ul>
        </div>

        {/* Customer FAQs */}
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
            marginBottom: '1.5rem',
            color: 'var(--text)'
          }}>
            Customer FAQs
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              How do I order food?
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              FreshillyMeal does not take orders. You must contact the provider directly using the details on their listing.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              How do I pay?
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              Payment is handled directly with the provider using their preferred method.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              Is FreshillyMeal responsible for food quality or delivery?
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              No. Providers are independent businesses and are responsible for food quality, pricing, and delivery.
            </p>
          </div>

          <div style={{ marginBottom: '0' }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              What if I have an issue with a provider?
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              We recommend resolving it directly with the provider. You may report a listing if it violates our guidelines.
            </p>
          </div>
        </div>

        {/* Provider FAQs */}
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
            marginBottom: '1.5rem',
            color: 'var(--text)'
          }}>
            Provider FAQs
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              How do I list my tiffin service?
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              Create an account and add your service details and service locations.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              Who handles payment and delivery?
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              You do. FreshillyMeal does not participate in transactions.
            </p>
          </div>

          <div style={{ marginBottom: '0' }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              Can my listing be removed?
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.7', 
              color: 'var(--text)'
            }}>
              Yes. Listings may be removed if they violate our community guidelines or receive repeated complaints.
            </p>
          </div>
        </div>

        {/* Contact Support */}
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
            marginBottom: '1.5rem',
            color: 'var(--text)'
          }}>
            Contact Support
          </h2>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            marginBottom: '0.5rem'
          }}>
            For technical issues or reporting a listing, contact us at:
          </p>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            marginBottom: '0.5rem'
          }}>
            📧 <a href="mailto:tiffianhub@gmail.com" style={{ color: '#6366f1', textDecoration: 'none' }}>tiffianhub@gmail.com</a>
          </p>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)'
          }}>
            Response time: 24–48 hours
          </p>
        </div>

        {/* Important Notice */}
        <div style={{ 
          background: 'rgba(99, 102, 241, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            marginBottom: '0.75rem',
            color: 'var(--text)'
          }}>
            Important Notice
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            color: 'var(--text)',
            margin: 0
          }}>
            FreshillyMeal is a listing platform only and is not responsible for food preparation, delivery, payments, or disputes.
          </p>
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

