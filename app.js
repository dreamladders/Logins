const API_URL = "https://script.google.com/macros/s/AKfycbxls8enh2DG61oFQ3EywNUexSGjlc-tMdwwhU8oVNE3tL4VSd0wuHEw9y4lurJBolHbvg/exec";

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  if (!username || !password) {
    message.innerHTML = "Please enter username and password.";
    return;
  }

  message.innerHTML = "Logging in...";
  const passwordHash = await hashPassword(password);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // Avoid strict CORS preflight issues with GAS
      body: JSON.stringify({ action: "login", username, passwordHash })
    });

    const result = await response.json();

    if (result.status) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("username", result.data.username);
      localStorage.setItem("role", result.data.role);

      window.location.href = result.data.role === "Admin" ? "admin.html" : "dashboard.html";
    } else {
      message.innerHTML = result.message;
    }
  } catch (error) {
    message.innerHTML = "Server connection failed.";
    console.error(error);
  }
}

function togglePassword() {
  const pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
}
