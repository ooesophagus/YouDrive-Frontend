
function getCurrentAdmin() {
  try {
    const stored = localStorage.getItem("youdriveUser");
    const user = stored ? JSON.parse(stored) : null;
    return user && String(user.role).toLowerCase() === "admin" ? user : null;
  } catch (error) {
    return null;
  }
}

function logoutAdmin() {
  localStorage.removeItem("youdriveUser");
  window.location.href = "login.html";
}

function safeValue(value) {
  return value == null ? "" : String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const profileContainer = document.getElementById("profile-content");
const admin = getCurrentAdmin();

if (!admin) {
  window.location.replace("login.html");
} else {
  profileContainer.innerHTML = `
    <div class="section-card" style="max-width:520px;margin:auto">
      <h3>Administrator Account Details</h3>

      <div class="field-group">
        <label>Name</label>
        <input type="text" value="${safeValue(admin.full_name)}" disabled>
      </div>

      <div class="field-group">
        <label>Email</label>
        <input type="email" value="${safeValue(admin.gmail)}" disabled>
      </div>

      <div class="field-group">
        <label>Role</label>
        <input type="text" value="${safeValue(admin.role)}" disabled>
      </div>

      <div class="field-group">
        <label>Gender</label>
        <input type="text" value="${safeValue(admin.gender)}" disabled>
      </div>

      <div class="field-group">
        <label>Date of birth</label>
        <input type="text" value="${safeValue(admin.date_of_birth ? admin.date_of_birth.substring(0, 10) : "")}" disabled>
      </div>

      <div class="field-group">
        <label>Phone number</label>
        <input type="text" value="${safeValue(admin.phone_number)}" disabled>
      </div>

      <div style="display:flex;justify-content:space-between;gap:12px;margin-top:24px;flex-wrap:wrap">
        <button class="button button-primary" id="update-details-button" type="button">Update details</button>
        <button class="button" id="logout-button" type="button">Log out</button>
      </div>
    </div>`;

  document.getElementById("update-details-button").addEventListener("click", () => {
    window.location.href = "admin_profile_update.html";
  });
  document.getElementById("logout-button").addEventListener("click", logoutAdmin);
}
