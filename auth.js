const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const confirmForm = document.getElementById("confirm-form");

async function postJson(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return response.json();
}

function showMessage(elementId, message, isError = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.style.color = isError ? "#d62828" : "#0f6eff";
}

function setCurrentUser(user) {
    localStorage.setItem("youdriveUser", JSON.stringify(user));
}

function getCurrentUser() {
    const stored = localStorage.getItem("youdriveUser");
    return stored ? JSON.parse(stored) : null;
}

function logoutUser() {
    localStorage.removeItem("youdriveUser");
    window.location.href = "profile.html";
}

if (registerForm) {
    registerForm.addEventListener("submit", async event => {
        event.preventDefault();

        const name = registerForm.querySelector("#register-name").value.trim();
        const email = registerForm.querySelector("#register-email").value.trim();
        const password = registerForm.querySelector("#register-password").value;
        const confirmPassword = registerForm.querySelector("#register-password-confirm").value;
        const role = registerForm.querySelector("#register-role").value;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showMessage("register-message", "Please enter a valid email address.", true);
          return;
        }

        if (password.length < 8) {
          showMessage("register-message", "Password must contain at least 8 characters.", true);
          return;
        }

        if (password !== confirmPassword) {
            showMessage("register-message", "Passwords do not match.", true);
            return;
        }

        try {
            const result = await postJson(`${API}/api/user/register`, {

    full_name: name,

    gmail: email,

    password: password,

    gender: "",

    date_of_birth: null,

    phone_number: "",

    role: role

});
            if (result.success) {
                showMessage("register-message", "Registration successful. Please log in.");
                setTimeout(() => window.location.href = "login.html", 1200);
            } else {
                showMessage("register-message", result.message || "Registration failed.", true);
            }
        } catch (error) {
            showMessage("register-message", "Unable to register. Try again later.", true);
            console.error(error);
        }
    });
}

if(loginForm){

loginForm.addEventListener("submit",async event=>{

event.preventDefault();

const loginButton=loginForm.querySelector("button[type='submit']");
loginButton.disabled=true;


const email=loginForm.querySelector("#login-email").value.trim();

const password=loginForm.querySelector("#login-password").value;

const role=loginForm.querySelector("#login-role").value;



try{


const result = await postJson(`${API}/api/user/login`, {

gmail: email,

password: password,

role: role

});



if(result.success){


    console.log("LOGIN USER:", result.user);


    // Save using your existing system
    setCurrentUser(result.user);


    // Also save token if needed
    localStorage.setItem(
        "token",
        JSON.stringify(result.token)
    );



    const userRole = result.user.role;


    if(userRole === "Admin"){

        window.location.href =
        "admin_homepage.html";

    }
    else{

        window.location.href =
        "homepage.html";

    }


}


}else{

showMessage(
"login-message",
result.message || "Login failed.",
true
);

if((result.message||"").includes("not been confirmed")){
confirmForm.hidden=false;
confirmForm.querySelector("#confirm-email").value=email;
}

loginButton.disabled=false;


}

}catch(error){


console.error(error);


showMessage(
"login-message",
"Invalid email or password.",
true
);

loginButton.disabled=false;


}

if(confirmForm){
confirmForm.addEventListener("submit",async event=>{
event.preventDefault();
const email=confirmForm.querySelector("#confirm-email").value.trim();
const code=confirmForm.querySelector("#confirmation-code").value.trim();
if(!/^\d{6}$/.test(code)){
showMessage("confirm-message","Confirmation code must contain 6 digits.",true);
return;
}
const button=confirmForm.querySelector("button[type='submit']");
button.disabled=true;
try{
const result=await postJson("/api/confirm",{email,code});
showMessage("confirm-message",result.message||"Confirmation completed.",!result.success);
if(result.success){
confirmForm.hidden=true;
loginForm.querySelector("#login-email").value=email;
}
}catch(error){
showMessage("confirm-message","Unable to confirm account. Try again.",true);
console.error(error);
}finally{
button.disabled=false;
}
});
}


});


}

