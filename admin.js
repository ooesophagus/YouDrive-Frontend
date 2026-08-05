const API = "https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";
const user=JSON.parse(localStorage.getItem("youdriveUser"));

if(!user||user.role!=="admin"){
    window.location.href="homepage.html";
}


async function adminFetch(url,options={}){

    const admin=JSON.parse(localStorage.getItem("youdriveUser"));

    const response=await fetch(url,{
        ...options,
        headers:{
            "Content-Type":"application/json",
            "x-admin-email":admin.gmail
        }
    });


    const data=await response.json();


    if(!response.ok){
        throw new Error(data.message||"Request failed.");
    }


    return data;

}



function showAdminMessage(id,message,isError=false){

    const element=document.getElementById(id);

    if(!element){
        return;
    }


    element.textContent=message;

    element.style.color=isError?"#d62828":"#0f6eff";

}