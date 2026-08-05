
const updateForm = document.getElementById("update-car-form");
const carId = new URLSearchParams(window.location.search).get("id");

function setValue(id, value) { document.getElementById(id).value = value == null ? "" : value; }
function getUpdatedCar() {
  return {
    car_name: document.getElementById("car-name").value.trim(), image_url: document.getElementById("image-url").value.trim(),
    seat_capacity: Number(document.getElementById("seat-capacity").value), price_per_hour: Number(document.getElementById("price-per-hour").value),
    car_desc: document.getElementById("car-desc").value.trim()
  };
}

async function loadCar() {

    if (!carId) {
        showAdminMessage(
            "form-message",
            "No car was selected.",
            true
        );

        updateForm.querySelector("button").disabled=true;
        return;
    }


    try {

        const cars = await adminFetch(
            `/api/car/${encodeURIComponent(carId)}`
        );


        const car = cars[0];


        setValue(
            "car-name",
            car.car_name
        );

        setValue(
            "image-url",
            car.image_url
        );

        setValue(
            "seat-capacity",
            car.seat_capacity
        );

        setValue(
            "price-per-hour",
            car.price_per_hour
        );

        setValue(
            "car-desc",
            car.car_desc
        );


    } catch(error){

        showAdminMessage(
            "form-message",
            error.message,
            true
        );

    }
}

updateForm.addEventListener("submit", async event => {
  event.preventDefault();
  const car = getUpdatedCar();
  if (!car.car_name) return showAdminMessage("form-message", "Car name is required.", true);
  if (!Number.isInteger(car.seat_capacity) || car.seat_capacity <= 0) return showAdminMessage("form-message", "Seat capacity must be a positive whole number.", true);
  if (!Number.isFinite(car.price_per_hour) || car.price_per_hour <= 0) return showAdminMessage("form-message", "Price must be greater than zero.", true);
  if (car.car_desc.length > 500) return showAdminMessage("form-message", "Description cannot exceed 500 characters.", true);
  if (car.image_url) { try { new URL(car.image_url); } catch { return showAdminMessage("form-message", "Please enter a valid image URL.", true); } }
  const button = updateForm.querySelector("button[type='submit']"); button.disabled = true;
  try {
    await adminFetch(`/api/car/${encodeURIComponent(carId)}`, {
    method:"PUT",
    body:JSON.stringify(car)
});
    showAdminMessage("form-message", "Car updated successfully."); setTimeout(() => window.location.href = "admin_homepage.html", 700);
  } catch (error) { showAdminMessage("form-message", error.message, true); button.disabled = false; }
});

loadCar();
