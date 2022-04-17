//find post edit form
let postEditForm = document.getElementById("postEditForm");

//add event listener to post edit form
postEditForm.addEventListener("submit", (e)=>{



// find length of uploaded images
let imageUpload = document.getElementById("imageUpload").files.length;

//find length of existing images
let existingImages = document.querySelectorAll(".imageDeleteCheckBox").length;

//find lenth of checked images to be deleted
let imgsToDelete = document.querySelectorAll(".imageDeleteCheckBox:checked").length;

let newTotal = existingImages - imgsToDelete + imageUpload;
if( newTotal > 4 ){
    e.preventDefault();
    let errImg = newTotal-4 ;
    alert("You Need delete " +  errImg + " Images")
}

})


