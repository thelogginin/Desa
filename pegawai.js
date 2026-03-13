/*** Sow Riwayat **/
async function showRiwayat(){

const token = getToken()

const res = await api("riwayat",{token:token})

const content = document.getElementById("content")

content.innerHTML=""

res.data.forEach(r=>{

const div = document.createElement("div")

div.className="card"

div.innerText =
r[0]+" | "+r[4]+" | "+r[5]+" | "+r[7]

content.appendChild(div)

})

}

async function loadPegawai(){

const token=getToken()

const res=await api("listPegawai",{token:token})

const content=document.getElementById("content")

content.innerHTML=`

<div class="card">

<h3>DAFTAR PEGAWAI</h3>

<table class="table">
<thead>
<tr>
<th>NIPD</th>
<th>NAMA</th>
<th>JABATAN</th>
<th>ALAMAT</th>
</tr>
</thead>

<tbody id="pegawaiTable"></tbody>
</table>

</div>

`

const table=document.getElementById("pegawaiTable")

const pegawai = res.data.filter(p =>
p.jabatan !== "ADMIN" && p.jabatan !== "KEPALA"
)

pegawai.forEach(p=>{

table.innerHTML+=`
<tr onclick="detailPegawai('${p.nipd}')">
<td>${p.nipd}</td>
<td style="color:#2196F3;cursor:pointer">${p.nama}</td>
<td>${p.jabatan}</td>
<td>${p.alamat}</td>
</tr>
`

})

}

async function detailPegawai(nipd){

const token=getToken()

const res=await api("detailPegawai",{token:token,nipd:nipd})

const r=res.pegawai
const s=res.stats

let foto=r.foto || "https://i.imgur.com/6VBx3io.png"

const content=document.getElementById("content")

content.innerHTML=`

<div class="profile-card">

<img class="profile-photo" src="${foto}">

<div class="profile-item">Nama : ${r.nama}</div>
<div class="profile-item">NIPD : ${r.nipd}</div>
<div class="profile-item">Jabatan : ${r.jabatan}</div>
<div class="profile-item">Alamat : ${r.alamat}</div>
<div class="profile-item">WA : ${r.wa}</div>
<div class="profile-item">Email : ${r.email}</div>

</div>

<div class="stat-grid">

<div class="stat-card">
<div class="stat-number">${s.hadir}</div>
HADIR
</div>

<div class="stat-card">
<div class="stat-number">${s.terlambat}</div>
TERLAMBAT
</div>

<div class="stat-card">
<div class="stat-number">${s.izin}</div>
IZIN
</div>

<div class="stat-card">
<div class="stat-number">${s.alpha}</div>
ALPHA
</div>

</div>

<div class="card">

<h3>RIWAYAT ABSENSI</h3>

<table class="table">

<tr>
<th>Tanggal</th>
<th>Masuk</th>
<th>Pulang</th>
<th>Status</th>
</tr>

<tbody id="riwayatPegawai"></tbody>

</table>

</div>

<div class="card">

<h3>RANKING PEGAWAI</h3>

<ol id="rankingPegawai"></ol>

</div>

`

const tb=document.getElementById("riwayatPegawai")

res.riwayat.forEach(r=>{

tb.innerHTML+=`
<tr>
<td>${r.tgl}</td>
<td>${r.masuk}</td>
<td>${r.pulang}</td>
<td>${r.status}</td>
</tr>
`

})

loadRanking()

}

async function loadRanking(){

const res=await api("rankingPegawai",{})

const box=document.getElementById("rankingPegawai")

res.data.slice(0,10).forEach((r,i)=>{

box.innerHTML+=`
<li>${r.nama}   =>   (${r.terlambat} terlambat)</li>
`

})

}