

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
    
    // delete email by id 
    function deleteEmailById(access_token, id) {
        swal({
            title: "Are you sure?",
            text: "Are you sure to delete this Email",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                fetch(`${baseUrl}/user/email-id/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${access_token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    swal("Poof! Your Email has been deleted!", {
                        icon: "success",
                    });
                    return getallemail(access_token);
                })
                .catch(error => console.error(error));
              
            } else {
              swal("Your Email is safe!");
            }
        });
    }


    // update email by id 
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

        input_parent.querySelector('input').removeAttribute('disabled')
        input_parent.querySelector('select').removeAttribute('disabled')
        input_parent.querySelector('input').focus()
        input_parent.querySelector('input').select()

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

            document.querySelectorAll("#all_emails .trash").forEach((item) =>
                item.addEventListener("click", function () {
                    const id = item.getAttribute("value");
                    const email_id = data.find((email) => email.id == id);
                    if (email_id) {
                        getAccessToken().then((access_token) => deleteEmailById(access_token, email_id.id));
                    } else {
                        console.log(`Email Id with id ${id} not found`);
                    }
                })
            );
        })
        .catch((error) => console.error(error));
    }

    getAccessToken().then((access_token) => getallemail(access_token));


    // insert new email 
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
                <input required value="${data[i].email_id}" disabled type="email">
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



    document.getElementById('email_add_btn').addEventListener('click', function(){
        document.getElementById('add_email_div').classList.remove('d-none')
    })

    document.getElementById('add_email_div').querySelector('.trash').addEventListener('click', function(){
        document.getElementById('add_email_div').classList.add('d-none')
    })

    document.getElementById('add_email_div').querySelector('.update').addEventListener('click', function(){

        if (! document.getElementById('add_email_div').querySelector('input').checkValidity()) {
            document.getElementById('add_email_div').querySelector('input').reportValidity()
        }
        
        const data = {
          email_type: document.getElementById('add_email_div').querySelector('select').value,
          email_id: document.getElementById('add_email_div').querySelector('input').value
        };
        
        createNewEmail(data).then((data) => {
          console.log(data); // Do something with the newly created email ID data

          document.getElementById('add_email_div').classList.add('d-none')
          getAccessToken().then((access_token) => getallemail(access_token));
        }).catch((error) => {
          console.error(error);
        });

        document.getElementById('add_email_div').querySelector('input').value = ""

    });
      

    function createNewEmail(data) {
        const url = `${baseUrl}/user/email-id/`;
      
        return getAccessToken().then((access_token) => {
          return fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Token ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }).then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to create email.');
            }
          });
        });
      }
}

EmailId();





function PhoneNumber() {

    const parent_div = document.getElementById("all_numbers");

    // delete email by id 
    function deleteNumberById(access_token, id) {
        swal({
            title: "Are you sure?",
            text: "Are you sure to delete this Phone Number",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                fetch(`${baseUrl}/user/phone-number/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${access_token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    return getallnumbers(access_token);
                    swal("Poof! Your Phone Number has been deleted!", {
                        icon: "success",
                    });
                })
                .catch(error => console.error(error));
              
            } else {
              swal("Your Phone Number is safe!");
            }
        });
    }


    // update email by id 
    function updateNumber(access_token, id, data) {

        console.log(data)
        return fetch(`${baseUrl}/user/phone-number/${id}/`, {
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
                    throw new Error('Failed to update Phone NUmber field.');
                }
            })
            .then(data => {
                return getallnumbers(access_token);
            })
            .catch(error => {
                console.error(error);
            });
    }




    // get email by id 
    function getNumberbyId(access_token, email_id) {

        let id = email_id.id
        let input_parent = document.getElementById(`number_${id}`)
        let update_btn = input_parent.querySelector('.update')

        input_parent.querySelector('.edit').classList.add('d-none')
        input_parent.querySelector('.trash').classList.add('d-none')
        update_btn.classList.remove('d-none')

        input_parent.querySelector('input').removeAttribute('disabled')
        input_parent.querySelector('select').removeAttribute('disabled')
        input_parent.querySelector('input').focus()
        input_parent.querySelector('input').select()

        update_btn.addEventListener('click', function(){

            if (! input_parent.querySelector('input').checkValidity()) {
                input_parent.querySelector('input').reportValidity()
            }

            const data = {
                phone_type : input_parent.querySelector('select').value,
                phone_number : input_parent.querySelector('input').value
            }

            getAccessToken()
            .then(access_token => updateNumber(access_token, id, data));
        })
    }


    // get all email 
    function getallnumbers(access_token) {
        fetch(`${baseUrl}/user/phone-number/`, {
            headers: {
                Authorization: `Token ${access_token}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            insertNumber(data);

            document.querySelectorAll("#all_numbers .edit").forEach((item) =>
                item.addEventListener("click", function () {
                    const id = item.getAttribute("value");
                    const number_id = data.find((number) => number.id == id);
                    if (number_id) {
                        getAccessToken().then((access_token) => getNumberbyId(access_token, number_id));
                    } else {
                        console.log(`Phone Number id with id ${id} not found`);
                    }
                })
            );

            document.querySelectorAll("#all_numbers .trash").forEach((item) =>
                item.addEventListener("click", function () {
                    const id = item.getAttribute("value");
                    const number_id = data.find((number) => number.id == id);
                    if (number_id) {
                        getAccessToken().then((access_token) => deleteNumberById(access_token, number_id.id));
                    } else {
                        console.log(`Phone Number Id with id ${id} not found`);
                    }
                })
            );
        })
        .catch((error) => console.error(error));
    }

    getAccessToken().then((access_token) => getallnumbers(access_token));


    // insert new email 
    function insertNumber(data) {
        parent_div.innerHTML = "";

        for (let i=0; i<data.length; i++){

            const input_div = document.createElement('div')
            input_div.classList.add('input_div')
            input_div.setAttribute('id', `number_${data[i].id}`)
        
            input_div.innerHTML = `
                <select value="${data[i].phone_type}" name="" id="select_number_${data[i].id}" disabled>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Home">Home</option>
                    <option value="Company">Company</option>
                </select>
                <input required value="${data[i].phone_number}" disabled type="text">
                <label for="">Number : </label>
                <i value="${data[i].id}" class="edit fa-solid fa-pen-to-square"></i>
                <i value="${data[i].id}" class="trash fa-solid fa-trash"></i>
                <i value="${data[i].id}" class="d-none update fa-solid fa-check"></i>
            `
        
            input_div.querySelectorAll('select option').forEach((item)=> {
                if(item.value == data[i].phone_type){
                    item.setAttribute('selected','')
                }
            })
            parent_div.append(input_div)

        } 
    
    }



    document.getElementById('number_add_btn').addEventListener('click', function(){
        document.getElementById('add_number_div').classList.remove('d-none')
    })

    document.getElementById('add_number_div').querySelector('.trash').addEventListener('click', function(){
        document.getElementById('add_number_div').classList.add('d-none')
    })

    document.getElementById('add_number_div').querySelector('.update').addEventListener('click', function(){

        if (! document.getElementById('add_number_div').querySelector('input').checkValidity()) {
            document.getElementById('add_number_div').querySelector('input').reportValidity()
        }
        
        const data = {
          phone_type: document.getElementById('add_number_div').querySelector('select').value,
          phone_number: document.getElementById('add_number_div').querySelector('input').value
        };
        
        createNewNumber(data).then((data) => {
          console.log(data); // Do something with the newly created email ID data

          document.getElementById('add_number_div').classList.add('d-none')
          getAccessToken().then((access_token) => getallnumbers(access_token));
        }).catch((error) => {
          console.error(error);
        });

        document.getElementById('add_number_div').querySelector('input').value = ""
    });
      

    function createNewNumber(data) {
        const url = `${baseUrl}/user/phone-number/`;
      
        return getAccessToken().then((access_token) => {
          return fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Token ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }).then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to create Phone Number.');
            }
          });
        });
      }
}

PhoneNumber();


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



