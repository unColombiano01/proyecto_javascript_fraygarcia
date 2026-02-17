let signUp = document.getElementById("signUp");
let signIn = documen.getElementById("signIn");
let nameInput = document.getElementById("nameInput");
let title = document.getElementById("tittle");

signIn.onclick = function() {
    nameInput.style.maxHeight = "0";
    title.innerHTML = "login";
    signUp.classList.add("disable");
}

signUp.onclick = function() {
    nameInput.style.maxHeight = "60px";
    title.innerHTML = "login";
    signUp.classList.add("disable");
}