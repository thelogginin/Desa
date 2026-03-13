async function api(action,data={}){

data.action = action

const form = new URLSearchParams(data)

const res = await fetch(API_URL,{
method:"POST",
body:form
})

return res.json()

}