const form = document.querySelector("form"),
emailField = form.querySelector(".email-field"),
emailInput = emailField.querySelector(".email"),
passField = form.querySelector(".create-password"),
passInput = passField.querySelector(".password"),
cPassField = form.querySelector(".confirm-password"),
cPassInput = cPassField.querySelector(".cPassword")
// Email Validtion
function checkEmail() {
const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
if (!emailInput.value.match(emailPattern)) {
    return emailField.classList.add("invalid"); 
}
emailField.classList.remove("invalid"); 
}

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
// Hide and show password
togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});
const togglecPassword = document.querySelector('#togglecPassword');
const cpassword = document.querySelector('#cpassword');
// Hide and show password
togglecPassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = cpassword.getAttribute('type') === 'password' ? 'text' : 'password';
    cpassword.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});


function createPass() {
const passPattern =
/^(?=.*[-\#\$\.\?\-\~\<\>\£\,\%\&\@\!\+\=\\*])(?=.*[a-zA-Z])(?=.*\d).{8,}$/;    



if (!passInput.value.match(passPattern)) {
    return passField.classList.add("invalid"); 
}
passField.classList.remove("invalid"); 
}

function confirmPass(){
    if (passInput.value !== cPassInput.value || cPassInput.value === "") {
        return cPassField.classList.add("invalid")
    }
    cPassField.classList.remove("invalid")
}

form.addEventListener("submit", (e) => {
e.preventDefault();
checkEmail();
createPass();
confirmPass();

emailInput.addEventListener("keyup", checkEmail);
passInput.addEventListener("keyup", createPass);
cPassInput.addEventListener("keyup", confirmPass);

if (
    !emailField.classList.contains("invalid") &&
    !passField.classList.contains("invalid") &&
    !cPassField.classList.contains("invalid") 
) {
document.querySelector("form").submit();			}
});