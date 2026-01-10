'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from 'react-dom';


// Modal component - renders via portal into document.body
function Modal({ isOpen, onClose, listing, formData, setFormData, onSubmit, onChange, isLoading}) {
  useEffect(() => {
    if (!isOpen) return;
    // close on Escape
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    // prevent body scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.36)', // darken
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 16,
  };

  const cardStyle = {
    width: 420,
    maxWidth: '100%',
    background: '#fff',
    borderRadius: 14,
    padding: 22,
    boxShadow: '0 18px 40px rgba(2,6,23,0.25)',
    position: 'relative',
  };

  const inputStyle = { width: '100%', padding: '10px 12px', marginBottom: 12, borderRadius: 8, border: '1px solid #e2e8f0' };
  const btnPrimary = { background: '#0ea5e9', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer' };
  const btnGhost = { background: 'transparent', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: 8, cursor: 'pointer' };

  return createPortal(
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', right: 12, top: 10, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}
        >
          ×
        </button>

        <h3 style={{ margin: 0, marginBottom: 10 }}>Contact {listing?.title || 'Provider'} Provider</h3>
        <p style={{ margin: 0, marginBottom: 14, color: '#475569', fontSize: 13 }}>
          Send a message and the provider will receive an email.
        </p>

        <form onSubmit={onSubmit}>
          <input name="name" placeholder="Your name" value={formData.name} onChange={onChange} style={inputStyle} required />
          <input name="email" type="email" placeholder="Your email" value={formData.email} onChange={onChange} style={inputStyle} required />
          <textarea name="message" placeholder="Your message" value={formData.message} onChange={onChange} rows={5} style={{ ...inputStyle, resize: 'vertical' }} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
            <button type="submit" style={btnPrimary} disabled={isLoading}>
  {isLoading ? "Sending..." : "Send"}
</button>

          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function RatingModal({ isOpen, onClose, listing, rating, setRating, onSubmitRating }) {
  const [hoverRating, setHoverRating] = useState(0); // for hover preview

  if (!isOpen) return null;

  const stars = [1, 2, 3, 4, 5];

  const handleStarClick = (e, star) => {
    const { left, width } = e.target.getBoundingClientRect();
    const clickX = e.clientX - left;
    const newRating = clickX < width / 2 ? star - 0.5 : star;
    setRating(newRating);
  };

  const handleStarHover = (e, star) => {
    const { left, width } = e.target.getBoundingClientRect();
    const hoverValue = e.clientX - left < width / 2 ? star - 0.5 : star;
    setHoverRating(hoverValue);
  };

  const handleMouseLeave = () => setHoverRating(0);

  const displayedRating = hoverRating || rating;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          width: 360,
          maxWidth: "100%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          textAlign: "center",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            border: "none",
            background: "transparent",
            fontSize: 22,
            cursor: "pointer",
            color: "#374151",
          }}
        >
          ×
        </button>

        <h3 style={{ margin: 0, marginBottom: 16, fontSize: 20, fontWeight: 600 }}>
          Rate {listing?.title}
        </h3>

        <div
          style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}
          onMouseLeave={handleMouseLeave}
        >
          {stars.map((star) => (
            <span
              key={star}
              style={{
                fontSize: 32,
                cursor: "pointer",
                color: star <= displayedRating ? "#facc15" : "#cbd5e1",
                transition: "color 0.2s",
              }}
              onMouseMove={(e) => handleStarHover(e, star)}
              onClick={(e) => handleStarClick(e, star)}
            >
              ★
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            onSubmitRating(listing._id, rating);
            onClose();
          }}
          style={{
            background: "#0ea5e9",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            width: "100%",
          }}
        >
          Submit Rating
        </button>
      </motion.div>
    </div>,
    document.body
  );
}




function Carousel({ images }) {
  const [current, setCurrent] = React.useState(0);

  // Auto-slide every 3s
  React.useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full h-[180px] rounded-lg bg-gray-200 flex items-center justify-center"
      >
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
      {/* Active Image */}
      <img
        src={images[current]}
        alt={`Slide ${current + 1}`}
        className="w-full h-full object-contain transition-all duration-700"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === current ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={"full-" + i} style={{ color: "#facc15", fontSize: 16 }}>★</span>
      ))}
      {halfStar && <span style={{ color: "#facc15", fontSize: 16 }}>☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={"empty-" + i} style={{ color: "#cbd5e1", fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

// DropdownMenu component using portals to escape stacking contexts
function DropdownMenu({ isOpen, onClose, buttonRef, children, align = 'left', menuId }) {
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 200, right: 0 });
  const [isPositioned, setIsPositioned] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen || !buttonRef?.current || typeof window === 'undefined') {
      setIsPositioned(false);
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 200),
        right: window.innerWidth - rect.right
      });
      setIsPositioned(true);
    };

    // Small delay to ensure button is rendered
    const timeoutId = setTimeout(() => {
      updatePosition();
    }, 10);

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    // Use capture phase to catch scroll events in all containers
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      setIsPositioned(false);
    };
  }, [isOpen, buttonRef, align]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      // Don't close if clicking the button or inside the menu
      if (buttonRef?.current?.contains(e.target)) {
        return;
      }
      
      // Don't close if clicking inside this specific menu
      const menu = document.querySelector(`[data-dropdown-menu="${menuId}"]`);
      if (menu && menu.contains(e.target)) {
        return;
      }
      
      // Close if clicking outside both button and menu
      onClose();
    };

    // Use setTimeout to avoid immediate close on button click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true);
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen || typeof window === 'undefined') return null;

  // Don't render if button ref is not available
  if (!buttonRef?.current) return null;
  
  // If position not calculated yet, use a default position
  if (!isPositioned) {
    const rect = buttonRef.current.getBoundingClientRect();
    const defaultStyle = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: align === 'right' ? 'auto' : `${rect.left}px`,
      right: align === 'right' ? `${window.innerWidth - rect.right}px` : 'auto',
      minWidth: `${Math.max(rect.width, 200)}px`,
      zIndex: 10000,
      display: 'block', // Override CSS display:none since we're using portal
    };
    
    return createPortal(
      <div 
        style={defaultStyle} 
        onClick={(e) => e.stopPropagation()} 
        onMouseDown={(e) => e.stopPropagation()}
        data-dropdown-menu={menuId}
        className="dropdown__menu"
      >
        {children}
      </div>,
      document.body
    );
  }

  const menuStyle = {
    position: 'fixed',
    top: `${position.top}px`,
    left: align === 'right' ? 'auto' : `${position.left}px`,
    right: align === 'right' ? `${position.right}px` : 'auto',
    minWidth: `${position.width}px`,
    zIndex: 10000,
    display: 'block', // Override CSS display:none since we're using portal
  };

  return createPortal(
    <div 
      style={menuStyle} 
      onClick={(e) => e.stopPropagation()} 
      onMouseDown={(e) => e.stopPropagation()}
      data-dropdown-menu={menuId}
      className="dropdown__menu"
    >
      {children}
    </div>,
    document.body
  );
}



