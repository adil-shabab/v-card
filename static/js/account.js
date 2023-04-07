

const baseUrl = "http://127.0.0.1:8000";

function getAccessToken() {
    return fetch(`${baseUrl}/user/get/google/token/`)
        .then((response) => response.json())
        .then((data) => {
            if (data.status == 0) {
                return data.access_token;
            } else {
                return fetch("http://127.0.0.1:8000/user/get/token/")
                    .then((response) => response.json())
                    .then((data) => {
                        return data.token;
                });
            }
        });
}



function EmailId() {

    const parent_div = document.getElementById("all_emails");

    // document.getElementById("add_email_btn").addEventListener("click", function () {
    //     document.querySelector(".email_id_parent.form").classList.remove("d-none");
    // });

    // function getCookie(name) {
    //     var cookieValue = null;
    //     if (document.cookie && document.cookie !== "") {
    //         var cookies = document.cookie.split(";");
    //         for (var i = 0; i < cookies.length; i++) {
    //             var cookie = cookies[i].trim();
    //             if (cookie.substring(0, name.length + 1) === name + "=") {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }



    // update email 
    function updateEmail(access_token, id, data) {

        console.log(data)
        return fetch(`${baseUrl}/user/email-id/${id}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to update Email field.');
                }
            })
            .then(data => {
                return getallemail(access_token);
            })
            .catch(error => {
                console.error(error);
            });
    }




    // get email by id 
    function getEmailbyId(access_token, email_id) {

        let id = email_id.id
        let input_parent = document.getElementById(`email_${id}`)
        let update_btn = input_parent.querySelector('.update')

        input_parent.querySelector('.edit').classList.add('d-none')
        input_parent.querySelector('.trash').classList.add('d-none')
        update_btn.classList.remove('d-none')

        update_btn.addEventListener('click', function(){

            if (! input_parent.querySelector('input').checkValidity()) {
                input_parent.querySelector('input').reportValidity()
            }

            const data = {
                email_type : input_parent.querySelector('select').value,
                email_id : input_parent.querySelector('input').value
            }

            getAccessToken()
            .then(access_token => updateEmail(access_token, id, data));
        })

        input_parent.querySelector('input').removeAttribute('disabled')
        input_parent.querySelector('select').removeAttribute('disabled')     
    
    }


    // get all email 
    function getallemail(access_token) {
        fetch(`${baseUrl}/user/email-id/`, {
            headers: {
                Authorization: `Token ${access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                insertEmail(data);

                document.querySelectorAll("#all_emails .edit").forEach((item) =>
                    item.addEventListener("click", function () {
                        const id = item.getAttribute("value");
                        const email_id = data.find((email) => email.id == id);
                        if (email_id) {
                            getAccessToken().then((access_token) => getEmailbyId(access_token, email_id));
                        } else {
                            console.log(`Email id with id ${id} not found`);
                        }
                    })
                );

                // document.querySelectorAll(".trash_email_btn").forEach((item) =>
                //     item.addEventListener("click", function () {
                //         const id = item.getAttribute("value");
                //         const email_id = data.find((email) => email.id == id);
                //         console.log(email_id);
                //         if (email_id) {
                //             getAccessToken().then((access_token) => deleteEmailById(access_token, email_id.id));
                //         } else {
                //             console.log(`Email Id with id ${id} not found`);
                //         }
                //     })
                // );
            })
            .catch((error) => console.error(error));
    }

    getAccessToken().then((access_token) => getallemail(access_token));

    function insertEmail(data) {
        parent_div.innerHTML = "";

        for (let i=0; i<data.length; i++){

            const input_div = document.createElement('div')
            input_div.classList.add('input_div')
            input_div.setAttribute('id', `email_${data[i].id}`)
        
            input_div.innerHTML = `
                <select value="${data[i].email_type}" name="" id="select_email_${data[i].id}" disabled>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Home">Home</option>
                    <option value="Company">Company</option>
                </select>
                <input value="${data[i].email_id}" disabled type="email">
                <label for="">Email : </label>
                <i value="${data[i].id}" class="edit fa-solid fa-pen-to-square"></i>
                <i value="${data[i].id}" class="trash fa-solid fa-trash"></i>
                <i value="${data[i].id}" class="d-none update fa-solid fa-check"></i>
            `
        
            input_div.querySelectorAll('select option').forEach((item)=> {
                if(item.value == data[i].email_type){
                    item.setAttribute('selected','')
                }
            })
            parent_div.append(input_div)

        }
        
    
    }

    // function createEmail(access_token, data) {
    //     return fetch(`${baseUrl}/user/email-id/`, {
    //         method: "POST",
    //         headers: {
    //             Authorization: `Token ${access_token}`,
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //     })
    //         .then((response) => {
    //             if (response.ok) {
    //                 return response.json();
    //             } else {
    //                 throw new Error("Failed to Email field.");
    //             }
    //         })
    //         .then((data) => {
    //             console.log(data); // Do something with the newly created extra field data
    //             getallemail(access_token);
    //             document.querySelector(".email_id_parent.form").classList.add("d-none");
    //             document.querySelector(".email_id_parent.form").querySelector("input").value = "";
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }

    // const form = document.querySelector(".email_id_parent");
    // form.querySelector(".submit_btn").addEventListener("click", function () {
    //     console.log("clicked");

    //     if (!form.querySelector(".email_id").checkValidity()) {
    //         form.querySelector(".email_id").reportValidity();
    //     }

    //     const data = {
    //         email_type: form.querySelector("select").value,
    //         email_id: form.querySelector("input").value,
    //     };

    //     getAccessToken().then((access_token) => {
    //         createEmail(access_token, data);
    //     });
    // });

    // form.querySelector(".close_btn").addEventListener("click", function () {
    //     document.querySelector(".email_id_parent.form").classList.add("d-none");
    // });

    // function getEmailbyId(access_token, email_id) {
    //     let id = email_id.id;
    //     let input_parent = document.getElementById(`email_${id}`);

    //     input_parent.querySelector(".edit_email_btn").classList.add("d-none");

    //     const save_btn = document.createElement("i");
    //     save_btn.classList.add("fa-solid");
    //     save_btn.classList.add("fa-check");
    //     save_btn.classList.add("save_edit");

    //     input_parent.appendChild(save_btn);

    //     save_btn.addEventListener("click", function () {
    //         if (!input_parent.querySelector(".email_id_edit").checkValidity()) {
    //             input_parent.querySelector(".email_id_edit").reportValidity();
    //         }

    //         const data = {
    //             email_type: input_parent.querySelector("#email_type_edit").value,
    //             email_id: input_parent.querySelector(".email_id_edit").value,
    //         };

    //         getAccessToken().then((access_token) => updateEmail(access_token, id, data));
    //     });

    //     input_parent.classList.add("active");
    //     input_parent.querySelectorAll("input").forEach((input) => {
    //         input.removeAttribute("disabled");
    //     });

    //     let select_div = document.querySelector("#email_type_edit");
    //     select_div.value = email_id.email_type;
    // }

    // function updateEmail(access_token, id, data) {
    //     return fetch(`${baseUrl}/user/email-id/${id}/`, {
    //         method: "PUT",
    //         headers: {
    //             Authorization: `Token ${access_token}`,
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //     })
    //         .then((response) => {
    //             if (response.ok) {
    //                 return response.json();
    //             } else {
    //                 throw new Error("Failed to update Email field.");
    //             }
    //         })
    //         .then((data) => {
    //             console.log(data); // Do something with the updated extra field data
    //             return getallemail(access_token);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }

    // function deleteEmailById(access_token, id) {
    //     fetch(`${baseUrl}/user/email-id/${id}/`, {
    //         method: "DELETE",
    //         headers: {
    //             Authorization: `Token ${access_token}`,
    //             "Content-Type": "application/json",
    //         },
    //     })
    //         .then((response) => {
    //             return getallemail(access_token);
    //         })
    //         .catch((error) => console.error(error));
    // }
}

EmailId();


// footer box click events 
function removeAllCurrentActiveClass(){
    document.querySelectorAll('.footer_box .box').forEach((item)=>item.querySelector('i').classList.remove('active'))
}
function addActiveFooterBox(item){
    removeAllCurrentActiveClass()
    item.querySelector('i').classList.add('active')
}
if(document.querySelector('.footer_box') != null){
    document.querySelectorAll('.footer_box .box').forEach((item)=> item.querySelector('i').addEventListener('click', () => addActiveFooterBox(item)))
}



