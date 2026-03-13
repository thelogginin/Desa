let USER_ROLE = ""

/* ============
   LOAD dashboard
   ============== */
 async function loadDashboard(){

const token = getToken()

const res = await api("dashboard",{token:token})

if(!res.ok){
logout()
return
}

document.getElementById("loginPage").classList.add("hidden")
document.getElementById("dashboardPage").classList.remove("hidden")

USER_ROLE = res.role

const nama = res.nama.toUpperCase()
const role = res.role.charAt(0).toUpperCase() + res.role.slice(1).toLowerCase()

document.getElementById("welcome").innerHTML =
`${nama}<br><span>${role} Desa</span>`

buildMenu(res.fitur)

loadProfil()

// hanya pegawai yang ada absensi
if(res.role === "PEGAWAI"){
  loadAbsenHariIni()
}else{
  document.getElementById("absenHariIniBox").innerHTML = ""
}

document.getElementById("content").innerHTML=""

document.getElementById("homeContent").style.display="block"

}

/* =================================
   MENU BUILDER
   ================================== */
function buildMenu(fitur){

const menu = document.getElementById("bottomMenu")
menu.innerHTML=""

const icons = {
home:"🏠",
absen:"📷",
riwayat:"📅",
libur:"🎉",
profil:"👤",
monitoring:"📊",
laporan:"📈",
pegawai:"👤👤",
users:"📱",
export:"📁",
setting:"⚙️",
logout:"🚪"
}

/* ==========
   OPEN menu
   ========= */
function openMenu(f){

const content = document.getElementById("content")
const home = document.getElementById("homeContent")

content.innerHTML=""

if(f==="home"){
home.style.display="block"
return
}

home.style.display="none"

if(f==="absen") showAbsen()

if(f==="riwayat") loadStatistik()

if(f==="libur") showLibur()
	
if(f==="monitoring") loadMonitoring()
	
if(f==="setting") showSetting()
	
if(f==="pegawai") loadPegawai()
	
if(f==="laporan") loadLaporan()
	
if(f==="export") loadLaporan()
	
if(f==="users") ShowUsersPage()
	
}



/* HOME selalu ada */

const homeBtn = document.createElement("div")
homeBtn.className="menu-item"

homeBtn.innerHTML = `
<span class="icon">${icons.home}</span>
HOME
`

homeBtn.onclick = ()=>openMenu("home")

menu.appendChild(homeBtn)

/* MENU DARI ROLE */

fitur.forEach(f=>{

if(f==="profil") return  // profil sudah tampil di home

const div = document.createElement("div")
div.className="menu-item"

div.innerHTML = `
<span class="icon">${icons[f] || "📌"}</span>
${f.toUpperCase()}
`

div.onclick = ()=>openMenu(f)

menu.appendChild(div)

})

/* LOGOUT */

const logoutBtn = document.createElement("div")

logoutBtn.className="menu-item"

logoutBtn.innerHTML = `
<span class="icon">${icons.logout}</span>
LOGOUT
`

logoutBtn.onclick = logout

menu.appendChild(logoutBtn)

menu.classList.remove("hidden")

}
/********************/
async function loadAbsenHariIni(){

const token = getToken()

const res = await api("absenHariIni",{token:token})

if(!res.ok) return

document.getElementById("absenHariIniBox").innerHTML = `

<div class="status-box">

<div class="status-text">
${res.status} ${res.ket}
</div>

<div class="jam-box">

<div>
${res.masuk}
<div class="jam-label">MASUK</div>
</div>

<div>
${res.pulang}
<div class="jam-label">PULANG</div>
</div>

</div>

</div>

`

}
/* =============
   Statistik
   =========== */
async function loadStatistik(){

  const token = getToken()
  const res = await api("riwayat",{token:token})

  if(!res.ok) return
  
	
  let hadir=0
  let terlambat=0
  let izin=0
  let alpha=0

  const now = new Date()
  const bulan = now.getMonth()

  res.data.forEach(r=>{

    const tglStr = r[0] || ""

    if(!tglStr) return

    const bulanData = parseInt(tglStr.split("-")[1]) - 1

    if(bulanData !== bulan) return

    const ket = (r[7] || "").toUpperCase().trim()
	
	if(ket.includes("TEPAT")) hadir++

	else if(ket.includes("TERLAMBAT")) terlambat++

	else if(
	  ket.includes("IZIN") ||
	  ket.includes("PULANG CEPAT") ||
	  ket.includes("SAKIT") ||
	  ket.includes("CUTI")
	){
	  izin++
	}

	else if(
	  ket.includes("TIDAK HADIR") ||
	  ket.includes("ALPHA")
	){
	  alpha++
	}
	
  })

  const content = document.getElementById("content")

  content.innerHTML = `
  <div class="stat-grid">

    <div class="stat-card">
      <div class="stat-number">${hadir}</div>
      HADIR
    </div>

    <div class="stat-card">
      <div class="stat-number">${terlambat}</div>
      TERLAMBAT
    </div>

    <div class="stat-card">
      <div class="stat-number">${izin}</div>
      IZIN
    </div>

    <div class="stat-card">
      <div class="stat-number">${alpha}</div>
      ALPHA
    </div>

  </div>

  <div class="card">
    <canvas id="chartAbsensi"></canvas>
  </div>
  `

  renderChart(hadir,terlambat,izin,alpha)

}

/* =========
   CHART 
   ====== */
   function renderChart(hadir,terlambat,izin,alpha){

const ctx = document.getElementById("chartAbsensi")

new Chart(ctx,{

type:"doughnut",

data:{
labels:["Hadir","Terlambat","Izin","Alpha"],
datasets:[{
data:[hadir,terlambat,izin,alpha],
backgroundColor:[
"#4CAF50",
"#FF9800",
"#2196F3",
"#F44336"
]
}]
},

options:{
responsive:true,
plugins:{
legend:{
position:"bottom"
}
}
}

})

}







