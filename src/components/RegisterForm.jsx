import React, { useState, useRef, useEffect } from "react";
import { sendOtp, verifyOtp, captureFace } from "../api/api";

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log("Current step:", step);
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Unable to access camera: " + err.message);
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return null;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg").split(",")[1];
  };

  const handleSendOtp = async () => {
    if (!name || !email) {
      alert("Enter both name and email!");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(name, email);
      const data = await res.json();
      const body = typeof data.body === "string" ? JSON.parse(data.body) : data.body;

      if (res.status === 200 && body.message === "OTP sent successfully") {
        alert("OTP sent! Check your email.");
        setStep(2);
      } else {
        alert(body.message || "Failed to send OTP");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP!");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      const data = await res.json();
      const body = typeof data.body === "string" ? JSON.parse(data.body) : data.body;

      if (res.status === 200 && body.success === true) {
        alert("OTP Verified!");
        setIsOtpVerified(true);
        setStep(3);
        startCamera();
      } else {
        alert(body.message || "OTP verification failed");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureFace = async () => {
    const faceImageBase64 = captureImage();
    if (!faceImageBase64) {
      alert("Could not capture face image!");
      return;
    }

    setLoading(true);
    try {
      const res = await captureFace(email, faceImageBase64);
      const data = await res.json();
      const body = typeof data.body === "string" ? JSON.parse(data.body) : data.body;

      if (res.status === 200 && body.account_number && body.pin) {
        alert(`Registration complete! Account: ${body.account_number}, PIN: ${body.pin}`);
        setStep(4);
      } else {
        alert(body.message || "Failed to register user");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1b4b, #312e81, #000)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
        color: "#f5f5f5",
      }}
    >
      <style>
        {`
          .register-container {
            width: 100%;
            max-width: 420px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(14px);
            border-radius: 20px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.45);
            text-align: center;
            padding: 40px 30px; /* padding inside card */
          }
          .avatar {
            font-size: 60px;
            background: rgba(255,255,255,0.15);
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          .step-indicator {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
            gap: 10px;
          }
          .step-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #777;
          }
          .step-dot.active {
            background: linear-gradient(90deg, #3b82f6, #9333ea);
            box-shadow: 0 0 10px rgba(147,51,234,0.8);
          }
          input {
            width: 90%;
            padding: 14px 16px;
            margin-bottom: 15px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.25);
            font-size: 16px;
            background: rgba(255,255,255,0.12);
            color: #fff;
            outline: none;
          }
          input:focus {
            border: 1px solid #9333ea;
            box-shadow: 0 0 8px rgba(147,51,234,0.8);
          }
          input::placeholder {
            color: #ddd;
          }
          button {
            width: 100%;
            padding: 14px;
            border-radius: 30px;
            border: none;
            color: #fff;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          button:hover {
            transform: scale(1.05);
          }
        `}
      </style>

      <div className="register-container">
        <div className="avatar">👤</div>
        <h2 style={{ marginBottom: "25px", fontSize: "22px", fontWeight: "700" }}>
          User Registration
        </h2>

        <div className="step-indicator">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`step-dot ${step === s ? "active" : ""}`}></div>
          ))}
        </div>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              style={{
                background: loading
                  ? "#555"
                  : "linear-gradient(90deg, #3b82f6, #9333ea)",
              }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              disabled={isOtpVerified}
              onChange={(e) => setOtp(e.target.value)}
            />
            {!isOtpVerified && (
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                style={{
                  background: loading
                    ? "#777"
                    : "linear-gradient(90deg, #f59e0b, #d97706)",
                }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <p style={{ marginBottom: "10px", fontWeight: "500" }}>
              Align your face within the frame and click capture.
            </p>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="100%"
              height="auto"
              style={{
                borderRadius: "12px",
                marginBottom: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button
              onClick={handleCaptureFace}
              disabled={loading}
              style={{
                background: loading
                  ? "#666"
                  : "linear-gradient(90deg, #22c55e, #15803d)",
              }}
            >
              {loading ? "Registering..." : "Capture & Register"}
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <h3 style={{ color: "lightgreen", marginBottom: "10px" }}>
              ✅ Registration Complete!
            </h3>
            <p style={{ fontWeight: "500", color: "#eee" }}>
              You can now log in with your account number and PIN.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
