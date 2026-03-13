async function ShowUsersPage(){

const content = document.getElementById("content")

content.innerHTML = `

<div class="card">

<h3>Tambah / Edit User</h3>

<div class="form-grid">

<input id="addusername" placeholder="Username">

<input id="addpassword" type="password" placeholder="Password">

<input id="addnipd" placeholder="NIPD">

<input id="addnama" placeholder="Nama">

<input id="addjabatan" placeholder="Jabatan">

<input id="addwa" placeholder="No WA">

<input id="addemail" placeholder="Email">

<input id="addalamat" placeholder="Alamat">

<select id="addrole">
<option value="PEGAWAI">PEGAWAI</option>
<option value="KEPALA">KEPALA</option>
<option value="ADMIN">ADMIN</option>
</select>

<button id="btnUser" onclick="addUser()">Tambah</button>

<button onclick="clearUserForm()">Clear</button>

</div>

</div>


<div class="card">

<h3>Daftar Users</h3>

<table class="table">

<thead>
<tr>
<th>Username</th>
<th>Nama</th>
<th>Jabatan</th>
<th>Role</th>
<th>Aksi</th>
</tr>
</thead>

<tbody id="usersTable"></tbody>

</table>

</div>

`

generateNIPD()
loadUsers()

}

async function loadUsers(){

  const params = new URLSearchParams();

  params.append("action","users");
  params.append("token",localStorage.getItem("token"));

  const res = await fetch(API_URL,{
    method:"POST",
    body:params
  });

  const data = await res.json();

  if(!data.ok){
    alert(data.msg);
    return;
  }

  const table = document.getElementById("usersTable");
  table.innerHTML = "";

  data.data.forEach(u=>{

    table.innerHTML += `
      <tr>
        <td>${u.username}</td>
        <td>${u.nama}</td>
        <td>${u.jabatan}</td>
        <td>${u.role}</td>
        <td>
          <button onclick='editUser(${JSON.stringify(u)})'>Edit</button>
          <button onclick="deleteUser('${u.username}','${u.nipd}')">Hapus</button>
        </td>
      </tr>
    `;

  });

}

/* ============
  Generat NIPD
  ============= */
async function generateNIPD(){

  const params = new URLSearchParams();
  params.append("action","generateNIPD");

  const res = await fetch(API_URL,{
    method:"POST",
    body:params
  });

  const data = await res.json();

  document.getElementById("addnipd").value = data.nipd;
  document.getElementById("addnipd").readOnly = true;

}
/* =============
   ADD USER
============== */
async function addUser(){

  if(!validateUserForm()) return;

  const params = new URLSearchParams();

  const action = window.MODE_EDIT ? "updateUser" : "addUser";

  params.append("action", action);
  params.append("token",localStorage.getItem("token"));

  params.append("username",document.getElementById("addusername").value);
  params.append("password",document.getElementById("addpassword").value);
  params.append("nipd",document.getElementById("addnipd").value);
  params.append("nama",document.getElementById("addnama").value);
  params.append("jabatan",document.getElementById("addjabatan").value);
  params.append("wa",document.getElementById("addwa").value);
  params.append("email",document.getElementById("addemail").value);
  params.append("alamat",document.getElementById("addalamat").value);
  params.append("role",document.getElementById("addrole").value);

  const res = await fetch(API_URL,{
    method:"POST",
    body:params
  });

  const data = await res.json();

  alert(data.msg);

  if(data.ok){
    clearUserForm();
    loadUsers();
  }

}
/** VALIDASI FORM **/
function validateUserForm(){

  const fields = [
    {id:"addusername", name:"Username"},
    {id:"addpassword", name:"Password"},
    {id:"addnipd", name:"NIPD"},
    {id:"addnama", name:"Nama"},
    {id:"addjabatan", name:"Jabatan"},
    {id:"addwa", name:"No WA"},
    {id:"addemail", name:"Email"},
    {id:"addalamat", name:"Alamat"}
  ];

  for(let f of fields){

    const el = document.getElementById(f.id);

    if(!el.value.trim()){

      alert(f.name+" belum diisi");

      el.focus();
      el.style.border="2px solid red";

      return false;

    }

    el.style.border="1px solid #ccc";

  }

  return true;

}

/** CLEAR FORM **/
function clearUserForm(){

  document.getElementById("addusername").value="";
  document.getElementById("addpassword").value="";
  document.getElementById("addnipd").value="";
  document.getElementById("addnama").value="";
  document.getElementById("addjabatan").value="";
  document.getElementById("addwa").value="";
  document.getElementById("addemail").value="";
  document.getElementById("addalamat").value="";

  document.getElementById("addrole").value="PEGAWAI";

  document.getElementById("addusername").readOnly=false;
  document.getElementById("addnipd").readOnly=false;

  document.getElementById("btnUser").innerText="Tambah";

  window.MODE_EDIT=false;

  generateNIPD(); // otomatis buat NIPD baru
}
/* ================
   DELETE USER
================= */

async function deleteUser(username,nipd){

  if(!confirm("Hapus user ini?")) return;

  const params = new URLSearchParams();

  params.append("action","deleteUser");
  params.append("token",localStorage.getItem("token"));
  params.append("username",username);
  params.append("nipd",nipd);

  const res = await fetch(API_URL,{
    method:"POST",
    body:params
  });

  const data = await res.json();

  alert(data.msg);
  loadUsers();

}


/* ==============
   EDIT USER
=============== */
function editUser(u){
  document.getElementById("addusername").value = u.username || "";
  document.getElementById("addnipd").value = u.nipd || "";
  document.getElementById("addnama").value = u.nama || "";
  document.getElementById("addjabatan").value = u.jabatan || "";
  document.getElementById("addwa").value = u.wa || "";
  document.getElementById("addemail").value = u.email || "";
  document.getElementById("addalamat").value = u.alamat || "";
  document.getElementById("addpassword").value = "";
  document.getElementById("addrole").value = u.role || "";
  document.getElementById("addusername").readOnly = true;
  document.getElementById("addnipd").readOnly = true;
  document.getElementById("btnUser").innerText = "Update User";
  window.MODE_EDIT = true;
}