


const userList =
document.getElementById("admin-user-list");



function escapeHtml(text){

    if(text === null || text === undefined){

        return "";

    }


    return String(text)

    .replace(/&/g,"&amp;")

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;")

    .replace(/"/g,"&quot;")

    .replace(/'/g,"&#039;");

}



function formatJoined(date){

    if(!date){

        return "-";

    }


    return new Date(date)
    .toLocaleDateString("en-SG");

}




function renderUsers(users){


    if(!users || users.length === 0){


        userList.innerHTML = `

        <tr>

        <td colspan="5">

        No users found

        </td>

        </tr>

        `;


        return;

    }



    userList.innerHTML = users.map(user => {


        return `

        <tr>

        <td>

        ${escapeHtml(user.full_name)}

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

        class="button button-danger"

        onclick="deleteUser(${user.user_id})">

        Delete

        </button>


        </td>


        </tr>


        `;


    }).join("");

}





async function loadUsers(){


    try{


        const response = await fetch(

            `${API}/api/user`

        );



        if(!response.ok){


            throw new Error(
                "Unable to load users"
            );


        }




        const data = await response.json();



        console.log(data);



        renderUsers(
            data.users
        );



    }


    catch(error){


        console.log(error);



        userList.innerHTML = `

        <tr>

        <td colspan="5">

        Failed to fetch users

        </td>

        </tr>

        `;


    }


}







async function deleteUser(userId){


    const confirmDelete =
    confirm(
        "Are you sure you want to delete this user?"
    );



    if(!confirmDelete){

        return;

    }





    try{


        const response = await fetch(

            `${API}/api/user/${userId}`,

            {

                method:"DELETE"

            }

        );



        if(!response.ok){


            throw new Error(
                "Delete failed"
            );


        }



        alert(
            "User deleted successfully"
        );



        loadUsers();



    }



    catch(error){


        alert(
            error.message
        );


    }


}






loadUsers();
