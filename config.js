const API_URL = "https://script.google.com/macros/s/AKfycbx9Fr-Eo_6GRS9julZ6Bkpy7y761YfHIUFm_sV3lCzdAWtFN0a0QXRFzJiYFHW5z6c/exec";

function getToken(){
return localStorage.getItem("token")
}

function setToken(t){
localStorage.setItem("token",t)
}

function logout(){
localStorage.removeItem("token")
location.reload()
}