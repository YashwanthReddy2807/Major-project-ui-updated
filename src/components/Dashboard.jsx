import React, { useState, useEffect, useRef } from "react";
import {
  transferFunds,
  getTransactions,
  changePin,
  getUserInfo,
  vpnCheck,
} from "../api/api";

const Dashboard = ({ sessionToken, accountNumber, onLogout }) => {
  // ---------------- State ----------------
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [sentTransactions, setSentTransactions] = useState([]);
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [email, setEmail] = useState("");
  const [newPin, setNewPin] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [balance, setBalance] = useState("");
  const [expandedCard, setExpandedCard] = useState(""); // For slide-down cards

  const videoRef = useRef(null);
  const [faceImageBase64, setFaceImageBase64] = useState("");

  // ---------------- Load User Info ----------------
  const loadUserInfo = async () => {
    try {
      const res = await getUserInfo(sessionToken, accountNumber);
      const data = await res.json();
      if (res.ok && data) {
        setFullName(data.name || "");
        setBalance(data.balance != null ? data.balance : "");
        setEmail(data.email || "");
      }
    } catch {
      setFullName("");
      setBalance("");
      setEmail("");
    }
  };

  // ---------------- Load Transactions ----------------
  const loadTransactions = async () => {
    try {
      const res = await getTransactions(sessionToken, accountNumber);
      const data = await res.json();
      if (res.ok) {
        setSentTransactions(data.sent || []);
        setReceivedTransactions(data.received || []);
      } else {
        setMessage(data.message || "Failed to load transactions");
      }
    } catch {
      setMessage("Error loading transactions");
    }
  };

  useEffect(() => {
    if (sessionToken && accountNumber) {
      loadUserInfo();
      loadTransactions();
    }
  }, [sessionToken, accountNumber]);

  // ---------------- Webcam Setup ----------------
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setMessage("Unable to access webcam for face verification"));

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureFaceImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setFaceImageBase64(dataUrl.split(",")[1]);
    setMessage("✅ Face image captured.");
  };

  // ---------------- Transfer Funds ----------------
  const handleTransfer = async () => {
    if (!faceImageBase64) {
      alert("Please capture your face image for verification");
      return;
    }
    if (!transferTo || !transferAmount) {
      alert("Please enter a valid account and amount");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await transferFunds(
        accountNumber,
        transferTo,
        transferAmount,
        sessionToken,
        faceImageBase64
      );
      alert(data.message || "Transfer successful");

      setTransferTo("");
      setTransferAmount("");
      setFaceImageBase64("");

      await loadTransactions();
      await loadUserInfo();
    } catch (err) {
      alert(err.message || "Transfer failed");
    }

    setLoading(false);
  };

  // ---------------- Change PIN ----------------
  const handleChangePin = async () => {
    if (!email || !newPin) {
      alert("Please enter your new PIN.");
      return;
    }
    if (newPin.length < 4) {
      alert("PIN must be at least 4 digits long.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await changePin(email, newPin);
      const data = await res.json();
      alert(data.message || "PIN changed successfully");
      setNewPin("");
    } catch {
      alert("PIN change request failed");
    }

    setLoading(false);
  };

  // ---------------- VPN Detection ----------------
  useEffect(() => {
    if (!accountNumber || !email) return;

    const checkVPN = async () => {
      try {
        const res = await vpnCheck(accountNumber, email);
        const parsed = typeof res.body === "string" ? JSON.parse(res.body) : res;

        if (parsed.message === "VPN detected, email sent") {
          alert("VPN detected. You have been logged out for security reasons.");
          onLogout();
        }
      } catch (err) {
        console.error("VPN check failed:", err);
      }
    };

    checkVPN();
    const interval = setInterval(checkVPN, 60000);
    return () => clearInterval(interval);
  }, [accountNumber, email, onLogout]);

  // ---------------- Toggle Card ----------------
  const toggleCard = (card) => {
    setExpandedCard(expandedCard === card ? "" : card);
  };

  // ---------------- UI ----------------
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
          Welcome, {fullName}
        </h2>
        <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
          Balance: <span style={{ color: "#22c55e" }}>${balance}</span>
        </h4>

        {/* Transfer Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader} onClick={() => toggleCard("transfer")}>
            💸 Transfer Funds
            <span>{expandedCard === "transfer" ? "▲" : "▼"}</span>
          </div>
          <div
            style={{
              ...styles.cardContent,
              maxHeight: expandedCard === "transfer" ? "500px" : "0",
            }}
          >
            <input
              placeholder="To Account Number"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              disabled={loading}
              style={styles.input}
            />
            <input
              placeholder="Amount"
              type="number"
              min="1"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              disabled={loading}
              style={styles.input}
            />

            {/* Webcam */}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <div style={styles.webcamWrapper}>
                <video
                  ref={videoRef}
                  autoPlay
                  style={styles.video}
                />
              </div>
              <button style={styles.button} onClick={captureFaceImage}>
                Capture Face
              </button>
              {faceImageBase64 && <p style={{ fontSize: "13px" }}>Face image ✅</p>}
            </div>

            <button
              style={styles.button}
              onClick={handleTransfer}
              disabled={loading || !transferTo || !transferAmount}
            >
              Transfer
            </button>
          </div>
        </div>

        {/* Sent Transactions Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader} onClick={() => toggleCard("sent")}>
            📤 Sent Transactions
            <span>{expandedCard === "sent" ? "▲" : "▼"}</span>
          </div>
          <div
            style={{
              ...styles.cardContent,
              maxHeight: expandedCard === "sent" ? "400px" : "0",
            }}
          >
            <ul style={styles.list}>
              {sentTransactions.length === 0 ? (
                <li>No sent transactions</li>
              ) : (
                sentTransactions.map((tx) => (
                  <li key={tx.transaction_id}>
                    {tx.timestamp}: Sent → {tx.to_account} : ${tx.amount}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Received Transactions Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader} onClick={() => toggleCard("received")}>
            📥 Received Transactions
            <span>{expandedCard === "received" ? "▲" : "▼"}</span>
          </div>
          <div
            style={{
              ...styles.cardContent,
              maxHeight: expandedCard === "received" ? "400px" : "0",
            }}
          >
            <ul style={styles.list}>
              {receivedTransactions.length === 0 ? (
                <li>No received transactions</li>
              ) : (
                receivedTransactions.map((tx) => (
                  <li key={tx.transaction_id}>
                    {tx.timestamp}: From {tx.from_account} → You : ${tx.amount}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Change PIN Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader} onClick={() => toggleCard("pin")}>
            🔑 Change PIN
            <span>{expandedCard === "pin" ? "▲" : "▼"}</span>
          </div>
          <div
            style={{
              ...styles.cardContent,
              maxHeight: expandedCard === "pin" ? "250px" : "0",
            }}
          >
            <p>Email: {email}</p>
            <input
              placeholder="New PIN"
              type="number"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              disabled={loading}
              style={styles.input}
            />
            <button
              style={styles.button}
              onClick={handleChangePin}
              disabled={loading || !newPin}
            >
              Change PIN
            </button>
          </div>
        </div>

        <button
          style={{ ...styles.button, background: "red", marginTop: "20px" }}
          onClick={onLogout}
        >
          Logout
        </button>

        {message && (
          <p style={{ textAlign: "center", marginTop: "10px" }}>{message}</p>
        )}
      </div>
    </div>
  );
};

// Reusable styles
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e1b4b, #312e81, #000)",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "500px",
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    color: "#fff",
    padding: "25px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    marginBottom: "15px",
    overflow: "hidden",
    transition: "all 0.4s ease",
  },
  cardHeader: {
    padding: "12px 15px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.1)",
  },
  cardContent: {
    padding: "15px",
    transition: "max-height 0.5s ease",
    overflow: "hidden",
  },
  input: {
    width: "90%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "25px",
    background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  list: {
    paddingLeft: "15px",
    fontSize: "14px",
  },
  webcamWrapper: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #5b86e5",
    margin: "0 auto 15px",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "rotateY(180deg)",
  },
};

export default Dashboard;
