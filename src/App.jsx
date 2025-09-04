import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("landing"); // landing, login, register, dashboard
  const [sessionToken, setSessionToken] = useState(null);
  const [accountNumber, setAccountNumber] = useState(null);

  const handleLoginSuccess = (token, accNum) => {
    setSessionToken(token);
    setAccountNumber(accNum);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setSessionToken(null);
    setAccountNumber(null);
    setPage("login");
  };

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onLogin={() => setPage("login")}
          onRegister={() => setPage("register")}
        />
      )}

      {page === "login" && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <RegisterForm onSwitchToLogin={() => setPage("login")} />
      )}

      {page === "dashboard" && (
        <Dashboard
          sessionToken={sessionToken}
          accountNumber={accountNumber}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;
