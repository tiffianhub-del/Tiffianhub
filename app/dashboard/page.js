'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/styles.css';

export default function Dashboard() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null); // Added for user info
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set dark mode and get token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = 'dark';
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      if (!storedToken) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
      }
    }
  }, []);

  // Fetch user & listings from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) {
          if (userRes.status === 401) {
            // Token invalid, redirect to login
            localStorage.removeItem('token');
            router.push('/auth');
            return;
          }
          throw new Error('Failed to fetch user');
        }
        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch listings
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setListings(data.listings || []);
        } else {
          setError(data.message || 'Failed to fetch listings');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, router]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('[data-notification-container]')) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  const handleAddListing = () => router.push('/list'); // Navigate to add-listing page

  const handleMarkAsRead = async (notificationId) => {
    if (!token) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(notifications.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Filters
  const filteredListings = listings.filter(l =>
    (statusFilter === 'all' || l.status === statusFilter) &&
    (l.title.toLowerCase().includes(search.toLowerCase()) ||
     l.details.toLowerCase().includes(search.toLowerCase()))
  );

  // Actions
  const toggleStatus = async (id, currentStatus) => {
    if (!token) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' }),
      });
      if (res.ok) {
        setListings(listings.map(l =>
          l._id === id ? { ...l, status: currentStatus === 'active' ? 'inactive' : 'active' } : l
        ));
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setListings(listings.filter(l => l._id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const handleEdit = (id) => {
    // TODO: Implement edit functionality
    console.log('Edit listing:', id);
  };

  // Get initials
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0].toUpperCase()).slice(0,2).join('');
  };


  // Show loading state
  if (loading) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button className="btn btn-primary" onClick={() => router.push('/auth')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      {/* Navbar */}
      <header className="navbar" style={{ position: 'relative', zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-sm" style={{ cursor: 'pointer' }}>
            <div className="logo" style={{ width: 30, height: 30, fontSize: 14 }}>🍴</div>
            <div>FreshillyMeal</div>
          </div>
        </Link>
        <div className="userbox" style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          <div style={{ position: 'relative' }} data-notification-container>
            <button 
              className="icon-btn" 
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: 'pointer' }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow)',
                minWidth: '320px',
                maxWidth: '400px',
                maxHeight: '500px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <strong style={{ color: 'var(--text)' }}>Notifications</strong>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif._id}
                        onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--line)',
                          background: notif.read ? 'transparent' : 'var(--elev)',
                          cursor: notif.read ? 'default' : 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: notif.read ? 400 : 600, 
                              color: 'var(--text)',
                              marginBottom: '4px'
                            }}>
                              New message from {notif.fromName}
                            </div>
                            <div style={{ 
                              fontSize: '13px', 
                              color: 'var(--muted)',
                              marginBottom: '4px'
                            }}>
                              About: {notif.listing?.title || 'Listing'}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: 'var(--muted)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {notif.message}
                            </div>
                            <div style={{ 
                              fontSize: '11px', 
                              color: 'var(--muted)',
                              marginTop: '6px'
                            }}>
                              {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {!notif.read && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#3b82f6',
                              flexShrink: 0,
                              marginTop: '4px'
                            }}></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="row">
            <div className="avatar">{user ? getInitials(user.name) : '??'}</div>
            <div className="small">{user ? `${user.name}'s Kitchen ▾` : 'Loading...'}</div>
          </div>
        </div>
      </header>

      <h1 style={{ margin: '6px 0 4px' }}>Provider Dashboard</h1>
      <div className="small">Manage your tiffin service listings</div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="input"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input"
          style={{ maxWidth: 160 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div style={{ flex: 1 }}></div>

        <button 
          className="btn btn-primary" 
          onClick={handleAddListing}
          type="button"
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
        >
          ＋ Add New Listing
        </button>
        <button className="btn" type="button" style={{ cursor: 'pointer' }}>⚙ Filter</button>
        <button className="btn" type="button" style={{ cursor: 'pointer' }}>⇅ Sort</button>
      </div>

      {/* Listings Grid */}
      <section className="grid">
        {filteredListings.map(l => (
          <article key={l._id} className="card-listing">
            <div className="card-header">
              <div>
                <div className="card-title">{l.title}</div>
                <div className="card-price">
                  ₹{l.price} <span className="meta">{l.unit}</span>
                </div>
              </div>
            </div>

            <div className="small" style={{ marginTop: 12 }}>Menu Details</div>
            <div className="meta">{l.details}</div>

            <div className="meta-row">
              <div>
                <div className="small">Days Available</div>
                <div className="row">
                  {l.days.map(d => <span key={d} className="meta-tag">{d}</span>)}
                </div>
              </div>
              <div>
                <div className="small">Delivery Method</div>
                <span className="meta-tag">{l.method}</span>
              </div>
            </div>

            <div className="card-actions">
              <div className="row">
                <button 
                  className="icon-btn" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEdit(l._id);
                  }} 
                  title="Edit"
                  type="button"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  ✏
                </button>
                <button 
                  className="icon-btn" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(l._id);
                  }} 
                  title="Delete"
                  type="button"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  🗑
                </button>
              </div>
              <div className="row">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={l.status==='active'}
                    onChange={() => toggleStatus(l._id, l.status)}
                  />
                  <span className="slider"></span>
                </label>
                <span className="status-label">{l.status==='active' ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
