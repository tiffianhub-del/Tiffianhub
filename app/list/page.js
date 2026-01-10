"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

export default function ListPage() {
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState([]);
  const [token, setToken] = useState(null);
  const [listingId, setListingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Get token from localStorage and check for edit mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      
      // If no token and trying to access this page, redirect to auth
      if (!storedToken) {
        router.push('/auth');
        return;
      }
      
      const id = searchParams.get('id');
      if (id) {
        setListingId(id);
      }
    }
  }, [searchParams, router]);

  // Mount effect - set dark mode
  useEffect(() => {
    setMounted(true);
    document.body.className = "dark";
  }, []);

  // Fetch listing data if editing
  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId || !token || !mounted) return;
      
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            // Token expired
            localStorage.removeItem('token');
            toast.error('❌ Session expired. Please log in again.');
            router.push('/auth');
            return;
          }
          throw new Error('Failed to fetch listing');
        }
        
        const data = await res.json();
        const listing = data.listings?.find(l => l._id === listingId);
        
        if (listing) {
          // Wait a bit for form to be rendered, then populate
          setTimeout(() => {
            const form = document.querySelector('form');
            if (form) {
              form.name.value = listing.title || '';
              form.desc.value = listing.details || '';
              form.price.value = listing.price || '';
              form.cuisine.value = listing.cuisine || '';
              form.offdays.value = listing.offdays || '';
              form.location.value = listing.location || '';
              
              // Set delivery method
              const deliveryInputs = form.delivery;
              if (deliveryInputs) {
                Array.from(deliveryInputs).forEach(input => {
                  if (input.value === listing.method) {
                    input.checked = true;
                  }
                });
              }
              
              // Set days
              const daysInputs = form.days;
              if (daysInputs) {
                Array.from(daysInputs).forEach(input => {
                  if (listing.days && listing.days.includes(input.value)) {
                    input.checked = true;
                  }
                });
              }
              
              // Set images
              if (listing.images && listing.images.length > 0) {
                setImages(listing.images);
              }
            }
          }, 100);
        } else {
          toast.error('Listing not found');
          router.push('/list');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        toast.error('Failed to load listing data');
        // If it's an auth error, redirect to login
        if (err.message.includes('401') || err.message.includes('unauthorized')) {
          localStorage.removeItem('token');
          router.push('/auth');
        }
      } finally {
        setLoading(false);
      }
    };

    if (listingId && token && mounted) {
      fetchListing();
    }
  }, [listingId, token, mounted, router]);

  // Convert files to Base64
