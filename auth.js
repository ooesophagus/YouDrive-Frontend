const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";


const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const confirmForm = document.getElementById("confirm-form");



async function postJson(url, body) {

    const response = await fetch(url, {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(body)

    });


    return response.json();

}



function showMessage(id,message,isError=false){

    const el=document.getElementById(id);

    if(!el)return;

    el.textContent=message;

    el.style.color=isError?"#d62828":"#0f6eff";

}



function setCurrentUser(user){

    localStorage.setItem(
        "youdriveUser",
        JSON.stringify(user)
    );

}



function logoutUser(){

    localStorage.removeItem("youdriveUser");

    localStorage.removeItem("token");

    window.location.href="login.html";

}





// ===============================
// REGISTER
// ===============================


if(registerForm){


registerForm.addEventListener(
"submit",
async event=>{


event.preventDefault();



const name =
registerForm.querySelector("#register-name").value.trim();


const email =
registerForm.querySelector("#register-email").value.trim();


const password =
registerForm.querySelector("#register-password").value;


const confirmPassword =
registerForm.querySelector("#register-password-confirm").value;


const role =
registerForm.querySelector("#register-role").value;



if(password!==confirmPassword){

showMessage(
"register-message",
"Passwords do not match.",
true
);

return;

}



try{


const result =
await postJson(
`${API}/api/user/register`,
{


full_name:name,

gmail:email,

password:password,

gender:"",

date_of_birth:null,

phone_number:"",

role:role


}
);



if(result.message){


showMessage(
"register-message",
"Registration successful. Please login."
);


setTimeout(()=>{

window.location.href="login.html";

},1000);



}
else{


showMessage(
"register-message",
"Registration failed.",
true
);


}



}
catch(error){


console.error(error);


showMessage(
"register-message",
"Unable to register.",
true
);



}



});


}






// ===============================
// LOGIN
// ===============================


if(loginForm){


loginForm.addEventListener(
"submit",
async event=>{


event.preventDefault();



const email =
loginForm.querySelector("#login-email").value.trim();


const password =
loginForm.querySelector("#login-password").value;


const role =
loginForm.querySelector("#login-role").value;



try{


const result =
await postJson(
`${API}/api/user/login`,
{


gmail:email,

password:password,

role:role


}
);



console.log(result);



if(result.success){



setCurrentUser(result.user);



localStorage.setItem(
"token",
JSON.stringify(result.token)
);



if(
result.user.role.toLowerCase()
==="admin"
){


window.location.href=
"admin_homepage.html";


}
else{


window.location.href=
"homepage.html";


}



}
else{


showMessage(
"login-message",
result.message || "Login failed.",
true
);


}




}
catch(error){


console.error(error);


showMessage(
"login-message",
"Invalid email or password.",
true
);



}



});


}
