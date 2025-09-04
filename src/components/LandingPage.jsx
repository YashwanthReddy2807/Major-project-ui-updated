import React from "react";
import { Shield, Smile, Banknote, BarChart, Users, Lock, Star } from "lucide-react";

const LandingPage = ({ onLogin, onRegister }) => {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>SecureBank Pro</h1>
        <div style={styles.headerButtons}>
          <button style={{ ...styles.button, background: "#444", color: "#fff" }}>Sign In</button>
          <button
            style={{
              ...styles.button,
              background: "linear-gradient(to right, #3b82f6, #9333ea)",
              color: "#fff",
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        {/* Left Section */}
        <div style={styles.heroLeft}>
          <span style={styles.tag}>Next-Generation Banking</span>
          <h1 style={styles.title}>
            Welcome to the <br />
            <span style={styles.gradientText}>Future of Banking</span>
          </h1>
          <p style={styles.subtitle}>
            Experience secure, intelligent banking with advanced facial authentication,
            real-time analytics, and seamless digital transactions.
          </p>
          <div style={styles.ctaButtons}>
            <button
              onClick={onRegister}
              style={{
                ...styles.button,
                background: "linear-gradient(to right, #3b82f6, #9333ea)",
                color: "#fff",
              }}
            >
              Open Account
            </button>
            <button onClick={onLogin} style={{ ...styles.button, background: "#444", color: "#fff" }}>
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div style={styles.stats}>
            <div style={styles.statBox}>
              <Users size={24} color="#60a5fa" />
              <p style={styles.statNumber}>2M+</p>
              <span style={styles.statLabel}>Active Users</span>
            </div>
            <div style={styles.statBox}>
              <Star size={24} color="#22c55e" />
              <p style={styles.statNumber}>99.9%</p>
              <span style={styles.statLabel}>Uptime</span>
            </div>
            <div style={styles.statBox}>
              <Lock size={24} color="#a855f7" />
              <p style={styles.statNumber}>256-bit</p>
              <span style={styles.statLabel}>Encryption</span>
            </div>
            <div style={styles.statBox}>
              <Shield size={24} color="#f472b6" />
              <p style={styles.statNumber}>24/7</p>
              <span style={styles.statLabel}>Support</span>
            </div>
          </div>
        </div>

        {/* Right Section - Features */}
        <div style={styles.features}>
          <div style={styles.featureCard}>
            <Shield size={28} color="#60a5fa" />
            <div>
              <h3 style={styles.featureTitle}>Advanced Security</h3>
              <p style={styles.featureDesc}>Bank-level encryption and biometric authentication</p>
            </div>
          </div>
          <div style={styles.featureCard}>
            <Smile size={28} color="#f472b6" />
            <div>
              <h3 style={styles.featureTitle}>Face Recognition</h3>
              <p style={styles.featureDesc}>AI-powered facial authentication technology</p>
            </div>
          </div>
          <div style={styles.featureCard}>
            <Banknote size={28} color="#22c55e" />
            <div>
              <h3 style={styles.featureTitle}>Digital Banking</h3>
              <p style={styles.featureDesc}>Complete banking services at your fingertips</p>
            </div>
          </div>
          <div style={styles.featureCard}>
            <BarChart size={28} color="#f97316" />
            <div>
              <h3 style={styles.featureTitle}>Smart Analytics</h3>
              <p style={styles.featureDesc}>Real-time insights into your financial health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Project Info */}
      <footer style={styles.footer}>
        <p>
          Developed by <b>Sudhanva</b>, <b>Subham</b>, <b>Yashwanth</b>, and <b>Sudharshan</b> <br />
          Students of <span style={{ color: "#60a5fa" }}>Acharya Institute of Technology, Bangalore</span>
        </p>
      </footer>
    </div>
  );
};

// ================== CSS-in-JS Styles ==================
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #1e1b4b, #312e81, #000)",
    color: "#fff",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  logo: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#60a5fa",
  },
  headerButtons: {
    display: "flex",
    gap: "0.8rem",
  },
  button: {
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  hero: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "1200px",
    gap: "2rem",
    flexWrap: "wrap",
  },
  heroLeft: {
    flex: 1,
    minWidth: "280px",
  },
  tag: {
    padding: "0.4rem 1rem",
    background: "#222",
    borderRadius: "999px",
    fontSize: "0.8rem",
    display: "inline-block",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    lineHeight: "1.3",
  },
  gradientText: {
    background: "linear-gradient(to right, #3b82f6, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    marginTop: "1rem",
    fontSize: "1rem",
    color: "#d1d5db",
    lineHeight: "1.6",
  },
  ctaButtons: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
    flexWrap: "wrap",
  },
  stats: {
    display: "flex",
    gap: "1.5rem",
    marginTop: "2rem",
    color: "#d1d5db",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "100px",
  },
  statNumber: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginTop: "0.4rem",
  },
  statLabel: {
    fontSize: "0.85rem",
  },
  features: {
    flex: 1,
    display: "grid",
    gap: "1rem",
    maxWidth: "400px",
    minWidth: "260px",
  },
  featureCard: {
    background: "rgba(255,255,255,0.1)",
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  featureTitle: {
    fontSize: "1rem",
    fontWeight: "600",
  },
  featureDesc: {
    fontSize: "0.85rem",
    color: "#d1d5db",
  },
  footer: {
    marginTop: "3rem",
    padding: "1rem",
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    fontSize: "0.9rem",
    color: "#d1d5db",
    maxWidth: "800px",
  },
};

export default LandingPage;
