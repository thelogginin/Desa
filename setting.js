/*** MENU SETTING ***/
function showSetting(){

const content = document.getElementById("content")

content.innerHTML = `

<div class="card">

<h3>SETTING SISTEM</h3>

<table class="table">
<thead>
<tr>
<th>Key</th>
<th>Value</th>
<th>Aksi</th>
</tr>
</thead>

<tbody id="settingTable"></tbody>

</table>

</div>

`

loadSetting()

}

/* =============================
   LOAD SETTING
============================= */

async function loadSetting(){

const params = new URLSearchParams();
params.append("action","getSettingList");
params.append("token",getToken());

const res = await fetch(API_URL,{method:"POST",body:params});
const data = await res.json();

const table = document.getElementById("settingTable");
table.innerHTML="";

data.data.forEach(s=>{

table.innerHTML += `
<tr>
<td>${s.key}</td>
<td>
<input id="set_${s.key}" value="${s.value}">
</td>
<td>
<button onclick="updateSetting('${s.key}')">Save</button>
</td>
</tr>
`

})

}

/* =============================
   UPDATE SETTING
============================= */

async function updateSetting(key){

const value = document.getElementById("set_"+key).value;

const params = new URLSearchParams();
params.append("action","updateSetting");
params.append("token",getToken());
params.append("key",key);
params.append("value",value);

const res = await fetch(API_URL,{method:"POST",body:params});
const data = await res.json();

alert(data.msg);

}