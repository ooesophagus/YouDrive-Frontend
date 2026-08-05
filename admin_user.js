function escapeHtml(text){

    if(!text) return "";

    return String(text)

    .replace(/&/g,"&amp;")

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;")

    .replace(/"/g,"&quot;")

    .replace(/'/g,"&#039;");

}



const userList =
document.getElementById("admin-user-list");





function formatJoined(value){

    if(!value)
        return "-";


    const date = new Date(value);


    return Number.isNaN(date.getTime())

    ? value

    : date.toLocaleDateString("en-SG");

}





function renderUsers(users){


    if(!users || users.length===0){


        userList.innerHTML=

        `<tr>
        <td colspan="5">
        No user accounts found.
        </td>
        </tr>`;


        return;

    }




    userList.innerHTML = users.map(user=>{


return `

<tr>

<td>
<strong>
${escapeHtml(user.full_name)}
</strong>
</td>


<td>
${escapeHtml(user.gmail)}
</td>


<td>
${escapeHtml(user.phone_number || "-")}
</td>


<td>
${formatJoined(user.created_at)}
</td>


<td>

<button

class="button button-danger admin-small-button"

data-delete-user="${user.user_id}"

>

Delete

</button>


</td>


</tr>


`;


}).join("");

}






async function loadUsers(){


try{


const response =
await adminFetch(`${API}/api/user`);



console.log(response);



renderUsers(response.users);



}

catch(error){


console.error(error);



userList.innerHTML=

`

<tr>

<td colspan="5">

Failed to fetch

</td>

</tr>

`;


}



}






userList.addEventListener(

"click",

async(event)=>{


const button =
event.target.closest("[data-delete-user]");



if(!button)
return;



const id =
button.dataset.deleteUser;




if(!confirm("Delete this user?"))
return;



try{


await adminFetch(

`${API}/api/user/${id}`,

{

method:"DELETE"

}

);



alert("User deleted successfully");



loadUsers();



}

catch(error){


alert(error.message);


}



});





loadUsers();
