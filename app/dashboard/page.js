'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/styles.css';

export default function Dashboard() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null); // Added for user info
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch user & listings from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) return;

        // Fetch user
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch listings
        const res = await fetch('http://localhost:5000/api/listings/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setListings(data.listings || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddListing = () => router.push('/list'); // Navigate to add-listing page

  // Filters
  const filteredListings = listings.filter(l =>
    (statusFilter === 'all' || l.status === statusFilter) &&
    (l.title.toLowerCase().includes(search.toLowerCase()) ||
     l.details.toLowerCase().includes(search.toLowerCase()))
  );

  // Actions
  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
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
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setListings(listings.filter(l => l._id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const handleEdit = (id) => toast('Edit listing ' + id);

  // Get initials
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0].toUpperCase()).slice(0,2).join('');
  };


  return (
    <div className="container">
      {/* Navbar */}
      <header className="navbar">
        <div className="brand-sm">
          <div className="logo" style={{ width: 30, height: 30, fontSize: 14 }}>🍴</div>
          <div>TiffinHub</div>
        </div>
        <div className="userbox">
          <button className="icon-btn" title="Notifications">🔔</button>
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
              fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round"/>
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

        <button className="btn btn-primary" onClick={handleAddListing}>
          ＋ Add New Listing
        </button>
        <button className="btn">⚙ Filter</button>
        <button className="btn">⇅ Sort</button>
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
                <button className="icon-btn" onClick={() => handleEdit(l._id)} title="Edit">✏</button>
                <button className="icon-btn" onClick={() => handleDelete(l._id)} title="Delete">🗑</button>
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
