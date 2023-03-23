const images = Array.from(document.querySelectorAll('.details_section .slider'));

// set the initial index to 0
let index = 0;

// function to show the next image
let locationInput = document.getElementById('id_location')
let phoneInput = document.getElementById('id_phone_number')
  
console.log(locationInput,phoneInput)
function showNextImage() {

  if(locationInput.value != ""){
    locationInput.classList.remove('error')
    if(phoneInput.value != ""){
        console.log('fasdfasdfasdfasdfa')
        // remove the active class from the current image
        images[index].classList.remove('active');
        // increment the index by 1, and if it's greater than the number of images, reset it to 0
        index = (index + 1);
        // add the active class to the next image
        images[index].classList.add('active');
        
        phoneInput.classList.remove('error')
    }
    else{
       phoneInput.classList.add('error')
    }
  }else{
    locationInput.classList.add('error')
  }
}

// function to show the next image
function showPreviousImage() {
  // remove the active class from the current image
  images[index].classList.remove('active');
  // increment the index by 1, and if it's greater than the number of images, reset it to 0
  index = (index - 1);
  // add the active class to the next image
  images[index].classList.add('active');
}

document.querySelectorAll('.next').forEach((item)=> item.addEventListener('click',  showNextImage))
document.querySelectorAll('.previous').forEach((item)=> item.addEventListener('click',  showPreviousImage))



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

    var cover_image = document.getElementById('cover_img')
    var cover_input = document.getElementById('id_coverimage')

    cover_input.addEventListener('change', function(){
        var file = cover_input.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            cover_image.src = reader.result;
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    })




    var dp_image = document.getElementById('dp_img')
    var dp_input = document.getElementById('id_dp')

    dp_input.addEventListener('change', function(){
        var file = dp_input.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            dp_image.src = reader.result;
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    })




    let form = document.querySelector('#profile_edit_form')

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