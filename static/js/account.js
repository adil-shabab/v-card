// render tempaltes 
if(document.querySelector('.all_templates') != null){


    let numbers = document.getElementById('template_numbers').dataset.value.split(',');
    let names = document.getElementById('template_names').dataset.value.split(',');
    

    let template_btns = document.querySelectorAll('.all_templates .template_btn')
    template_btns.forEach((item)=> item.addEventListener('click', function(){
        template_btns.forEach((item)=> item.classList.remove('active'))
        item.classList.add('active')
        localStorage.setItem('template_id', item.getAttribute('id'))
        changeCard()
    }))


    
    localStorage.setItem('template_id', template_btns[0].getAttribute('id'))
    template_btns[0].classList.add('active')
    

    let first_template_id = names[0]
    if (names[0].startsWith('[')) {
        first_template_id = names[0].substring(1);
    }
    
    first_template_id = first_template_id.substring(1, first_template_id.length - 1);


    document.getElementById(first_template_id).classList.remove('d-none')
    
    function changeCard() {

        let template_id = localStorage.getItem('template_id');
        let boxes = document.querySelectorAll('.profile_section .box .inner_box')

        

        boxes.forEach((item)=> {
            let current_id = item.getAttribute('id')
            let updated_id = current_id.replace('/','-')
            updated_id = updated_id.replace(".html", "");
            item.removeAttribute('id')
            item.setAttribute('id', updated_id)
        })

      
        template_id = 'cards/template-' + template_id;
        let updated_id = template_id.replace('/', '-');



        console.log(updated_id)



      
        document.querySelectorAll('.profile_section .box div').forEach((item)=> item.classList.add('d-none'));
        document.querySelector(`.profile_section .box #${updated_id}`).classList.remove('d-none');
      }
      
      
}    




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
        }).then((willDelete) => {
            if (willDelete) {
                fetch(`${baseUrl}/user/email-id/${id}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Token ${access_token}`,
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        swal("Poof! Your Email has been deleted!", {
                            icon: "success",
                        });
                        return getallemail(access_token);
                    })
                    .catch((error) => console.error(error));
            } else {
                swal("Your Email is safe!");
            }
        });
    }

    // update email by id
    function updateEmail(access_token, id, data) {
        console.log(data);
        return fetch(`${baseUrl}/user/email-id/${id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to update Email field.");
                }
            })
            .then((data) => {
                return getallemail(access_token);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // get email by id
    function getEmailbyId(access_token, email_id) {
        let id = email_id.id;
        let input_parent = document.getElementById(`email_${id}`);
        let update_btn = input_parent.querySelector(".update");

        input_parent.querySelector(".edit").classList.add("d-none");
        input_parent.querySelector(".trash").classList.add("d-none");
        update_btn.classList.remove("d-none");

        input_parent.querySelector("input").removeAttribute("disabled");
        input_parent.querySelector("select").removeAttribute("disabled");
        input_parent.querySelector("input").focus();
        input_parent.querySelector("input").select();

        update_btn.addEventListener("click", function () {
            if (!input_parent.querySelector("input").checkValidity()) {
                input_parent.querySelector("input").reportValidity();
            }

            const data = {
                email_type: input_parent.querySelector("select").value,
                email_id: input_parent.querySelector("input").value,
            };

            getAccessToken().then((access_token) => updateEmail(access_token, id, data));
        });
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

        for (let i = 0; i < data.length; i++) {
            const input_div = document.createElement("div");
            input_div.classList.add("input_div");
            input_div.setAttribute("id", `email_${data[i].id}`);

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
            `;

            input_div.querySelectorAll("select option").forEach((item) => {
                if (item.value == data[i].email_type) {
                    item.setAttribute("selected", "");
                }
            });
            parent_div.append(input_div);
        }
    }

    document.getElementById("email_add_btn").addEventListener("click", function () {
        document.getElementById("add_email_div").classList.remove("d-none");
    });

    document
        .getElementById("add_email_div")
        .querySelector(".trash")
        .addEventListener("click", function () {
            document.getElementById("add_email_div").classList.add("d-none");
            document.getElementById("add_email_div").querySelector('input').setAttribute('required','')

        });

    document
        .getElementById("add_email_div")
        .querySelector(".update")
        .addEventListener("click", function () {
            if (!document.getElementById("add_email_div").querySelector("input").checkValidity()) {
                document.getElementById("add_email_div").querySelector("input").reportValidity();
            }

            const data = {
                email_type: document.getElementById("add_email_div").querySelector("select").value,
                email_id: document.getElementById("add_email_div").querySelector("input").value,
            };

            createNewEmail(data)
                .then((data) => {
                    console.log(data); // Do something with the newly created email ID data

                    document.getElementById("add_email_div").classList.add("d-none");
                    document.getElementById("add_email_div").querySelector('input').removeAttribute('required')

                    getAccessToken().then((access_token) => getallemail(access_token));
                })
                .catch((error) => {
                    console.error(error);
                });

            document.getElementById("add_email_div").querySelector("input").value = "";
        });

    function createNewEmail(data) {
        const url = `${baseUrl}/user/email-id/`;

        return getAccessToken().then((access_token) => {
            return fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Token ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to create email.");
                }
            });
        });
    }
}


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
        }).then((willDelete) => {
            if (willDelete) {
                fetch(`${baseUrl}/user/phone-number/${id}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Token ${access_token}`,
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        swal("Poof! Your Phone Number has been deleted!", {
                            icon: "success",
                        });
                        return getallnumbers(access_token);
                    })
                    .catch((error) => console.error(error));
            } else {
                swal("Your Phone Number is safe!");
            }
        });
    }

    // update email by id
    function updateNumber(access_token, id, data) {
        console.log(data);
        return fetch(`${baseUrl}/user/phone-number/${id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to update Phone NUmber field.");
                }
            })
            .then((data) => {
                return getallnumbers(access_token);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // get email by id
    function getNumberbyId(access_token, email_id) {
        let id = email_id.id;
        let input_parent = document.getElementById(`number_${id}`);
        let update_btn = input_parent.querySelector(".update");

        input_parent.querySelector(".edit").classList.add("d-none");
        input_parent.querySelector(".trash").classList.add("d-none");
        update_btn.classList.remove("d-none");

        input_parent.querySelector("input").removeAttribute("disabled");
        input_parent.querySelector("select").removeAttribute("disabled");
        input_parent.querySelector("input").focus();
        input_parent.querySelector("input").select();

        update_btn.addEventListener("click", function () {
            if (!input_parent.querySelector("input").checkValidity()) {
                input_parent.querySelector("input").reportValidity();
            }

            const data = {
                phone_type: input_parent.querySelector("select").value,
                phone_number: input_parent.querySelector("input").value,
            };

            getAccessToken().then((access_token) => updateNumber(access_token, id, data));
        });
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

        for (let i = 0; i < data.length; i++) {
            const input_div = document.createElement("div");
            input_div.classList.add("input_div");
            input_div.setAttribute("id", `number_${data[i].id}`);

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
            `;

            input_div.querySelectorAll("select option").forEach((item) => {
                if (item.value == data[i].phone_type) {
                    item.setAttribute("selected", "");
                }
            });
            parent_div.append(input_div);
        }
    }

    document.getElementById("number_add_btn").addEventListener("click", function () {
        document.getElementById("add_number_div").classList.remove("d-none");
        document.getElementById("add_number_div").querySelector('input').setAttribute('required','')
    });

    document
        .getElementById("add_number_div")
        .querySelector(".trash")
        .addEventListener("click", function () {
            document.getElementById("add_number_div").classList.add("d-none");
            document.getElementById("add_number_div").querySelector('input').removeAttribute('required')

        });

    document
        .getElementById("add_number_div")
        .querySelector(".update")
        .addEventListener("click", function () {
            if (!document.getElementById("add_number_div").querySelector("input").checkValidity()) {
                document.getElementById("add_number_div").querySelector("input").reportValidity();
            }

            const data = {
                phone_type: document.getElementById("add_number_div").querySelector("select").value,
                phone_number: document.getElementById("add_number_div").querySelector("input").value,
            };

            createNewNumber(data)
                .then((data) => {
                    console.log(data); // Do something with the newly created email ID data

                    document.getElementById("add_number_div").classList.add("d-none");
                    getAccessToken().then((access_token) => getallnumbers(access_token));
                })
                .catch((error) => {
                    console.error(error);
                });

            document.getElementById("add_number_div").querySelector("input").value = "";
        });

    function createNewNumber(data) {
        const url = `${baseUrl}/user/phone-number/`;

        return getAccessToken().then((access_token) => {
            return fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Token ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to create Phone Number.");
                }
            });
        });
    }
}


