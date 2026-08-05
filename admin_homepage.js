const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";
function escapeHtml(text){
    if(!text) return "";
    return String(text)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

const adminCarGrid = document.getElementById("admin-car-grid");

function renderAdminCars(cars) {
  if (!cars.length) {
    adminCarGrid.innerHTML = '<div class="empty-state">No cars have been added yet.</div>';
    return;
  }
  adminCarGrid.innerHTML = cars.map(car => `
    <article class="car-card">
      <img src="${escapeHtml(car.image_url || "https://via.placeholder.com/400x260?text=Car+Image")}" alt="${escapeHtml(car.car_name || "Car")}">
      <div class="car-card-body">
        <h3 class="car-card-title">${escapeHtml(car.car_name || `Car #${car.car_id}`)}</h3>
        <p class="car-card-description">${escapeHtml(car.car_desc || "No description provided.")}</p>
        <div class="car-card-meta"><span>${escapeHtml(car.seat_capacity || "-")} seats</span><span>${escapeHtml(car.transmission || "-")}</span></div>
        <span class="car-card-price">SGD ${escapeHtml(car.price_per_hour || 0)}/h</span>
        <div class="admin-card-actions">
          <a class="button" href="admin_update.html?id=${encodeURIComponent(car.car_id)}">Update</a>
          <button class="button button-danger" type="button" data-delete-car="${escapeHtml(car.car_id)}" data-car-name="${escapeHtml(car.car_name || "this car")}">Delete</button>
        </div>
      </div>
    </article>`).join("");
}

async function loadAdminCars() {
  try {
    const response = await fetch(`${API}/api/car`);
    if (!response.ok) throw new Error("Unable to load cars.");
    renderAdminCars(await response.json());
  } catch (error) {
    adminCarGrid.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

adminCarGrid.addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-car]");
  if (!button) return;
  if (button.dataset.confirming !== "true") {
    button.dataset.confirming = "true";
    button.textContent = "Confirm delete";
    showAdminMessage("admin-message", `Press Confirm delete to remove ${button.dataset.carName}.`, true);
    setTimeout(() => { if (button.isConnected) { button.dataset.confirming = "false"; button.textContent = "Delete"; } }, 5000);
    return;
  }
  button.disabled = true;
  try {
    await adminFetch(`/api/admin/cars/${encodeURIComponent(button.dataset.deleteCar)}`, { method: "DELETE" });
    showAdminMessage("admin-message", "Car deleted successfully.");
    await loadAdminCars();
  } catch (error) {
    showAdminMessage("admin-message", error.message, true);
    button.disabled = false;
  }
});

loadAdminCars();
