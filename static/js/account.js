
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



