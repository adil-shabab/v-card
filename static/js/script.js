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