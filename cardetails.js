const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setImage(src) {
  const img = document.getElementById("detail-image");
  if (img) img.src = src;
}

let selectedCar = null;

function showBookingMessage(message, isError = false) {
  const element = document.getElementById("booking-message");
  element.textContent = message;
  element.className = `form-message ${isError ? "form-message-error" : "form-message-success"}`;
}

function parseBookingHours(startDate, startTime, endDate, endTime) {
  if (!startDate || !startTime || !endDate || !endTime) return null;
  const start = new Date(`${startDate}T${startTime}:00`);
  const end = new Date(`${endDate}T${endTime}:00`);
  const diffMs = end - start;
  if (Number.isNaN(diffMs) || diffMs <= 0) return null;
  return diffMs / (1000 * 60 * 60);
}

function updateBookingSummary() {
  const priceLabel = document.getElementById("price-per-hour");
  const totalLabel = document.getElementById("booking-total");
  const startDate = document.getElementById("start-date").value;
  const startTime = document.getElementById("start-time").value;
  const endDate = document.getElementById("end-date").value;
  const endTime = document.getElementById("end-time").value;

  if (selectedCar) {
    priceLabel.textContent = `SGD ${selectedCar.price_per_hour || 0}/h`;
  }

  const hours = parseBookingHours(startDate, startTime, endDate, endTime);
  if (hours == null) {
    totalLabel.textContent = "SGD 0";
    return;
  }

  const total = (selectedCar.price_per_hour || 0) * hours;
  totalLabel.textContent = `SGD ${total.toFixed(2)}`;
}

async function loadCarDetails() {
  const carId = getQueryParam("id");
  if (!carId) {
    setText("detail-title", "No car selected");
    setText("detail-description", "Please select a car from the homepage.");
    return;
  }

  try {
    const response = await fetch(`${API}/api/car`);
    if (!response.ok) {
      throw new Error("Unable to load cars from server");
    }

    const cars = await response.json();
    selectedCar = cars.find(car => String(car.car_id) === String(carId));

    if (!selectedCar) {
      setText("detail-title", "Car not found");
      setText("detail-description", "The selected car could not be found.");
      return;
    }

    setImage(selectedCar.image_url || "https://via.placeholder.com/760x420?text=Car+Image");
    setText("detail-title", selectedCar.car_name || `Car #${selectedCar.car_id}`);
    setText("detail-description", selectedCar.car_desc || "Comfortable ride with great value and easy booking.");
    setText("detail-seats", `Seats: ${selectedCar.seat_capacity || "-"}`);
    setText("detail-price", `Price: SGD ${selectedCar.price_per_hour || "-"}/h`);
    setText("detail-transmission", `Transmission: ${selectedCar.transmission || "-"}`);
    setText("detail-fuel", `Fuel: ${selectedCar.fuel || "-"}`);
    updateBookingSummary();
  } catch (error) {
    console.error(error);
    setText("detail-title", "Unable to load car details");
    setText("detail-description", "Please check your server and try again.");
  }
}

async function createBooking(booking){

console.log("Sending booking:",booking);

const response=await fetch(
"https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com/api/booking",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(booking)
}
);


const text=await response.text();

console.log("Server response:",text);


let result;

try{
result=JSON.parse(text);
}catch{
result={message:text};
}


return{
ok:response.ok,
result:result
};

}

const bookButton = document.getElementById("bookBtn");
const startDateInput = document.getElementById("start-date");
const startTimeInput = document.getElementById("start-time");
const endDateInput = document.getElementById("end-date");
const endTimeInput = document.getElementById("end-time");

[startDateInput, startTimeInput, endDateInput, endTimeInput].forEach(input => {
  if (input) input.addEventListener("change", updateBookingSummary);
});

if (bookButton) {
  bookButton.addEventListener("click", async () => {
    if (!selectedCar) {
      showBookingMessage("Car details have not loaded yet.", true);
      return;
    }

    const userJson = localStorage.getItem("youdriveUser");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user) {
      showBookingMessage("Please log in before creating a booking.", true);
      setTimeout(() => window.location.href = "login.html", 1000);
      return;
    }

    const startDate = startDateInput.value;
    const startTime = startTimeInput.value;
    const endDate = endDateInput.value;
    const endTime = endTimeInput.value;

    if (!startDate || !endDate || !startTime || !endTime) {
      showBookingMessage("Please select the start and end dates and times.", true);
      return;
    }

    const hours = parseBookingHours(startDate, startTime, endDate, endTime);
    if (hours == null) {
      showBookingMessage("The end date and time must be later than the start.", true);
      return;
    }

    const start = new Date(`${startDate}T${startTime}:00`);
    if (start < new Date()) {
      showBookingMessage("The booking start date and time cannot be in the past.", true);
      return;
    }

    const booking = {
      user_id: user.user_id,
      car_id: selectedCar.car_id,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      booking_status: "Pending",
      payment_status: "Pending",
      total_price: Number(((selectedCar.price_per_hour || 0) * hours).toFixed(2))
    };

    try {
      bookButton.disabled = true;
      showBookingMessage("Creating your booking...");
      const { ok, result } = await createBooking(booking);
      if (ok) {
        showBookingMessage("Booking created successfully.");
        setTimeout(() => window.location.href = "bookings.html", 800);
      } else {
        showBookingMessage(result.error || "Booking could not be created.", true);
        bookButton.disabled = false;
      }
    } catch (error) {
      console.error(error);
      showBookingMessage("Unable to create booking. Please try again.", true);
      bookButton.disabled = false;
    }
  });
}

loadCarDetails();
