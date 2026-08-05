const API="https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";

function showPaymentMessage(message,isError=false){
const element=document.getElementById("payment-message");
if(!element)return;
element.textContent=message;
element.className=`form-message ${isError?"form-message-error":"form-message-success"}`;
}

function getQueryParam(name){
const params=new URLSearchParams(window.location.search);
return params.get(name);
}

function getCurrentUser(){
const stored=localStorage.getItem("youdriveUser");
return stored?JSON.parse(stored):null;
}

function formatDate(dateString){
if(!dateString)return"";
if(dateString.includes("T"))return dateString.split("T")[0];
return dateString;
}

function formatTime(timeString){
if(!timeString)return"";
const parts=timeString.split(":");
const hour=Number(parts[0]);
const minute=parts[1];
const suffix=hour>=12?"PM":"AM";
const displayHour=hour%12===0?12:hour%12;
return`${displayHour}:${minute} ${suffix}`;
}

async function fetchBooking(bookingId){

const response=await fetch(`${API}/api/booking/${bookingId}`);

if(!response.ok){
throw new Error("Unable to load booking.");
}

const data=await response.json();

return Array.isArray(data)?data[0]:data;

}

async function fetchPayment(bookingId){

const response=await fetch(`${API}/api/payment/booking/${bookingId}`);

if(!response.ok){
throw new Error("Unable to load payment.");
}

const data=await response.json();

return Array.isArray(data)?data[0]:data;

}

async function fetchCar(carId){

const response=await fetch(`${API}/api/car`);

if(!response.ok){
throw new Error("Unable to load cars.");
}

const cars=await response.json();

return cars.find(
car=>String(car.car_id)===String(carId)
);

}


async function updatePayment(bookingId){

const response=await fetch(
`${API}/api/payment/booking/${bookingId}`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
payment_status:"Completed"
})
}
);


if(!response.ok){

throw new Error("Unable to update payment.");

}


return response.json();

}


function setText(id,value){

const element=document.getElementById(id);

if(element){
element.textContent=value;
}

}


async function initPage(){

const user=getCurrentUser();

const bookingId=getQueryParam("booking_id");


if(!user){

showPaymentMessage("Please log in before making payment.",true);

return;

}


try{


const booking=await fetchBooking(bookingId);

const payment=await fetchPayment(bookingId);

const car=await fetchCar(booking.car_id);



setText(
"summary-car",
car?car.car_name:`Car #${booking.car_id}`
);


setText(
"summary-dates",
`${formatDate(booking.start_date)} to ${formatDate(booking.end_date)}`
);


setText(
"summary-time",
`${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`
);


setText(
"summary-booking-status",
booking.booking_status
);


setText(
"summary-payment-status",
payment.payment_status
);


setText(
"summary-price",
`SGD ${Number(booking.total_price||0).toFixed(2)}`
);



const button=document.getElementById("pay-button");


button.textContent=
`Pay SGD ${Number(booking.total_price||0).toFixed(2)}`;



button.onclick=async()=>{


try{

const email=document.getElementById("billing-email").value.trim();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
showPaymentMessage("Please enter a valid billing email address.",true);
return;
}
button.disabled=true;
showPaymentMessage("Processing payment...");


await updatePayment(bookingId);


showPaymentMessage("Payment completed successfully.");


window.location.href=
`bookingsupdate.html?booking_id=${bookingId}`;


}catch(error){

console.error(error);

showPaymentMessage("Payment failed. Please try again.",true);
button.disabled=false;

}


};



}catch(error){

console.error(error);

showPaymentMessage("Unable to load booking payment information.",true);

}

}


initPage();
