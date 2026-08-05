const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";

function getCurrentUser(){
const stored=localStorage.getItem("youdriveUser");
return stored?JSON.parse(stored):null;
}

const user=getCurrentUser();

const form=document.getElementById("profile-update-form");
const nameInput=document.getElementById("update-name");
const emailInput=document.getElementById("update-email");
const genderSelect=document.getElementById("update-gender");
const dobInput=document.getElementById("update-dob");
const phoneInput=document.getElementById("update-phone");
const messageEl=document.getElementById("update-message");
const cancelButton=document.getElementById("cancel-update");


function formatDOB(date){

if(!date){
return "";
}

return date.substring(0,10);

}


if(!user){

document.body.innerHTML=`
<div class="section-card" style="text-align:center;max-width:520px;margin:60px auto;">
<h3>Please login first</h3>
<a class="button button-primary" href="login.html">Login</a>
</div>
`;

}else{


nameInput.value=user.full_name||"";

emailInput.value=user.gmail||"";

genderSelect.value=user.gender||"";

dobInput.value=formatDOB(user.date_of_birth||user.dob);

phoneInput.value=user.phone_number||"";


}



cancelButton.addEventListener("click",()=>{

window.location.href="profile.html";

});



form.addEventListener("submit",async event=>{

event.preventDefault();


if(!user){

messageEl.textContent="Please login first.";

return;

}



const payload={
email:user.gmail||user.email,
gender:genderSelect.value,
date_of_birth:dobInput.value,
phone_number:phoneInput.value.trim()
};



try{


const response=await fetch(`${API}/api/user/profile`,{

method:"PATCH",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(payload)

});


const result=await response.json();



if(!response.ok||!result.success){

throw new Error(result.message||"Unable to update profile.");

}



const updatedUser={
...user,
gender:genderSelect.value,
date_of_birth:dobInput.value,
phone_number:phoneInput.value.trim()
};

localStorage.setItem(
"youdriveUser",
JSON.stringify(updatedUser)
);



messageEl.textContent="Profile updated successfully.";

messageEl.style.color="#0f6eff";



setTimeout(()=>{

window.location.href="profile.html";

},1000);



}catch(error){


messageEl.textContent=error.message||"Unable to update profile.";

messageEl.style.color="#d62828";


console.error(error);


}


});