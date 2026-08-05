
const addCarForm = document.getElementById("add-car-form");

function readCarForm() {
    return {
        car_name: document.getElementById("car-name").value.trim(),
        image_url: document.getElementById("image-url").value.trim(),
        seat_capacity: Number(document.getElementById("seat-capacity").value),
        price_per_hour: Number(document.getElementById("price-per-hour").value),
        car_desc: document.getElementById("car-desc").value.trim()
    };
}


addCarForm.addEventListener("submit", async event => {

    event.preventDefault();

    const car = readCarForm();
    if (!car.car_name) return showAdminMessage("form-message", "Car name is required.", true);
    if (!Number.isInteger(car.seat_capacity) || car.seat_capacity <= 0) return showAdminMessage("form-message", "Seat capacity must be a positive whole number.", true);
    if (!Number.isFinite(car.price_per_hour) || car.price_per_hour <= 0) return showAdminMessage("form-message", "Price must be greater than zero.", true);
    if (car.car_desc.length > 500) return showAdminMessage("form-message", "Description cannot exceed 500 characters.", true);
    if (car.image_url) {
        try { new URL(car.image_url); }
        catch { return showAdminMessage("form-message", "Please enter a valid image URL.", true); }
    }

    const button = addCarForm.querySelector("button[type='submit']");

    button.disabled = true;


    try {

        await adminFetch(`${API}/api/admin/cars`, {
            method:"POST",
            body:JSON.stringify(car)
        });


        showAdminMessage(
            "form-message",
            "Car added successfully."
        );


        setTimeout(()=>{
            window.location.href="admin_homepage.html";
        },700);


    }catch(error){

        showAdminMessage(
            "form-message",
            error.message,
            true
        );

        button.disabled=false;

    }

});
