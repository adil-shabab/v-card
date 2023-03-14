if(document.querySelector('.signup_form') != null){
    form = document.querySelector('.signup_form')
    form.querySelectorAll('.input_div').forEach((item) => item.querySelector('input').addEventListener('input', function(){
        item.querySelector('label').classList.add('active')
    }))
}





if(document.querySelector('.login_form') != null){
    form = document.querySelector('.login_form')
    form.querySelectorAll('.input_div').forEach((item) => item.querySelector('input').addEventListener('input', function(){
        item.querySelector('label').classList.add('active')
    }))
}






if(document.querySelector('.profile_edit_container') != null){
    form = document.querySelector('.profile_edit_container')

    form.querySelectorAll('.input_div input').forEach((input) => {
        if (input.value !== "") {
            input.parentNode.querySelector('label').classList.add("active");
        }
    });
    form.querySelectorAll('.input_div textarea').forEach((input) => {
        if (input.value !== "") {
            input.parentNode.querySelector('label').classList.add("active");
        }
    });

    form.querySelectorAll('.input_div input').forEach((input) => {
        input.addEventListener('input', function(){
            input.parentNode.querySelector('label').classList.add('active')
        })
    });

    form.querySelectorAll('.input_div textarea').forEach((input) => {
        input.addEventListener('input', function(){
            input.parentNode.querySelector('label').classList.add('active')
        })
    });


    form.querySelectorAll('.input_div').forEach((item) => item.querySelector('textarea').addEventListener('input', function(){
        item.querySelector('label').classList.add('active')
    }))
    form.querySelectorAll('.input_div').forEach((item) => item.querySelector('input').addEventListener('input', function(){
        item.querySelector('label').classList.add('active')
    }))
}