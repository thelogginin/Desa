async function login(){

const username = document.getElementById("username").value
const password = document.getElementById("password").value

const res = await api("login",{
username:username,
password:password
})

if(res.ok){

setToken(res.token)

loadDashboard()

}else{

document.getElementById("loginMsg").innerText = res.msg

}

}