const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";
function getAdminUser() {
  try {
    const user = JSON.parse(localStorage.getItem("youdriveUser"));
    return user && String(user.role).toLowerCase() === "admin" ? user : null;
  } catch {
    return null;
  }
}

function requireAdminPage() {
  const user = getAdminUser();
  if (!user) {
    localStorage.removeItem("youdriveUser");
    window.location.replace("login.html");
    return null;
  }
  return user;
}

async function adminFetch(url, options = {}) {
  const user = getAdminUser();
  if (!user) {
    window.location.replace("login.html");
    throw new Error("Admin login required.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
      "X-Admin-Email": user.gmail || user.email
    }
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("youdriveUser");
    window.location.replace("login.html");
    throw new Error(data.message || "Admin access required.");
  }
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value == null ? "" : String(value);
  return element.innerHTML;
}

function showAdminMessage(id, message, isError = false) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = message;
  element.className = `admin-message ${isError ? "admin-message-error" : "admin-message-success"}`;
}

requireAdminPage();
