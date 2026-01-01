"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set dark mode
    document.body.className = "dark";
    
    // Get token from URL query string
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Save token to localStorage
      localStorage.setItem("token", token);

      // Redirect to your dashboard or home page
      router.push("/dashboard"); // change this to wherever you want
    } else {
      // No token? Redirect to login
      router.push("/auth/signin");
    }
  }, [router]);

  return (
    <div style={{ 
      textAlign: "center", 
      marginTop: "50px",
      color: "#f9fafb",
      background: "#0b0d10",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1 style={{ color: "#f9fafb", marginBottom: "1rem" }}>Logging you in...</h1>
      <p style={{ color: "#a5b4fc" }}>Please wait a moment.</p>
    </div>
  );
}
