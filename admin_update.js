const updateForm = document.getElementById("update-car-form");

const carId = new URLSearchParams(window.location.search).get("id");


function setValue(id,value){

    const element=document.getElementById(id);

    if(element){
        element.value=value ?? "";
    }

}



function getUpdatedCar(){

    return {

        car_name:
        document.getElementById("car-name").value.trim(),

        image_url:
        document.getElementById("image-url").value.trim(),

        seat_capacity:
        Number(document.getElementById("seat-capacity").value),

        price_per_hour:
        Number(document.getElementById("price-per-hour").value),

        car_desc:
        document.getElementById("car-desc").value.trim()

    };

}



async function loadCar(){


    if(!carId){

        showAdminMessage(
            "form-message",
            "No car selected.",
            true
        );

        return;

    }



    try{


        const cars = await adminFetch(
    `${API}/api/car/${encodeURIComponent(carId)}`
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



    }
    catch(error){

        console.error(error);

        showAdminMessage(
            "form-message",
            error.message,
            true
        );

    }


}




updateForm.addEventListener(
"submit",
async event=>{


event.preventDefault();



const car=getUpdatedCar();



const button=
updateForm.querySelector(
"button[type='submit']"
);



button.disabled=true;



try{


await adminFetch(
    `${API}/api/car/${encodeURIComponent(carId)}`,
    {
        method:"PUT",
        body:JSON.stringify(car)
    }
);



showAdminMessage(
"form-message",
"Car updated successfully."
);



setTimeout(()=>{

window.location.href=
"admin_homepage.html";

},700);



}
catch(error){


console.error(error);


showAdminMessage(
"form-message",
error.message,
true
);


button.disabled=false;


}



});



loadCar();
