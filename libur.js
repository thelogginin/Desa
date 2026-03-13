
function showLibur(){

const content = document.getElementById("content")

let aksiHeader = USER_ROLE==="ADMIN" ? "<th>Aksi</th>" : ""

let formTambah = ""

/* FORM TAMBAH LIBUR HANYA UNTUK ADMIN */

if(USER_ROLE==="ADMIN"){

formTambah = `

<div class="card">

<h3>TAMBAH HARI LIBUR</h3>

<div class="form-row">
<label>Mulai</label>
<input type="date" id="liburMulai">
</div>

<div class="form-row">
<label>Selesai</label>
<input type="date" id="liburSelesai">
</div>

<div class="form-row">
<label>Keterangan</label>
<input type="text" id="liburKet">
</div>

<button class="btn btn-primary" onclick="addLibur()">
Tambah Libur
</button>

</div>

`
}

content.innerHTML = `

${formTambah}

<div class="card">

<h3>DAFTAR HARI LIBUR</h3>

<table class="table">

<thead>
<tr>
<th>Mulai</th>
<th>Selesai</th>
<th>Keterangan</th>
${aksiHeader}
</tr>
</thead>

<tbody id="liburTable"></tbody>

</table>

</div>

`

loadLibur()

}

/* =============================
   LOAD LIBUR
============================= */
async function loadLibur(){

const params = new URLSearchParams();
params.append("action","getLibur");
params.append("token",getToken());

const res = await fetch(API_URL,{method:"POST",body:params});
const data = await res.json();

const table = document.getElementById("liburTable");
table.innerHTML="";

data.data.forEach((l,i)=>{

if(USER_ROLE==="ADMIN"){

table.innerHTML += `
<tr>
<td>${l.mulai}</td>
<td>${l.selesai}</td>
<td>${l.ket}</td>
<td>
<button class="btn btn-danger" onclick="deleteLibur(${i})">
Hapus
</button>
</td>
</tr>
`

}else{

table.innerHTML += `
<tr>
<td>${l.mulai}</td>
<td>${l.selesai}</td>
<td>${l.ket}</td>
</tr>
`

}

})

}


/* =============================
   DELETE LIBUR
============================= */

async function deleteLibur(row){

if(!confirm("Hapus libur ini?")) return;

const params = new URLSearchParams();

params.append("action","deleteLibur");
params.append("token",getToken());
params.append("row",row);

const res = await fetch(API_URL,{method:"POST",body:params});
const data = await res.json();

alert(data.msg);

loadLibur();

}

/* =============================
   ADD LIBUR
============================= */

async function addLibur(){

const mulai = liburMulai.value;
const selesai = liburSelesai.value;
const ket = liburKet.value;

const params = new URLSearchParams();

params.append("action","addLibur");
params.append("token",getToken());
params.append("mulai",mulai);
params.append("selesai",selesai);
params.append("ket",ket);

const res = await fetch(API_URL,{method:"POST",body:params});
const data = await res.json();

alert(data.msg);

if(data.ok){

liburMulai.value="";
liburSelesai.value="";
liburKet.value="";

loadLibur();

}

}
