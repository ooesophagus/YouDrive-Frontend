const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";
function getCurrentAdmin() {
  try {
    const stored = localStorage.getItem("youdriveUser");
    const user = stored ? JSON.parse(stored) : null;
    return user && String(user.role).toLowerCase() === "admin" ? user : null;
  } catch (error) {
    return null;
  }
}

function formatDOB(date) {
  return date ? String(date).split("T")[0] : "";
}

const admin = getCurrentAdmin();
const form = document.getElementById("admin-profile-update-form");
const nameInput = document.getElementById("update-name");
const emailInput = document.getElementById("update-email");
const genderSelect = document.getElementById("update-gender");
const dobInput = document.getElementById("update-dob");
const phoneInput = document.getElementById("update-phone");
const messageElement = document.getElementById("update-message");
const cancelButton = document.getElementById("cancel-update");

if (!admin) {
  window.location.replace("login.html");
} else {
  nameInput.value = admin.full_name || "";
  emailInput.value = admin.gmail || admin.email || "";
  genderSelect.value = admin.gender || "";
  dobInput.value = formatDOB(admin.date_of_birth || admin.dob);
  phoneInput.value = admin.phone_number || "";
}

cancelButton.addEventListener("click", () => {
  window.location.href = "admin_profile.html";
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!admin) return;

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;

  const payload = {
    email: admin.gmail || admin.email,
    gender: genderSelect.value,
    date_of_birth: dobInput.value,
    phone_number: phoneInput.value.trim()
  };

  if (payload.phone_number && !/^\d{8}$/.test(payload.phone_number)) {
    messageElement.textContent = "Phone number must contain exactly 8 digits.";
    messageElement.style.color = "#b63a3a";
    submitButton.disabled = false;
    return;
  }
  if (payload.date_of_birth && new Date(`${payload.date_of_birth}T00:00:00`) > new Date()) {
    messageElement.textContent = "Date of birth cannot be in the future.";
    messageElement.style.color = "#b63a3a";
    submitButton.disabled = false;
    return;
  }

  try {
    const response = await Fetch(`${API}/api/user/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to update profile.");
    }

    const updatedAdmin = {
      ...admin,
      ...result.user,
      gender: genderSelect.value,
      date_of_birth: dobInput.value,
      phone_number: phoneInput.value.trim()
    };
    localStorage.setItem("youdriveUser", JSON.stringify(updatedAdmin));

    messageElement.textContent = "Profile updated successfully.";
    messageElement.style.color = "#1f6d48";
    setTimeout(() => {
      window.location.href = "admin_profile.html";
    }, 1000);
  } catch (error) {
    messageElement.textContent = error.message || "Unable to update profile.";
    messageElement.style.color = "#b63a3a";
    submitButton.disabled = false;
    console.error(error);
  }
});