export default function Home() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState('any');
  const [selectedDays, setSelectedDays] = useState([]); 
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState(null); // ✅ new
  const [mounted, setMounted] = useState(false); 
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSort, setSelectedSort] = useState("popularity");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedRatingProvider, setSelectedRatingProvider] = useState(null);
  const [rating, setRating] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Refs for dropdown buttons
  const cuisineButtonRef = React.useRef(null);
  const deliveryButtonRef = React.useRef(null);
  const priceButtonRef = React.useRef(null);
  const availabilityButtonRef = React.useRef(null);
  const sortButtonRef = React.useRef(null);






  // At the top of your component
const Toast = ({ message, type, visible }) => {
  if (!visible) return null;

  const toastStyle = {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: type === "success" ? "#22c55e" : "#ef4444",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 10000,
    transition: "transform 0.3s ease, opacity 0.3s ease",
    transform: visible ? "translateY(0)" : "translateY(20px)",
    opacity: visible ? 1 : 0,
  };

  return <div style={toastStyle}>{message}</div>;
};




  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      document.body.className = 'dark';
    }
const fetchListings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      let data = await res.json();

      // Use ratings from backend (averageRating and ratingCount)
      data.listings = data.listings.map(listing => ({
        ...listing,
        rating: listing.averageRating ? parseFloat(listing.averageRating) : null,
        reviews: listing.ratingCount || 0
      }));

      setListings(data.listings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchListings();
}, []);

  const expandDays = (days) => {
    return days.flatMap(day => {
      if (day === 'Mon–Fri') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      return [day];
    });
  };

  // ✅ Filtering listings
  const filteredListings = listings.filter(item => {
    // Location filter
    if (searchLocation) {
      if (!item.location || !item.location.toLowerCase().includes(searchLocation.toLowerCase())) {
        return false;
      }
    }

    // Price filter
    if (selectedPrice !== "any") {
      if (selectedPrice === "100-130" && !(item.price >= 100 && item.price <= 130)) return false;
      if (selectedPrice === "130-150" && !(item.price >= 130 && item.price <= 150)) return false;
      if (selectedPrice === "150+" && item.price < 150) return false;
    }

    // Day filter
    if (selectedDays.length > 0) {
      const expanded = expandDays(selectedDays);
      const hasDay = expanded.some(day => item.days?.includes(day));
      if (!hasDay) return false;
    }

    // Delivery Method filter
    if (selectedMethod) {
      if (!item.method?.toLowerCase().includes(selectedMethod.toLowerCase())) {
        return false;
      }
    }

    // ✅ Cuisine filter
    if (selectedCuisine) {
      if (!item.cuisine || item.cuisine.toLowerCase() !== selectedCuisine.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (selectedSort === "priceLow") return a.price - b.price;
    if (selectedSort === "priceHigh") return b.price - a.price;
    if (selectedSort === "popularity") {
      // Sort by rating, with null ratings at the end
      const aRating = a.rating !== null && a.rating !== undefined ? a.rating : -1;
      const bRating = b.rating !== null && b.rating !== undefined ? b.rating : -1;
      return bRating - aRating;
    }
    return 0;
  });

  const ITEMS_PER_PAGE = 9;

// Compute paginated listings
const paginatedListings = sortedListings.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);

// Update total pages whenever sortedListings changes
useEffect(() => {
  setTotalPages(Math.ceil(sortedListings.length / ITEMS_PER_PAGE));
}, [sortedListings]);


  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  if (!mounted) return null;

  const handleContactClick = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedListing) return;

  setIsLoading(true);

  try {
    // Use your backend URL directly
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const res = await fetch(`${API_URL}/api/contact/${selectedListing._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData), // { name, email, message }
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to send message");

    // Success toast
    setToast({ message: data.message || "Message sent successfully!", type: "success", visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);

    // Reset modal/form
    setIsModalOpen(false);
    setFormData({ name: "", email: "", message: "" });

  } catch (err) {
    console.error(err);
    setToast({ message: err.message || "Failed to send message.", type: "error", visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  } finally {
    setIsLoading(false);
  }
};



{toast.visible && (
  <div
    style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      padding: "12px 20px",
      borderRadius: 8,
      backgroundColor: toast.type === "success" ? "#4ade80" : "#f87171",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      zIndex: 9999,
      transition: "transform 0.3s ease, opacity 0.3s ease",
      transform: toast.visible ? "translateY(0)" : "translateY(20px)",
      opacity: toast.visible ? 1 : 0,
    }}
  >
    {toast.message}
  </div>
)}

const handleRatingSubmit = async (listingId, newRating) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setToast({ message: 'You must be logged in to submit a rating', type: 'error', visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listingId}/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating: newRating }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit rating');
    }

    // Update listings state with new rating data
    setListings(prevListings =>
      prevListings.map(item => {
        if (item._id === listingId) {
          const updatedListing = data.listing;
          const ratingCount = updatedListing.ratings?.length || 0;
          const sum = updatedListing.ratings?.reduce((acc, r) => acc + r.rating, 0) || 0;
          const averageRating = ratingCount > 0 ? (sum / ratingCount).toFixed(1) : null;
          return {
            ...item,
            rating: averageRating ? parseFloat(averageRating) : null,
            reviews: ratingCount
          };
        }
        return item;
      })
    );

    setToast({ message: 'Rating submitted successfully!', type: 'success', visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  } catch (err) {
    console.error(err);
    setToast({ message: err.message || 'Failed to submit rating', type: 'error', visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  }
};



  return (
    <>
      {/* NAVBAR */}
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href="#">
            <span className="brand__icon">🍽️</span>
            <span className="brand__name">FreshillyMeal</span>
          </a>
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
            <a 
              href="#listings" 
              className="nav__link"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const listingsSection = document.getElementById('listings');
                if (listingsSection) {
                  listingsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Browse Tiffins
            </a>
            <Link href="/help" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Help</Link>
            <Link href="/auth" className="btn btn--dark" onClick={() => setMobileMenuOpen(false)}>Register as Provider</Link>
          </nav>
          <nav className={`nav__mobile ${mobileMenuOpen ? 'active' : ''}`}>
            <a 
              href="#listings" 
              className="nav__link"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const listingsSection = document.getElementById('listings');
                if (listingsSection) {
                  listingsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Browse Tiffins
            </a>
            <Link href="/help" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Help</Link>
            <Link href="/auth" className="btn btn--dark" onClick={() => setMobileMenuOpen(false)}>Register as Provider</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">
            Find homemade tiffin services <span className="hero__title--pink">near you</span>
          </h1>
          <p className="hero__subtitle">
            Discover delicious, home-cooked meals delivered right to your doorstep from local tiffin providers
          </p>
          <form className="searchbar" onSubmit={(e) => {
            e.preventDefault();
            const locationInput = e.target.querySelector('input[type="text"]');
            if (locationInput) {
              setSearchLocation(locationInput.value.trim());
            }
          }}>
            <input 
              type="text" 
              placeholder="Enter your location" 
              aria-label="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button className="icon-btn search-icon-btn" aria-label="Locate" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn btn--primary" type="submit">Find Tiffins</button>
          </form>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="filters">
        <div className="container filters__inner">
          <div className="filters__left">
            <span className="muted">Filter:</span>

            {/* ✅ Cuisine Dropdown */}
            <div className="dropdown">
              <button 
                ref={cuisineButtonRef}
                className="dropdown__btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('cuisine');
                }}
              >
                {selectedCuisine || "Cuisine Type ▾"}
              </button>
              <DropdownMenu 
                isOpen={openDropdown === 'cuisine'} 
                onClose={closeDropdown}
                buttonRef={cuisineButtonRef}
                menuId="cuisine"
              >
                <button onClick={() => { setSelectedCuisine("North Indian"); closeDropdown(); }}>North Indian</button>
                <button onClick={() => { setSelectedCuisine("South Indian"); closeDropdown(); }}>South Indian</button>
                <button onClick={() => { setSelectedCuisine("Gujarati"); closeDropdown(); }}>Gujarati</button>
                <button onClick={() => { setSelectedCuisine("Bengali"); closeDropdown(); }}>Bengali</button>
                <button onClick={() => { setSelectedCuisine("Maharashtrian"); closeDropdown(); }}>Maharashtrian</button>
                <button onClick={() => { setSelectedCuisine("Punjabi"); closeDropdown(); }}>Punjabi</button>
                <button onClick={() => { setSelectedCuisine("Jain"); closeDropdown(); }}>Jain</button>
                <button onClick={() => { setSelectedCuisine(null); closeDropdown(); }}>Clear</button>
              </DropdownMenu>
            </div>

            {/* Delivery Dropdown */}
            <div className="dropdown">
              <button 
                ref={deliveryButtonRef}
                className="dropdown__btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('delivery');
                }}
              >
                {selectedMethod || "Delivery Method ▾"}
              </button>
              <DropdownMenu 
                isOpen={openDropdown === 'delivery'} 
                onClose={closeDropdown}
                buttonRef={deliveryButtonRef}
                menuId="delivery"
              >
                <button onClick={() => { setSelectedMethod("Pickup"); closeDropdown(); }}>Pickup only</button>
                <button onClick={() => { setSelectedMethod("Delivery"); closeDropdown(); }}>Delivery only</button>
                <button onClick={() => { setSelectedMethod("Both"); closeDropdown(); }}>Both</button>
                <button onClick={() => { setSelectedMethod(null); closeDropdown(); }}>Clear</button>
              </DropdownMenu>
            </div>

            {/* Price Dropdown */}
            <div className="dropdown">
              <button 
                ref={priceButtonRef}
                className="dropdown__btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('price');
                }}
              >
                Price Range ▾
              </button>
              <DropdownMenu 
                isOpen={openDropdown === 'price'} 
                onClose={closeDropdown}
                buttonRef={priceButtonRef}
                menuId="price"
              >
                <label className="price-menu"><input type="radio" name="price" value="any" checked={selectedPrice === 'any'} onChange={() => { setSelectedPrice('any'); closeDropdown(); }} /> Any</label>
                <label className="price-menu"><input type="radio" name="price" value="100-130" checked={selectedPrice === '100-130'} onChange={() => { setSelectedPrice('100-130'); closeDropdown(); }} /> CAD $100–$130</label>
                <label className="price-menu"><input type="radio" name="price" value="130-150" checked={selectedPrice === '130-150'} onChange={() => { setSelectedPrice('130-150'); closeDropdown(); }} /> CAD $130–$150</label>
                <label className="price-menu"><input type="radio" name="price" value="150+" checked={selectedPrice === '150+'} onChange={() => { setSelectedPrice('150+'); closeDropdown(); }} /> CAD $150+</label>
              </DropdownMenu>
            </div>

            {/* Availability Dropdown */}
            <div className="dropdown">
              <button 
                ref={availabilityButtonRef}
                className="dropdown__btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('availability');
                }}
              >
                Availability ▾
              </button>
              <DropdownMenu 
                isOpen={openDropdown === 'availability'} 
                onClose={closeDropdown}
                buttonRef={availabilityButtonRef}
                menuId="availability"
              >
                <label>
                  <input type="checkbox" checked={selectedDays.includes('Mon–Fri')} onChange={() => toggleDay('Mon–Fri')} /> Mon–Fri
                </label>
                <label>
                  <input type="checkbox" checked={selectedDays.includes('Sat')} onChange={() => toggleDay('Sat')} /> Sat
                </label>
                <label>
                  <input type="checkbox" checked={selectedDays.includes('Sun')} onChange={() => toggleDay('Sun')} /> Sun
                </label>
              </DropdownMenu>
            </div>
          </div>

          {/* Sort */}
          <div className="filters__right">
            <span className="muted">Sort by:</span>
            <div className="dropdown">
              <button 
                ref={sortButtonRef}
                className="dropdown__btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('sort');
                }}
              >
                {selectedSort === "popularity" ? "Popularity" : 
                 selectedSort === "priceLow" ? "Price (low to high)" : 
                 selectedSort === "priceHigh" ? "Price (high to low)" : "Sort"} ▾
              </button>
              <DropdownMenu 
                isOpen={openDropdown === 'sort'} 
                onClose={closeDropdown}
                buttonRef={sortButtonRef}
                align="right"
                menuId="sort"
              >
                <button onClick={() => { setSelectedSort("popularity"); closeDropdown(); }}>Rating</button>
                <button onClick={() => { setSelectedSort("priceLow"); closeDropdown(); }}>Price (low to high)</button>
                <button onClick={() => { setSelectedSort("priceHigh"); closeDropdown(); }}>Price (high to low)</button>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS HEADER */}
      <div className="container section-head">
        <h2 className="section-title">
          Available Tiffin Services <span className="muted">({filteredListings.length})</span>
        </h2>
      </div>

      {/* CARD GRID */}

   <section id="listings" className="container card-grid">
        {loading && <p>Loading listings...</p>}
        {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
        {!loading && !error && sortedListings.length === 0 && <p>No listings available.</p>}
        {!loading && !error && paginatedListings.map((item) => (
   

          // Inside your card loop
<article key={item._id} className="card">
  <div className="card__media" style={{ position: "relative", height: "180px", borderRadius: "12px", overflow: "hidden" }}>
    {/* ✅ Automatic Sliding Carousel */}
    <Carousel images={item.images} />

    <span className="badge badge--pill">CAD {item.price}/{item.unit}</span>
<button
  className="heart"
  aria-label="Save & Rate"
  onClick={() => {
    setSelectedListing(item); // current listing
    setRating(item.rating || 0); // set initial rating
    setIsRatingModalOpen(true); // open the modal
  }}
>
  ♡
</button>



    
  </div>

  <div className="card__body">
    <h3 className="card__title">{item.title}</h3>
    <p className="muted small">{item.cuisine || item.tagline || "North Indian Meals"}</p>
    {item.location && (
      <p className="muted small" style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        📍 {item.location}
      </p>
    )}

    {item.rating !== null && item.rating !== undefined && (
      <div className="rating">
        <span>★ {Number(item.rating).toFixed(1)}</span>
      </div>
    )}


    <div className="subhead">Today's Menu</div>
    <ul className="bullets">
      {item.menu?.length > 0 ? (
        item.menu.map((dish, idx) => <li key={idx}>{dish}</li>)
      ) : (
        <>
          <li>{item.details}</li>
          {/* <li>{item.extra1 || "Extra item here"}</li>
          <li>{item.extra2 || "Another item here"}</li> */}
        </>
      )}
    </ul>

    <div className="tags">
      {item.days?.map((day, idx) => (
        <span key={idx} className="tag">{day}</span>
      ))}
      {item.method && <span className="tag">{item.method}</span>}
      {item.cuisine && <span className="tag">{item.cuisine}</span>}
    </div>
  </div>

 <div className="card__footer">
 <button
  onClick={() => handleContactClick(item)}
  className="btn btn--dark block"
>
  Contact Provider
</button>

</div>

</article>

        ))}
      </section>





      {/* PAGINATION */}
<div className="container pagination">
  <button
    className="page-btn"
    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
    disabled={page === 1}
    aria-label="Previous"
  >
    ‹
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i + 1}
      className={`page-btn ${page === i + 1 ? 'is-active' : ''}`}
      onClick={() => setPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button
    className="page-btn"
    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
    aria-label="Next"
  >
    ›
  </button>
</div>

     


      

      {/* FOOTER */}
      <footer className="footer">
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
{/* Replace previous modal code / AnimatePresence block with this: */}
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  listing={selectedListing}
  formData={formData}
  setFormData={setFormData}
  onSubmit={handleSubmit}
  onChange={handleChange}
   isLoading={isLoading}
/>

<RatingModal
  isOpen={isRatingModalOpen}
  listing={selectedListing}
  rating={rating}
  setRating={setRating}
  onClose={() => setIsRatingModalOpen(false)}
  onSubmitRating={handleRatingSubmit}
/>



{/* Toast notification */}
<Toast message={toast.message} type={toast.type} visible={toast.visible} />


    </>
  );
}
