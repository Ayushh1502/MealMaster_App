const isLoggedin = localStorage.getItem("isLoggedin");
document.getElementById("logout-btn").style.display = "none";
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("get-started-btn").style.display = "none";



if(isLoggedin){
    document.getElementById("get-started-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("signup-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("signup-btn1").style.display = "none";
}
else{

    document.getElementById("login-btn").style.display = "block";
    document.getElementById("signup-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
}

function logout(){
    localStorage.removeItem("isLoggedin");
}   

