function UpdateProfileValidation(){
    $('#confirmPassword').keyup(function(e){
        
    if($(this).val()!== $('#newPassword').val()){
        e.preventDefault();
        $('#validationMessage').css("color","red")
        $('#validationMessage').text("Your Password must match")
    }
    else{
        $('#validationMessage').css("color","green")
        $('#validationMessage').val("Password Match")
    }
  });
  $("#updateProfileForm").on("submit", (e)=>{

    if($('#confirmPassword').val()!= $('#newPassword').val()){
        e.preventDefault();
        $('#validationMessage').css("color","red")
        $('#validationMessage').text("Your Password must match")
    }
    
  }) 
}
UpdateProfileValidation()