function withSocial() {
    const form = document.getElementById("add_custom_btn_social");
    const parent_div = document.getElementById("add_on_field_social");

    function insertIcon(data) {
        let modal_body = document.querySelectorAll(".modal-body.social form");

        modal_body.forEach((item) => {
            let listHtml = '<ul id="social_media_ul">';

            data.forEach((icon) => {
                listHtml += `<li class="social_media_icon" id="${icon.id}">${icon.icon_html}</li>`;
            });

            listHtml += "</ul>";

            let div = item.querySelector(".social_parent_form");

            div.innerHTML = listHtml;
        });

        document.querySelectorAll(".social_media_icon").forEach((item) => {
            item.addEventListener("click", function () {
                // remove the 'active' class from all the icons
                document.querySelectorAll(".social_media_icon").forEach((element) => {
                    element.classList.remove("active");
                });

                // check if the current icon was the last clicked icon
                const itemId = item.id;
                const lastItemId = localStorage.getItem("IconID");

                if (itemId === lastItemId) {
                    // the user has clicked on this icon before
                    localStorage.removeItem("IconID"); // remove the ID from local storage
                } else {
                    // the user has clicked on a new icon
                    localStorage.setItem("IconID", itemId); // set the new ID in local storage
                    item.classList.add("active"); // add the 'active' class to the clicked icon
                }
            });
        });
    }

    function getAllIcons(access_token) {
        fetch(`${baseUrl}/user/icons/`, {
            headers: {
                Authorization: `Token ${access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                insertIcon(data);
            })
            .catch((error) => console.error(error));
    }

    getAccessToken().then((access_token) => getAllIcons(access_token));

    function createExtraField(access_token, data) {
        return fetch(`${baseUrl}/user/extrafields/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to create extra field.");
                }
            })
            .then((data) => {
                getallextra(access_token);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function insertData(data) {
        parent_div.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            const div = document.createElement("div");
            div.classList.add("input_div");

            div.innerHTML = `
                <label>${data[i].name}</label>
                <input type="text" value="${data[i].description}" disabled />    
                <div class="pre_icon">
                    
                </div>
                <i class="fa-regular fa-pen-to-square edit__btn" data-bs-toggle="modal" data-bs-target="#socail_media_modal_update" value="${data[i].id}"></i>
                <i class="fa-solid fa-trash trash__btn" value="${data[i].id}" ></i>     
            `;

            function getIcon(access_token) {
                fetch(`${baseUrl}/user/icons/`, {
                    headers: {
                        Authorization: `Token ${access_token}`,
                    },
                })
                    .then((response) => response.json())
                    .then((file) => {
                        const icon = file.find((item) => item.id === data[i].icon[0]);
                        console.log(icon)
                        // do something with the icon
                        div.querySelector(".pre_icon").innerHTML = icon.icon_html;
                    })
                    .catch((error) => console.error(error));
            }

            getAccessToken().then((access_token) => {
                getIcon(access_token);
            });

            parent_div.appendChild(div);
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = {
            name: form.querySelector("#name").value,
            description: form.querySelector("#description").value,
            is_social: true,
        };

        // check if IconID is stored in local storage
        const iconId = localStorage.getItem("IconID");
        const icon = []
        if (iconId) {
            icon.push(iconId)
            data.icon = icon; // add iconId as an extra field to the data object
        }

        getAccessToken().then((access_token) => {
            createExtraField(access_token, data);
        });

        form.querySelector("#name").value = "";
        form.querySelector("#description").value = "";
    });

    function getExtrabyId(access_token, extraField) {
        let form = document.querySelector("#socail_media_modal_update form");
        form.querySelector("#name").value = extraField.name;
        form.querySelector("#description").value = extraField.description;

        document.querySelectorAll(".social_media_icon").forEach((item) => {
            item.classList.remove("active");
            if (item.id == extraField.icon) {
                item.classList.add("active");
                localStorage.setItem("IconID", item.id); // set the new ID in local storage
            }
        });
    }

    function getallextra(access_token) {
        fetch(`${baseUrl}/user/extrafields/`, {
            headers: {
                Authorization: `Token ${access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const filteredData = data.filter((extra) => extra.is_social === true);
                insertData(filteredData);

                document.querySelectorAll(".edit__btn").forEach((item) =>
                    item.addEventListener("click", function () {
                        const id = item.getAttribute("value");
                        localStorage.setItem("id", id);
                        const extraField = data.find((extra) => extra.id == id);

                        console.log(extraField);
                        if (extraField) {
                            getAccessToken().then((access_token) => getExtrabyId(access_token, extraField));
                        } else {
                            console.log(`Extra field with id ${id} not found`);
                        }
                    })
                );

                document.querySelectorAll(".trash__btn").forEach((item) =>
                    item.addEventListener("click", function () {
                        const id = item.getAttribute("value");
                        localStorage.setItem("id", id);
                        const extraField = data.find((extra) => extra.id == id);
                        console.log(extraField);
                        if (extraField) {
                            getAccessToken().then((access_token) => deleteExtraById(access_token, extraField.id));
                        } else {
                            console.log(`Extra field with id ${id} not found`);
                        }
                    })
                );
            })
            .catch((error) => console.error(error));
    }

    getAccessToken().then((access_token) => getallextra(access_token));

    const updateForm = document.getElementById("add_custom_btn_social_update");
    function updateExtraField(access_token, id, data) {
        return fetch(`${baseUrl}/user/extrafields/${id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to update extra field.");
                }
            })
            .then((data) => {
                console.log(data); // Do something with the updated extra field data
                return getallextra(access_token);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const id = localStorage.getItem("id");
        const data = {
            name: updateForm.querySelector("#name").value,
            description: updateForm.querySelector("#description").value,
            is_social: true,
        };

        // check if IconID is stored in local storage
        let icon = []
        const iconId = localStorage.getItem("IconID");
        if (iconId) {
            icon.push(iconId)
            data.icon = icon; // add iconId as an extra field to the data object
        }

        getAccessToken().then((access_token) => updateExtraField(access_token, id, data));
    });

    function deleteExtraById(access_token, id) {
        swal({
            title: "Are you sure?",
            text: "Are you sure to delete this Field",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                fetch(`${baseUrl}/user/extrafields/${id}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Token ${access_token}`,
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        swal("Poof! Your Field has been deleted!", {
                            icon: "success",
                        });
                        return getallextra(access_token);
                    })
                    .catch((error) => console.error(error));
            } else {
                swal("Your Field is safe!");
            }
        });
    }
}


function withoutSocial() {
    const parent_div = document.getElementById("add_on_field_without_social_media");
    const form = document.getElementById("add_custom_btn_social_without_icon");

    function getallextra(access_token) {
        return fetch(`${baseUrl}/user/extrafields/`, {
            headers: {
                Authorization: `Token ${access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const filteredData = data.filter((extra) => extra.is_social === false);
                console.log(data);
                console.log(filteredData);
                insertData(filteredData);

                document.querySelectorAll(".edit__btn").forEach((item) =>
                    item.addEventListener("click", function () {
                        const id = item.getAttribute("value");
                        localStorage.setItem("id", id);
                        const extraField = data.find((extra) => extra.id == id);

                        console.log(extraField);
                        if (extraField) {
                            getAccessToken().then((access_token) => getExtrabyId(access_token, extraField));
                        } else {
                            console.log(`Extra field with id ${id} not found`);
                        }
                    })
                );

                document.querySelectorAll(".trash__btn").forEach((item) =>
                    item.addEventListener("click", function () {
                        const id = item.getAttribute("value");
                        localStorage.setItem("id", id);
                        const extraField = data.find((extra) => extra.id == id);
                        console.log(extraField);
                        if (extraField) {
                            getAccessToken().then((access_token) => deleteExtraById(access_token, extraField.id));
                        } else {
                            console.log(`Extra field with id ${id} not found`);
                        }
                    })
                );
            })
            .catch((error) => console.error(error));
    }

    getAccessToken().then((access_token) => getallextra(access_token));

    function createExtraField(access_token, data) {
        return fetch(`${baseUrl}/user/extrafields/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to create extra field.");
                }
            })
            .then((data) => {
                console.log(data);
                getallextra(access_token);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = {
            name: form.querySelector("#name").value,
            description: form.querySelector("#description").value,
            is_social: false,
            icon_html: "<i class='fa-solid fa-link'></i>",
        };

        getAccessToken().then((access_token) => {
            createExtraField(access_token, data);
        });

        form.querySelector("#name").value = "";
        form.querySelector("#description").value = "";
    });

    function insertData(data) {
        parent_div.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            const div = document.createElement("div");
            div.classList.add("input_div");

            div.innerHTML = `
                <label>${data[i].name}</label>
                <input type="text" value="${data[i].description}" disabled />    
                <div class="pre_icon">
                    ${data[i].icon_html}
                </div>
                <i class="fa-regular fa-pen-to-square edit__btn" data-bs-toggle="modal" data-bs-target="#socail_media_modal_update_without_icon" value="${data[i].id}"></i>
                <i class="fa-solid fa-trash trash__btn" value="${data[i].id}" ></i>     
            `;

            parent_div.appendChild(div);
        }
    }

    function getExtrabyId(access_token, extraField) {
        let form = document.querySelector("#socail_media_modal_update_without_icon form");
        form.querySelector("#name").value = extraField.name;
        form.querySelector("#description").value = extraField.description;
    }

    const updateForm = document.getElementById("update_extra_field_form_without_social");
    function updateExtraField(access_token, id, data) {
        return fetch(`${baseUrl}/user/extrafields/${id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Token ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to update extra field.");
                }
            })
            .then((data) => {
                console.log(data); // Do something with the updated extra field data
                return getallextra(access_token);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const id = localStorage.getItem("id");

        const data = {
            name: updateForm.querySelector("#name").value,
            description: updateForm.querySelector("#description").value,
            is_social: false,
            icon_html: "<i class='fa-solid fa-link'></i>",
        };

        getAccessToken().then((access_token) => updateExtraField(access_token, id, data));
    });

    function deleteExtraById(access_token, id) {
        swal({
            title: "Are you sure?",
            text: "Are you sure to delete this Field",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                fetch(`${baseUrl}/user/extrafields/${id}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Token ${access_token}`,
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        swal("Poof! Your Field has been deleted!", {
                            icon: "success",
                        });
                        return getallextra(access_token); // THIS CODE IS NOT WORKING
                    })
                    .catch((error) => console.error(error));
            } else {
                swal("Your Field is safe!");
            }
        });
    }
}




if(document.querySelector('.card_section') != null){
    PhoneNumber()
    EmailId()
    withSocial()
    withoutSocial()
}


var slides = document.querySelectorAll(".card_section .slider .slide");
var currentSlide = 0;

document.querySelectorAll(".next").forEach((item) => item.addEventListener("click", nextSlide));
document.querySelectorAll(".prev").forEach((item) => item.addEventListener("click", prevSlide));

function nextSlide() {

    if(document.getElementById('id_company') != null){
        document.getElementById('id_company').setAttribute('required','')
        if (!document.getElementById("id_company").checkValidity()) {
            document.getElementById("id_company").reportValidity();
        }
        else{
            document.getElementById('id_designation').setAttribute('required','')
            if (!document.getElementById("id_designation").checkValidity()) {

                document.getElementById("id_designation").reportValidity();
            }else{
                slides[currentSlide].classList.remove("active");
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add("active");
            }
        }
    }
}

function prevSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
}


if(document.querySelector('.login_section') != null){
    removeAllCurrentActiveClass()
    let icons = document.querySelectorAll('.footer_box i')
    icons[0].classList.add('active')
}
if(document.querySelector('.register_section') != null){
    removeAllCurrentActiveClass()
    let icons = document.querySelectorAll('.footer_box i')
    icons[0].classList.add('active')
}
if(document.querySelector('.card_section') != null){
    removeAllCurrentActiveClass()
    let icons = document.querySelectorAll('.footer_box i')
    icons[1].classList.add('active')
}
if(document.querySelector('.profile_section') != null){
    removeAllCurrentActiveClass()
    let icons = document.querySelectorAll('.footer_box i')
    icons[2].classList.add('active')
}


// footer box click events
function removeAllCurrentActiveClass() {
    document.querySelectorAll(".footer_box .box").forEach((item) => item.querySelector("i").classList.remove("active"));
}