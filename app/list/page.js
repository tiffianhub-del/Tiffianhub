"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ListPage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [images, setImages] = useState([]);
  const [token, setToken] = useState(null);

  // Get token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Mount effect
  useEffect(() => {
    setMounted(true);
    document.body.className = theme;
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(`✅ Listing saved! ID: ${result._id}`);
        form.reset();
        setImages([]);
      } else {
        toast.error(`❌ Error: ${result.message}`);
      }
    } catch (err) {
      toast.error(`❌ Network error: ${err.message}`);
    }
  };

  if (!mounted) return null;

  return (
    <div className={theme}>
      {/* NAVBAR */}
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href="/"><span className="brand__name">HomeMade</span></a>
          <nav className="nav__links">
            <button className="btn btn--dark" onClick={toggleTheme}>
              {theme === "dark" ? "☀️ " : "🌙 "}
            </button>
            <a href="#" className="nav__link">Browse Services</a>
            <a href="#" className="nav__link">My Orders</a>
            <a href="#" className="nav__link">Help</a>
            <button className="icon-btn" aria-label="Notifications">🔔</button>
            <button className="icon-btn avatar" aria-label="User menu">👤</button>
            <a href="/list" className="btn btn--dark">List Your Service</a>
          </nav>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="pagehead">
        <div className="container">
          <h1 className="pagehead__title">List Your Service</h1>
          <p className="pagehead__subtitle">
            Provide details about your tiffin service or home-cooked meal offerings.
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
                <span className="suffix">per meal</span>
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
              <option value="Rajasthani">Rajasthani</option>
              <option value="Bengali">Bengali</option>
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
            <button className="btn btn--primary" type="submit">Submit Listing</button>
          </div>
        </form>
      </section>
    </div>
  );
}
