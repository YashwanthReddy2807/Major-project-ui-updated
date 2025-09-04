import React, { useRef } from "react";
import Webcam from "react-webcam";

const CaptureFace = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const base64 = imageSrc.split(",")[1];
      onCapture(base64);
    }
  };

  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e1b4b, #312e81, #000)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "15px",
        
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          borderRadius: "18px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
          textAlign: "center",
          padding: "25px 20px",
          color: "#f5f5f5",
        }}
      >
        <h3 style={{ marginBottom: "10px", fontWeight: "600", fontSize: "20px" }}>
          Face Verification
        </h3>
        <p style={{ marginBottom: "15px", fontSize: "13px", color: "#ccc" }}>
          Keep your face inside the circle and capture.
        </p>

        {/* Camera circle (smaller) */}
        <div
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #5b86e5",
            boxShadow: "0 0 12px rgba(91,134,229,0.5)",
            margin: "0 auto 15px",
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "rotateY(180deg)"
            }}
          />
        </div>

        {/* Capture button */}
        <button
          onClick={capture}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "25px",
            background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
            border: "none",
            color: "#fff",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.boxShadow =
              "0 0 10px rgba(91,134,229,0.7), 0 0 20px rgba(91,134,229,0.5)")
          }
          onMouseOut={(e) => (e.target.style.boxShadow = "none")}
        >
          Capture Face
        </button>
      </div>
    </div>
  );
};

export default CaptureFace;
