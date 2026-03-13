async function showProfil(){

const token = getToken()

const res = await api("profil",{token:token})

const content = document.getElementById("content")

let foto = res.foto || "https://i.imgur.com/6VBx3io.png"

content.innerHTML = `

<div class="profile-card">

<div class="profile-title">
PEGAWAI
</div>

<img class="profile-photo" src="${foto}">

<div class="profile-item">
<span class="icon">👤</span>
<span>${res.nama}</span>
</div>

<div class="profile-item">
<span class="icon">💼</span>
<span>${res.jabatan}</span>
</div>

<div class="profile-item">
<span class="icon">📧</span>
<span>${res.email}</span>
</div>

<div class="profile-item">
<span class="icon">📱</span>
<span>${res.wa}</span>
</div>

<div class="profile-item">
<span class="icon">📍</span>
<span>${res.alamat}</span>
</div>

</div>

`

}

/* =============
   LOAD PROFILE 
   ============= */
async function loadProfil(){

const token = getToken()

const res = await api("profil",{token:token})

let foto = res.foto || "https://i.imgur.com/6VBx3io.png"

document.getElementById("profileBox").innerHTML = `

<div class="profile-card">

<img class="profile-photo" src="${foto}">

<div class="profile-item">
<span class="icon">👤</span> ${res.nama}
</div>

<div class="profile-item">
<span class="icon">💼</span> ${res.jabatan}
</div>

<div class="profile-item">
<span class="icon">📧</span> ${res.email}
</div>

<div class="profile-item">
<span class="icon">📱</span> ${res.wa}
</div>

<div class="profile-item">
<span class="icon">📍</span> ${res.alamat}
</div>

</div>

`

}