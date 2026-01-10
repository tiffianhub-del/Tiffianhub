'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/styles.css';

export const dynamic = 'force-dynamic';

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showKitchenNameModal, setShowKitchenNameModal] = useState(false);
  const [kitchenName, setKitchenName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, title-asc, title-desc, price-asc, price-desc
  const [isMobile, setIsMobile] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set dark mode and get token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = 'dark';
      // Always get the latest token from localStorage
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        // Only redirect if we're sure there's no token
        // Don't set error immediately, wait a bit in case token is being set
        setTimeout(() => {
          const checkToken = localStorage.getItem('token');
          if (!checkToken) {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            router.push('/auth');
          } else {
            setToken(checkToken);
          }
        }, 100);
      }
      
      // Check if mobile
      const checkMobile = () => setIsMobile(window.innerWidth <= 640);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [router]);

  // Refresh token from localStorage whenever component is focused (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      }
    };

    // Also check on visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (!document.hidden && typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token]);

  // Fetch user & listings from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Always check localStorage first in case token state is stale
      const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      
      if (!currentToken) {
        setLoading(false);
        // Double check after a short delay
        setTimeout(() => {
          const checkToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (!checkToken) {
            setError('No authentication token found. Please log in.');
            router.push('/auth');
          } else {
            setToken(checkToken);
          }
        }, 100);
        return;
      }
      
      // Update token state if it was retrieved from localStorage
      if (currentToken !== token) {
        setToken(currentToken);
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
          headers: { Authorization: `Bearer ${currentToken}` },
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
          headers: { Authorization: `Bearer ${currentToken || token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setListings(data.listings || []);
        } else {
          if (res.status === 401) {
            // Token invalid, redirect to login
            localStorage.removeItem('token');
            router.push('/auth');
            return;
          }
          setError(data.message || 'Failed to fetch listings');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Don't clear token on network errors, only on auth errors
        if (err.message && (err.message.includes('401') || err.message.includes('unauthorized'))) {
          localStorage.removeItem('token');
          router.push('/auth');
          return;
        }
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
      if (showUserMenu && !event.target.closest('[data-user-menu-container]')) {
        setShowUserMenu(false);
      }
      if (showFilterDropdown && !event.target.closest('[data-filter-dropdown]')) {
        setShowFilterDropdown(false);
      }
      if (showSortDropdown && !event.target.closest('[data-sort-dropdown]')) {
        setShowSortDropdown(false);
      }
    };

    if (showNotifications || showUserMenu || showFilterDropdown || showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications, showUserMenu, showFilterDropdown, showSortDropdown]);

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

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
      case 'date-asc':
        return new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0);
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '');
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '');
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

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
    router.push(`/list?id=${id}`);
  };

  // Get initials
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0].toUpperCase()).slice(0,2).join('');
  };

  // Handle kitchen name update
  const handleUpdateKitchenName = async () => {
    if (!kitchenName.trim()) {
      alert('Kitchen name cannot be empty');
      return;
    }

    setIsUpdatingName(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: kitchenName.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update user state
        setUser(data.user);
        setShowKitchenNameModal(false);
        setKitchenName('');
        alert('Kitchen name updated successfully!');
      } else {
        alert(`Error: ${data.message || 'Failed to update kitchen name'}`);
      }
    } catch (err) {
      console.error('Error updating kitchen name:', err);
      alert('Network error. Please try again later.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  // Open kitchen name modal
  const handleOpenKitchenNameModal = () => {
    setKitchenName(user?.name || '');
    setShowKitchenNameModal(true);
    setShowUserMenu(false);
  };

  // Handle profile photo upload
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle profile photo update
  const handleUpdateProfilePhoto = async () => {
    if (!profilePhoto) {
      alert('Please select an image');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: profilePhoto }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update user state
        setUser(data.user);
        setShowProfilePhotoModal(false);
        setProfilePhoto(null);
        alert('Profile photo updated successfully!');
      } else {
        alert(`Error: ${data.message || 'Failed to update profile photo'}`);
      }
    } catch (err) {
      console.error('Error updating profile photo:', err);
      alert('Network error. Please try again later.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Open profile photo modal
  const handleOpenProfilePhotoModal = () => {
    setProfilePhoto(user?.avatar || null);
    setShowProfilePhotoModal(true);
    setShowUserMenu(false);
  };

  // Remove profile photo
  const handleRemoveProfilePhoto = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: null }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setProfilePhoto(null);
        alert('Profile photo removed successfully!');
      } else {
        alert(`Error: ${data.message || 'Failed to remove profile photo'}`);
      }
    } catch (err) {
      console.error('Error removing profile photo:', err);
      alert('Network error. Please try again later.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowChangePasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Password changed successfully!');
      } else {
        alert(`Error: ${data.message || 'Failed to change password'}`);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Network error. Please try again later.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle set password (for Google users without password)
  const handleSetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Password and confirm password do not match');
      return;
    }

    setIsSettingPassword(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/set-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowSetPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        alert('Password set successfully! You can now use the Change Password feature.');
        // Refresh user data to reflect password is now set
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }
      } else {
        alert(`Error: ${data.message || 'Failed to set password'}`);
      }
    } catch (err) {
      console.error('Error setting password:', err);
      alert('Network error. Please try again later.');
    } finally {
      setIsSettingPassword(false);
    }
  };

  // Open change password modal
  const handleOpenChangePasswordModal = () => {
    // Debug: Log user object to see what we have
    console.log('User object:', user);
    console.log('hasPassword:', user?.hasPassword);
    
    // Check if user has password (using hasPassword flag from backend)
    // Also check if hasPassword is explicitly false or undefined
    if (!user || user.hasPassword === false || user.hasPassword === undefined) {
      // User doesn't have password, show set password modal instead
      console.log('Showing Set Password modal');
      setShowSetPasswordModal(true);
      setShowUserMenu(false);
    } else {
      // User has password, show change password modal
      console.log('Showing Change Password modal');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePasswordModal(true);
      setShowUserMenu(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    // Require user to type "DELETE" to confirm
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type "DELETE" (in uppercase) to confirm account deletion');
      return;
    }

    setIsDeletingAccount(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        alert('Your account has been deleted successfully.');
        router.push('/auth');
      } else {
        alert(`Error: ${data.message || 'Failed to delete account'}`);
        setIsDeletingAccount(false);
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Network error. Please try again later.');
      setIsDeletingAccount(false);
    }
  };

  // Open delete account modal
  const handleOpenDeleteAccountModal = () => {
    setDeleteConfirmText('');
    setShowDeleteAccountModal(true);
    setShowUserMenu(false);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Close the menu
    setShowUserMenu(false);
    // Redirect to auth page
    router.push('/auth');
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
                minWidth: isMobile ? 'calc(100vw - 2rem)' : '320px',
                maxWidth: isMobile ? 'calc(100vw - 2rem)' : '400px',
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
          <div style={{ position: 'relative' }} data-user-menu-container>
            <div 
              className="row" 
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="avatar" 
                style={{
                  backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!user?.avatar && (user ? getInitials(user.name) : '??')}
              </div>
              <div className="small">{user ? `${user.name}'s Kitchen ▾` : 'Loading...'}</div>
            </div>
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow)',
                minWidth: isMobile ? 'calc(100vw - 2rem)' : '280px',
                maxWidth: isMobile ? 'calc(100vw - 2rem)' : '320px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--line)',
                  background: 'var(--elev)'
                }}>
                  <strong style={{ color: 'var(--text)', fontSize: '14px' }}>Account Management</strong>
                </div>
                <div style={{ padding: '8px 0' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenKitchenNameModal();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--elev)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span></span>
                    <span>Kitchen Name</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenProfilePhotoModal();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--elev)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span></span>
                    <span>Profile Photo / Logo</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenChangePasswordModal();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--elev)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span></span>
                    <span>Change Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--elev)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span></span>
                    <span>Logout</span>
                  </button>
                  <div style={{
                    borderTop: '1px solid var(--line)',
                    marginTop: '4px',
                    paddingTop: '4px'
                  }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenDeleteAccountModal();
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <span></span>
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
        
        {/* Filter Button with Dropdown */}
        <div style={{ position: 'relative' }} data-filter-dropdown>
          <button 
            className="btn" 
            type="button" 
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowFilterDropdown(!showFilterDropdown);
              setShowSortDropdown(false);
            }}
          >
            ⚙ Filter
          </button>
          {showFilterDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '12px',
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>
                Filter by Status:
              </div>
              <select
                className="input"
                style={{ width: '100%', marginBottom: '12px' }}
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setShowFilterDropdown(false);
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--muted)' }}>
                Search is already applied in the search box above.
              </div>
            </div>
          )}
        </div>

        {/* Sort Button with Dropdown */}
        <div style={{ position: 'relative' }} data-sort-dropdown>
          <button 
            className="btn" 
            type="button" 
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSortDropdown(!showSortDropdown);
              setShowFilterDropdown(false);
            }}
          >
            ⇅ Sort
          </button>
          {showSortDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '12px',
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>
                Sort by:
              </div>
              <button
                type="button"
                onClick={() => {
                  setSortBy('date-desc');
                  setShowSortDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '4px',
                  textAlign: 'left',
                  background: sortBy === 'date-desc' ? 'var(--elev)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Date (Newest First)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy('date-asc');
                  setShowSortDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '4px',
                  textAlign: 'left',
                  background: sortBy === 'date-asc' ? 'var(--elev)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Date (Oldest First)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy('title-asc');
                  setShowSortDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '4px',
                  textAlign: 'left',
                  background: sortBy === 'title-asc' ? 'var(--elev)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Title (A-Z)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy('title-desc');
                  setShowSortDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '4px',
                  textAlign: 'left',
                  background: sortBy === 'title-desc' ? 'var(--elev)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Title (Z-A)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy('price-asc');
                  setShowSortDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '4px',
                  textAlign: 'left',
                  background: sortBy === 'price-asc' ? 'var(--elev)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Price (Low to High)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy('price-desc');
                  setShowSortDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  textAlign: 'left',
                  background: sortBy === 'price-desc' ? 'var(--elev)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Price (High to Low)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <section className="grid">
        {sortedListings.map(l => (
          <article key={l._id} className="card-listing">
            <div className="card-header">
              <div>
                <div className="card-title">{l.title}</div>
                <div className="card-price">
                  CAD ${l.price} <span className="meta">{l.unit}</span>
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

      {/* Kitchen Name Edit Modal */}
      {showKitchenNameModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => setShowKitchenNameModal(false)}
        >
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: '1.5rem' }}>
              Edit Kitchen Name
            </h2>
            <p style={{ margin: '0 0 20px 0', color: 'var(--muted)', fontSize: '14px' }}>
              Update your kitchen name. This will be displayed as "{kitchenName || user?.name}'s Kitchen" in the dashboard.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text)', 
                fontSize: '14px',
                fontWeight: 600
              }}>
                Kitchen Name
              </label>
              <input
                type="text"
                value={kitchenName}
                onChange={(e) => setKitchenName(e.target.value)}
                placeholder="Enter kitchen name"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateKitchenName();
                  }
                  if (e.key === 'Escape') {
                    setShowKitchenNameModal(false);
                  }
                }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowKitchenNameModal(false);
                  setKitchenName('');
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
                disabled={isUpdatingName}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateKitchenName}
                disabled={isUpdatingName || !kitchenName.trim()}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  background: isUpdatingName || !kitchenName.trim() 
                    ? 'var(--muted)' 
                    : 'linear-gradient(135deg, #6366f1, #22d3ee)',
                  color: '#fff',
                  cursor: isUpdatingName || !kitchenName.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  opacity: isUpdatingName || !kitchenName.trim() ? 0.6 : 1
                }}
              >
                {isUpdatingName ? 'Updating...' : 'Update Name'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Photo Upload Modal */}
      {showProfilePhotoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => setShowProfilePhotoModal(false)}
        >
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: '1.5rem' }}>
              Profile Photo / Logo
            </h2>
            <p style={{ margin: '0 0 20px 0', color: 'var(--muted)', fontSize: '14px' }}>
              Upload a profile photo or logo for your kitchen. Maximum file size: 5MB
            </p>
            
            {/* Current/Preview Photo */}
            <div style={{ 
              marginBottom: '20px', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              {(profilePhoto || user?.avatar) ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={profilePhoto || user?.avatar}
                    alt="Profile preview"
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--line)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'var(--elev)',
                  border: '3px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: 'var(--muted)'
                }}>
                  {user ? getInitials(user.name) : '👤'}
                </div>
              )}
            </div>

            {/* File Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text)', 
                fontSize: '14px',
                fontWeight: 600
              }}>
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                disabled={isUploadingPhoto}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {(profilePhoto || user?.avatar) && (
                <button
                  type="button"
                  onClick={handleRemoveProfilePhoto}
                  disabled={isUploadingPhoto}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #ef4444',
                    borderRadius: '10px',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: isUploadingPhoto ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    opacity: isUploadingPhoto ? 0.6 : 1
                  }}
                >
                  Remove Photo
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowProfilePhotoModal(false);
                  setProfilePhoto(null);
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
                disabled={isUploadingPhoto}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProfilePhoto}
                disabled={isUploadingPhoto || !profilePhoto}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  background: isUploadingPhoto || !profilePhoto
                    ? 'var(--muted)' 
                    : 'linear-gradient(135deg, #6366f1, #22d3ee)',
                  color: '#fff',
                  cursor: isUploadingPhoto || !profilePhoto ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  opacity: isUploadingPhoto || !profilePhoto ? 0.6 : 1
                }}
              >
                {isUploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => setShowChangePasswordModal(false)}
        >
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: '1.5rem' }}>
              Change Password
            </h2>
            <p style={{ margin: '0 0 20px 0', color: 'var(--muted)', fontSize: '14px' }}>
              Enter your current password and choose a new password.
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text)', 
                fontSize: '14px',
                fontWeight: 600
              }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none'
                }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text)', 
                fontSize: '14px',
                fontWeight: 600
              }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text)', 
                fontSize: '14px',
                fontWeight: 600
              }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleChangePassword();
                  }
                  if (e.key === 'Escape') {
                    setShowChangePasswordModal(false);
                  }
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
                disabled={isChangingPassword}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  background: isChangingPassword || !currentPassword || !newPassword || !confirmPassword
                    ? 'var(--muted)' 
                    : 'linear-gradient(135deg, #6366f1, #22d3ee)',
                  color: '#fff',
                  cursor: isChangingPassword || !currentPassword || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  opacity: isChangingPassword || !currentPassword || !newPassword || !confirmPassword ? 0.6 : 1
                }}
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Password Modal (for Google users without password) */}
      {showSetPasswordModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => setShowSetPasswordModal(false)}
        >
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: '1.5rem' }}>
              Set Password
            </h2>
            <div style={{
              padding: '12px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, color: 'var(--text)', fontSize: '14px', lineHeight: '1.5' }}>
                You logged in using Google and don't have a password set yet. Please create a password to enable the Change Password feature.
              </p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text)', 
                fontSize: '14px',
                fontWeight: 600
              }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none'
                }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text)', 
                fontSize: '14px',
                fontWeight: 600
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSetPassword();
                  }
                  if (e.key === 'Escape') {
                    setShowSetPasswordModal(false);
                  }
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowSetPasswordModal(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
                disabled={isSettingPassword}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSetPassword}
                disabled={isSettingPassword || !newPassword || !confirmPassword}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  background: isSettingPassword || !newPassword || !confirmPassword
                    ? 'var(--muted)' 
                    : 'linear-gradient(135deg, #6366f1, #22d3ee)',
                  color: '#fff',
                  cursor: isSettingPassword || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  opacity: isSettingPassword || !newPassword || !confirmPassword ? 0.6 : 1
                }}
              >
                {isSettingPassword ? 'Setting...' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => !isDeletingAccount && setShowDeleteAccountModal(false)}
        >
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', color: '#ef4444', fontSize: '1.5rem' }}>
              Delete Account
            </h2>
            <div style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, color: 'var(--text)', fontSize: '14px', lineHeight: '1.5', fontWeight: 600 }}>
                ⚠️ Warning: This action cannot be undone!
              </p>
              <p style={{ margin: '8px 0 0 0', color: 'var(--text)', fontSize: '14px', lineHeight: '1.5' }}>
                Deleting your account will permanently remove:
              </p>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: 'var(--text)', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Your account and profile information</li>
                <li>All your listings</li>
                <li>All your notifications</li>
              </ul>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text)', 
                fontSize: '14px',
                fontWeight: 600
              }}>
                Type <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                disabled={isDeletingAccount}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (!isDeletingAccount) {
                      setShowDeleteAccountModal(false);
                      setDeleteConfirmText('');
                    }
                  }
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeletingAccount}
                style={{
                  padding: '12px 24px',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  cursor: isDeletingAccount ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  opacity: isDeletingAccount ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || deleteConfirmText !== 'DELETE'}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '10px',
                  background: deleteConfirmText === 'DELETE' && !isDeletingAccount ? '#ef4444' : '#6b7280',
                  color: 'white',
                  cursor: (isDeletingAccount || deleteConfirmText !== 'DELETE') ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'background 0.2s'
                }}
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
