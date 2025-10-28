const API_BASE = 'https://thco57zmak.execute-api.us-east-1.amazonaws.com/dev';

// STEP 1: Send OTP (includes name + email)
export async function sendOtp(name, email) {
  return fetch(`${API_BASE}/register/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
}

// STEP 2: Verify OTP
export async function verifyOtp(email, otp) {
  return fetch(`${API_BASE}/register/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
}

// STEP 3: Capture Face (after OTP verified)
export async function captureFace(email, faceImageBase64) {
  return fetch(`${API_BASE}/register/capture-face`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, face_image_base64: faceImageBase64 })
  });
}

// Login
export async function loginUser(accountNumber, pin, faceImageBase64) {
  return fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account_number: accountNumber, pin, face_image_base64: faceImageBase64 })
  });
}

// Fund Transfer
export async function transferFunds(
  fromAccount,
  toAccount,
  amount,
  sessionToken,
  faceImageBase64 = "",
  userIp = "Unknown" // 👈 Add userIp parameter
) {
  const res = await fetch(`${API_BASE}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      from_account: fromAccount,
      to_account: toAccount,
      amount,
      face_image_base64: faceImageBase64,
      user_ip: userIp, // 👈 Send real client IP to backend
    }),
  });

  const lambdaResponse = await res.json();

  // Parse the nested body (Lambda proxy integration)
  let data;
  try {
    data =
      typeof lambdaResponse.body === "string"
        ? JSON.parse(lambdaResponse.body)
        : lambdaResponse.body;
  } catch (err) {
    data = { message: "Invalid response from server" };
  }

  // Handle Lambda errors
  if (lambdaResponse.statusCode >= 400) {
    throw new Error(data.message || "Transfer failed");
  }

  return data;
}


// Transactions
export async function getTransactions(sessionToken, accountNumber) {
  return fetch(`${API_BASE}/transactions?AccountNumber=${accountNumber}`, {
    headers: { Authorization: sessionToken }
  });
}

// Change PIN
export async function changePin(email, newPin) {
  return fetch(`${API_BASE}/settings/change-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, new_pin: newPin }),
  });
}

// Continuous Face Verify
export async function continuousFaceVerify(sessionToken, accountNumber, faceImageBase64) {
  return fetch(`${API_BASE}/session/face-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: sessionToken },
    body: JSON.stringify({ account_number: accountNumber, face_image_base64: faceImageBase64 })
  });
}

// User Info
export async function getUserInfo(sessionToken, AccountNumber) {
  return fetch(`${API_BASE}/user-info?AccountNumber=${AccountNumber}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    }
  });
}

// VPN Check (only log out if VPN detected)
// api.js
export async function vpnCheck(accountNumber, email) {
  try {
    // Get public IP
    const ipRes = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipRes.json();

    // Call VPN API
    const res = await fetch(`${API_BASE}/session/vpn-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_number: accountNumber,
        ip_address: ipData.ip,
        email,
      }),
    });

    const raw = await res.json();

    // Parse nested body
    let parsedBody = raw;
    if (raw.body && typeof raw.body === "string") {
      parsedBody = JSON.parse(raw.body);
    }

    // ✅ Exact match check
    const vpnDetected =
      parsedBody.message &&
      parsedBody.message.toLowerCase() === "vpn detected";

    return { vpnDetected, message: parsedBody.message || "No message" };
  } catch (err) {
    console.error("VPN check error:", err);
    return { vpnDetected: false, error: err };
  }
}
