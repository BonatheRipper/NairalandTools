const clear = document.getElementById('clear-distance');
clear.addEventListener('click', (e)=>{
e.prevenetDefault();
document.getElementById("location").value = ""
document.querySelector("input[type=radio]:checked").checked = false;

})
