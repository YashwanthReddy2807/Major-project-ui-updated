import React, { useState } from "react";
import { loginUser } from "../api/api";
import CaptureFace from "./CaptureFace";
import { Lock } from "lucide-react";

const LoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [faceBase64, setFaceBase64] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFaceCapture = (base64) => {
    setFaceBase64(base64);
    setMessage("Face captured");
  };

  const handleLogin = async () => {
    if (!faceBase64) {
      alert("Please capture your face image.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await loginUser(accountNumber, pin, faceBase64);
      const rawData = await res.json();

      let data = {};
      try {
        data = JSON.parse(rawData.body);
      } catch (e) {
        console.error("Error parsing nested JSON body:", e);
      }

      if (res.ok && data.message === "Login successful") {
        onLoginSuccess(data.session_token, accountNumber);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Network or server error");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Lock size={32} color="#facc15" />
          <h2 style={styles.title}>Secure Login</h2>
        </div>

        {/* Inputs */}
        <input
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          disabled={loading}
          style={styles.input}
        />
        <input
          placeholder="PIN"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          disabled={loading}
          style={styles.input}
        />

        {/* Face Capture */}
        <div style={{ margin: "1.5rem 0", textAlign: "center" }}>
          <CaptureFace onCapture={handleFaceCapture} />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading || !accountNumber || !pin || !faceBase64}
          style={{
            ...styles.button,
            background: loading
              ? "#6b7280"
              : "linear-gradient(to right, #facc15, #f97316)",
            cursor:
              loading || !accountNumber || !pin || !faceBase64
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Message */}
        {message && (
          <p
            style={{
              marginTop: "1rem",
              color: message.includes("success") ? "#22c55e" : "#f87171",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

        {/* Switch */}
        <p style={styles.switchText}>
          Don’t have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            style={styles.switchButton}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

// ================= CSS-in-JS =================
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom right, #1e1b4b, #312e81, #000)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(16px)",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  },
  title: {
    marginTop: "0.5rem",
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#facc15",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginBottom: "15px",
    fontSize: "16px",
    background: "rgba(255,255,255,0.9)",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "30px",
    border: "none",
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  switchText: {
    marginTop: "20px",
    textAlign: "center",
    color: "#d1d5db",
    fontSize: "14px",
  },
  switchButton: {
    background: "none",
    border: "none",
    color: "#facc15",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default LoginForm;
