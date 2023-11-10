const showPassWord = document.querySelector("#showPassword");
const password = document.getElementById("password");

showPassWord.addEventListener('click', function(){
    
    if (password.type === "password") {
        showPassWord.classList.replace("fa-eye","fa-eye-slash");
        password.type = "text";
        
} else {
password.type = "password";
showPassWord.classList.replace("fa-eye-slash","fa-eye");
}
})
