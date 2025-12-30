"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Logging you in...</h1>
      <p>Please wait a moment.</p>
    </div>
  );
}
