
function escapeHtml(text){
    if(!text) return "";
    return String(text)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

const userList = document.getElementById("admin-user-list");

function formatJoined(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).split("T")[0] : date.toLocaleDateString("en-SG");
}

function renderUsers(users) {
  if (!users.length) { userList.innerHTML = '<tr><td colspan="5">No user accounts found.</td></tr>'; return; }
  userList.innerHTML = users.map(user => `<tr>
    <td><strong>${escapeHtml(user.full_name || "-")}</strong></td><td>${escapeHtml(user.gmail || "-")}</td>
    <td>${escapeHtml(user.phone_number || "-")}</td><td>${escapeHtml(formatJoined(user.created_at))}</td>
    <td><button class="button button-danger admin-small-button" type="button" data-delete-user="${escapeHtml(user.user_id)}" data-user-name="${escapeHtml(user.full_name || user.gmail || "this user")}">Delete</button></td>
  </tr>`).join("");
}

async function loadUsers() {

  try {

      const data = await adminFetch(`${API}/api/user`);

      console.log(data);

      renderUsers(data);

  }
  catch(error){

      userList.innerHTML =
      `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;

  }

}

userList.addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-user]");
  if (!button) return;
  if (button.dataset.confirming !== "true") {
    button.dataset.confirming = "true";
    button.textContent = "Confirm delete";
    showAdminMessage("user-message", `Press Confirm delete to remove ${button.dataset.userName}.`, true);
    setTimeout(() => { if (button.isConnected) { button.dataset.confirming = "false"; button.textContent = "Delete"; } }, 5000);
    return;
  }
  button.disabled = true;
  try {
    await adminFetch(`/api/user/${encodeURIComponent(button.dataset.deleteUser)}`, { method: "DELETE" });
    showAdminMessage("user-message", "User deleted successfully."); await loadUsers();
  } catch (error) { showAdminMessage("user-message", error.message, true); button.disabled = false; }
});

loadUsers();
