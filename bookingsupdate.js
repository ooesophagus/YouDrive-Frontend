const API="https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";

function showPageMessage(message,isError=false){
const element=document.getElementById("booking-action-message");
if(!element)return;
element.textContent=message;
element.className=`form-message ${isError?"form-message-error":"form-message-success"}`;
}

function getCurrentUser(){
const stored=localStorage.getItem("youdriveUser");
return stored?JSON.parse(stored):null;
}

function getQueryParam(name){
const params=new URLSearchParams(window.location.search);
return params.get(name);
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

async function fetchPaymentStatus(bookingId){
const response=await fetch(`${API}/api/payment/booking/${bookingId}`);

if(!response.ok){
throw new Error("Unable to load payment status.");
}

const data=await response.json();

return Array.isArray(data)?data[0]:data;
}

async function fetchCars(){
const response=await fetch(`${API}/api/cars`);

if(!response.ok){
throw new Error("Unable to load cars.");
}

return response.json();
}

async function updateBooking(bookingId,payload){

const response=await fetch(`${API}/api/booking/${bookingId}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
});

if(!response.ok){
throw new Error("Unable to update booking.");
}

return response.json();
}

async function deleteBooking(bookingId){

const response=await fetch(`${API}/api/booking/${bookingId}`,{
method:"DELETE"
});

if(!response.ok){
throw new Error("Unable to delete booking.");
}

return response.json();
}

function setText(id,text){

const element=document.getElementById(id);

if(element){
element.textContent=text;
}

}

function setInputValue(id,value){

const element=document.getElementById(id);

if(element){
element.value=value||"";
}

}

function getInputValue(id){

const element=document.getElementById(id);

return element?element.value:"";

}

function calculateTotalPrice(hourlyRate,startDate,startTime,endDate,endTime){

if(!startDate||!endDate||!startTime||!endTime){
return 0;
}

const start=new Date(`${startDate}T${startTime}`);
const end=new Date(`${endDate}T${endTime}`);

if(isNaN(start)||isNaN(end)||end<=start){
return 0;
}

const hours=Math.ceil((end-start)/(1000*60*60));

return Number((hourlyRate*hours).toFixed(2));

}

function buildStatusButtons(booking){

const ongoingButton=document.getElementById("status-ongoing");
const completedButton=document.getElementById("status-completed");
const paymentPage=document.getElementById("payment-page");

const paymentCompleted=booking.payment_status==="Completed";


if(booking.booking_status==="Pending"&&!paymentCompleted){

ongoingButton.disabled=true;
completedButton.disabled=true;

}
else if(booking.booking_status==="Pending"&&paymentCompleted){

ongoingButton.disabled=false;
completedButton.disabled=true;

}
else if(booking.booking_status==="Ongoing"){

ongoingButton.disabled=true;
completedButton.disabled=false;

}
else{

ongoingButton.disabled=true;
completedButton.disabled=true;

}


paymentPage.onclick=()=>{

window.location.href=
`booking_payment.html?booking_id=${booking.booking_id}`;

};

}


async function initPage(){

const user=getCurrentUser();

const bookingId=getQueryParam("booking_id");


if(!user){

showPageMessage("Please log in to manage bookings.",true);
window.location.href="login.html";
return;

}


if(!bookingId){

showPageMessage("Booking not found.",true);
window.location.href="bookings.html";
return;

}


try{


const booking=await fetchBooking(bookingId);

const payment=await fetchPaymentStatus(bookingId);

booking.payment_status=payment.payment_status;


const cars=await fetchCars();


const car=cars.find(
item=>String(item.car_id)===String(booking.car_id)
);



setText(
"booking-car",
car?car.car_name:`Car #${booking.car_id}`
);


setText(
"booking-status",
booking.booking_status||"Pending"
);


setText(
"booking-payment-status",
booking.payment_status||"Pending"
);


setText(
"booking-start-date",
formatDate(booking.start_date)
);


setText(
"booking-end-date",
formatDate(booking.end_date)
);


setText(
"booking-start-time",
formatTime(booking.start_time)
);


setText(
"booking-end-time",
formatTime(booking.end_time)
);


setText(
"booking-total",
`SGD ${Number(booking.total_price||0).toFixed(2)}`
);



setInputValue(
"edit-start-date",
formatDate(booking.start_date)
);


setInputValue(
"edit-end-date",
formatDate(booking.end_date)
);


setInputValue(
"edit-start-time",
booking.start_time
);


setInputValue(
"edit-end-time",
booking.end_time
);



buildStatusButtons(booking);



document.getElementById("booking-form").onsubmit=async(event)=>{

event.preventDefault();

const startDate=getInputValue("edit-start-date");
const endDate=getInputValue("edit-end-date");
const startTime=getInputValue("edit-start-time");
const endTime=getInputValue("edit-end-time");
const start=new Date(`${startDate}T${startTime}`);
const end=new Date(`${endDate}T${endTime}`);

if(!startDate||!endDate||!startTime||!endTime){
showPageMessage("Please complete all booking dates and times.",true);
return;
}
if(Number.isNaN(start.getTime())||Number.isNaN(end.getTime())||end<=start){
showPageMessage("The end date and time must be later than the start.",true);
return;
}
if(start<new Date()){
showPageMessage("The booking start date and time cannot be in the past.",true);
return;
}

const saveButton=event.currentTarget.querySelector("button[type='submit']");
saveButton.disabled=true;
const updatedTotal=calculateTotalPrice(Number(car&&car.price_per_hour||0),startDate,startTime,endDate,endTime);

try{

await updateBooking(
bookingId,
{
start_date:startDate,
end_date:endDate,
start_time:startTime,
end_time:endTime,
booking_status:booking.booking_status,
total_price:updatedTotal
}
);


showPageMessage("Booking updated.");

window.location.reload();


}catch(error){

console.error(error);

showPageMessage("Unable to save booking.",true);
saveButton.disabled=false;

}

};



document.getElementById("delete-booking").onclick=async()=>{

const deleteButton=document.getElementById("delete-booking");
if(deleteButton.dataset.confirming!=="true"){
deleteButton.dataset.confirming="true";
deleteButton.textContent="Confirm delete";
showPageMessage("Press Confirm delete to permanently remove this booking.",true);
setTimeout(()=>{if(deleteButton.isConnected){deleteButton.dataset.confirming="false";deleteButton.textContent="Delete booking";}},5000);
return;
}

try{

await deleteBooking(bookingId);

showPageMessage("Booking deleted.");

window.location.href="bookings.html";


}catch(error){

console.error(error);

showPageMessage("Unable to delete booking.",true);

}

};



document.getElementById("status-ongoing").onclick=async()=>{


if(booking.payment_status!=="Completed"){

showPageMessage("Payment must be completed first.",true);

return;

}


await updateBooking(
bookingId,
{
booking_status:"Ongoing"
}
);


showPageMessage("Booking updated.");

window.location.reload();


};



document.getElementById("status-completed").onclick=async()=>{


if(booking.booking_status!=="Ongoing"){

showPageMessage("Booking must be ongoing before it can be completed.",true);

return;

}


await updateBooking(
bookingId,
{
booking_status:"Completed"
}
);


showPageMessage("Booking completed.");

window.location.reload();


};



}catch(error){

console.error(error);

showPageMessage("Unable to load booking details.",true);

window.location.href="bookings.html";

}

}


initPage();
