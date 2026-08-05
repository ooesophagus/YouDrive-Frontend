const API =
"https://bxfxjwer34.execute-api.ap-southeast-1.amazonaws.com";



async function adminFetch(url,options={}){


const response =
await fetch(
url,
{

...options,

headers:{

"Content-Type":"application/json"

}

}
);



if(!response.ok){

throw new Error(
"Request failed"
);

}



return response.json();



}




function showAdminMessage(
id,
message,
isError=false
){


const el=document.getElementById(id);


if(el){

el.textContent=message;

el.style.color =
isError ? "red":"green";


}


}


    element.textContent=message;

    element.style.color=isError?"#d62828":"#0f6eff";

}