const handleFiles = (files) => {
  const fileArray = Array.from(files).slice(0, 3 - images.length);

  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => [...prev, reader.result]); // reader.result is Base64
    };
    reader.readAsDataURL(file);
  });
};


  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      title: form.name.value,
      details: form.desc.value,
      price: parseFloat(form.price.value),
      unit: "per meal",
      method: form.delivery.value,
      cuisine: form.cuisine.value,
      offdays: form.offdays.value,
      location: form.location.value,
      days: Array.from(form.days)
        .filter((i) => i.checked)
        .map((i) => i.value),
      images: images, // Base64 strings
    };

    try {
      if (!token) {
        toast.error("❌ You must be logged in to submit a listing.");
        return;
      }

      const isEditMode = !!listingId;
      const url = isEditMode 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/listings`;
      
      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(isEditMode ? `✅ Listing updated!` : `✅ Listing saved! ID: ${result._id}`);
        if (!isEditMode) {
          form.reset();
          setImages([]);
          // Redirect to dashboard after successful creation
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          // Redirect to dashboard after successful edit
          router.push('/dashboard');
        }
      } else {
        // Check if token expired
        if (res.status === 401) {
          localStorage.removeItem('token');
          toast.error('❌ Session expired. Please log in again.');
          setTimeout(() => {
            router.push('/auth');
          }, 1500);
        } else {
          toast.error(`❌ Error: ${result.message}`);
        }
      }
    } catch (err) {
      toast.error(`❌ Network error: ${err.message}`);
    }
  };

  if (!mounted) return null;

  return (
    <div>
      {/* NAVBAR */}
      <header className="nav">
        <div className="container nav__inner">
          <Link href="/" className="brand"><span className="brand__name">HomeMade</span></Link>
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
            <Link href="/" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Browse Services</Link>
            <a href="#" className="nav__link" onClick={() => setMobileMenuOpen(false)}>My Orders</a>
            <Link href="/help" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Help</Link>
            <button className="icon-btn" aria-label="Notifications" onClick={() => setMobileMenuOpen(false)}>🔔</button>
            <Link href="/list" className="btn btn--dark" onClick={() => setMobileMenuOpen(false)}>List Your Service</Link>
          </nav>
          <nav className={`nav__mobile ${mobileMenuOpen ? 'active' : ''}`}>
            <Link href="/" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Browse Services</Link>
            <a href="#" className="nav__link" onClick={() => setMobileMenuOpen(false)}>My Orders</a>
            <Link href="/help" className="nav__link" onClick={() => setMobileMenuOpen(false)}>Help</Link>
            <button className="icon-btn" aria-label="Notifications" onClick={() => setMobileMenuOpen(false)}>🔔</button>
            <Link href="/list" className="btn btn--dark" onClick={() => setMobileMenuOpen(false)}>List Your Service</Link>
          </nav>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="pagehead">
        <div className="container">
          <h1 className="pagehead__title">{listingId ? 'Edit Your Service' : 'List Your Service'}</h1>
          <p className="pagehead__subtitle">
            {listingId 
              ? 'Update the details of your tiffin service or home-cooked meal offerings.'
              : 'Provide details about your tiffin service or home-cooked meal offerings.'}
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="container">
        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="field">
            <label>Service / Tiffin Name *</label>
            <input name="name" required placeholder="e.g., Anita’s Homestyle Meals" />
          </div>
          <div className="field">
            <label>Menu Description *</label>
            <textarea name="desc" required placeholder="Describe your menu..."></textarea>
          </div>
          <div className="field split">
            <div>
              <label>Price *</label>
              <div className="price-input">
                <span className="prefix">$</span>
                <input name="price" type="number" min="0" step="0.01" required />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Cuisine Type *</label>
            <select name="cuisine" required>
              <option value="">Select Cuisine</option>
              <option value="North Indian">North Indian</option>
              <option value="South Indian">South Indian</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Bengali">Bengali</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Jain">Jain</option>
              <option value="Rajasthani">Rajasthani</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="field">
            <label>Days Available *</label>
            <div className="checkgrid">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
                <label key={day}>
                  <input type="checkbox" name="days" value={day} /> {day}
                </label>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Delivery Method *</label>
            <div className="radiolist">
              <label><input type="radio" name="delivery" value="Pickup" required /> Pickup</label>
              <label><input type="radio" name="delivery" value="Delivery" /> Delivery</label>
              <label><input type="radio" name="delivery" value="Both" /> Both</label>
            </div>
          </div>
          <div className="field">
            <label>Off Days</label>
            <input name="offdays" placeholder="Add specific dates/holidays" />
          </div>
          <div className="field">
            <label>Location *</label>
            <input name="location" required placeholder="e.g., Toronto, ON" />
          </div>
          <div className="field">
            <label>Upload Images</label>
            <div className="uploads">
              {images.length < 3 && (
                <label className="dropzone">
                  <input type="file" multiple accept="image/*" hidden
                    onChange={(e) => handleFiles(e.target.files)} />
                  <div className="dropzone-content">
                    <span className="icon">☁️</span>
                    <p>Click to upload or drag and drop</p>
                    <small>JPG, PNG, or GIF (max. 5MB)</small>
                  </div>
                </label>
              )}
              <div className="thumbs">
  {images.map((img, i) => (
    <div key={i} className="thumb">
      <button type="button" className="remove-btn" onClick={() => removeImage(i)}>✕</button>
      {/* Use img directly if it's a Base64 string */}
      <img src={img} alt={`upload-${i}`} />
    </div>
  ))}
</div>

            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? 'Loading...' : (listingId ? 'Update Listing' : 'Submit Listing')}
            </button>
            {listingId && (
              <Link href="/dashboard" className="btn" style={{ marginLeft: '10px' }}>
                Cancel
              </Link>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
