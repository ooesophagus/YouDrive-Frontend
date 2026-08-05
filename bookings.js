const API="https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";


function getCurrentUser(){
const stored=localStorage.getItem("youdriveUser");
return stored?JSON.parse(stored):null;
}


async function fetchCars(){

const response=await fetch(`${API}/api/car`);

if(!response.ok){
throw new Error("Unable to load cars");
}

return response.json();

}


async function fetchBookings(userId){

const response=await fetch(`${API}/api/booking/user/${userId}`);

if(!response.ok){
throw new Error("Unable to load bookings");
}

return response.json();

}


function formatDate(date){

if(!date)return"";

if(date.includes("T")){
return date.split("T")[0];
}

return date;

}



function formatTime(time){

if(!time)return"";

let parts=time.split(":");

let hour=Number(parts[0]);
let minute=parts[1];

let ampm=hour>=12?"PM":"AM";

hour=hour%12||12;

return `${hour}:${minute} ${ampm}`;

}



function createBookingCard(booking,car){


const carName=car?car.car_name:`Car ${booking.car_id}`;

const image=car?car.image_url:"https://via.placeholder.com/120";


let button="";


if(booking.booking_status==="Completed"){

button=`

<button class="button button-primary" onclick="window.location.href='bookingsupdate.html?booking_id=${booking.booking_id}'">
View
</button>

`;

}else{

button=`

<button class="button button-primary" onclick="window.location.href='bookingsupdate.html?booking_id=${booking.booking_id}'">
Manage booking
</button>

`;

}



return`

<article class="booking-card">


<img src="${image}"
class="booking-image">


<div class="booking-info">


<h3>${carName}</h3>


<p>
${formatDate(booking.start_date)}
-
${formatDate(booking.end_date)}
</p>


<div class="booking-bottom">


<span>
${booking.booking_status}
</span>


${button}


</div>


</div>


</article>

`;

}



async function loadBookings(){


const user=getCurrentUser();


if(!user){

document.getElementById("pending-container").innerHTML=
"<p>Please login first.</p>";

return;

}


try{


const bookings=await fetchBookings(user.user_id);

const cars=await fetchCars();



const pending=
bookings.filter(
booking=>booking.booking_status==="Pending"
);


const ongoing=
bookings.filter(
booking=>booking.booking_status==="Ongoing"
);


const completed=
bookings.filter(
booking=>booking.booking_status==="Completed"
);



displayBookings(
"pending-container",
pending,
cars
);


displayBookings(
"ongoing-container",
ongoing,
cars
);


displayBookings(
"completed-container",
completed,
cars
);



}catch(error){

console.error(error);


document.getElementById("pending-container").innerHTML=
"<p>Unable to load bookings.</p>";

}

}




function displayBookings(containerId,bookings,cars){


const container=document.getElementById(containerId);


if(bookings.length===0){

container.innerHTML="<p>No bookings available.</p>";

return;

}



let html="";


bookings.forEach(booking=>{


const car=cars.find(
item=>String(item.car_id)===String(booking.car_id)
);


html+=createBookingCard(
booking,
car
);


});


container.innerHTML=html;


}



loadBookings();
