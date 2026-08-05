const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";

function getCurrentUser() {
    const stored = localStorage.getItem("youdriveUser");
    return stored ? JSON.parse(stored) : null;
}

function logoutUser() {

    localStorage.removeItem("youdriveUser");
    localStorage.removeItem("token");

    window.location.href="login.html";

}

const profileContainer = document.getElementById("profile-content");
const user = getCurrentUser();

if (!user) {
    profileContainer.innerHTML = `
        <div class="section-card" style="text-align:center">
            <h3>Please login first</h3>
            <a class="button button-primary" href="login.html">Login</a>
        </div>
    `;
} else {
    profileContainer.innerHTML = `
        <div class="section-card" style="max-width:520px;margin:auto">
            <h3>Account Details</h3>

            <div class="field-group">
                <label>Name</label>
                <input type="text" value="${user.full_name || ""}" disabled>
            </div>

            <div class="field-group">
                <label>Email</label>
                <input type="email" value="${user.gmail || ""}" disabled>
            </div>

            <div class="field-group">
                <label>Gender</label>
                <input type="text" value="${user.gender || ""}" disabled>
            </div>

            <div class="field-group">
                <label>Date of birth</label>
                <input type="text" value="${user.date_of_birth ? user.date_of_birth.substring(0,10) : ""}" disabled>
            </div>

            <div class="field-group">
                <label>Phone number</label>
                <input type="text" value="${user.phone_number || ""}" disabled>
            </div>

            <div style="display:flex; justify-content:space-between; gap:12px; margin-top:24px; flex-wrap:wrap;">
                <button class="button button-primary" id="update-details-button" type="button">
                    Update details
                </button>
                <button class="button" id="logout-button" type="button">
                    Log out
                </button>
            </div>
        </div>
    `;

    document.getElementById("update-details-button").addEventListener("click", () => {
        window.location.href = "profileupdate.html";
    });

    document.getElementById("logout-button").addEventListener("click", logoutUser);
}
