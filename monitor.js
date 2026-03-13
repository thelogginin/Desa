
async function loadMonitoring(){

const token = getToken()

const res = await api("monitoring",{token:token})

if(!res.ok) return

const content = document.getElementById("content")

content.innerHTML = `

<div class="stat-grid">

<div class="stat-card">
<div class="stat-number">${res.stats.hadir}</div>
HADIR
</div>

<div class="stat-card">
<div class="stat-number">${res.stats.terlambat}</div>
TERLAMBAT
</div>

<div class="stat-card">
<div class="stat-number">${res.stats.izin}</div>
IZIN
</div>

<div class="stat-card">
<div class="stat-number">${res.stats.alpha}</div>
ALPHA
</div>

</div>

<div class="card">
<h3>ABSEN HARI INI</h3>

<table class="table">
<thead>
<tr>
<th>NIPD</th>
<th>NAMA</th>
<th>ALAMAT</th>
<th>STATUS</th>
</tr>
</thead>

<tbody id="monitorTable"></tbody>
</table>

</div>

<div class="card">
<h3>GRAFIK BULAN INI</h3>

<canvas id="barChart"></canvas>

<br>
<h3>TREND BULAN INI</h3>
<br>
<canvas id="lineChart"></canvas>

</div>

`

/* isi tabel */

const table = document.getElementById("monitorTable")

res.data.forEach(r=>{

table.innerHTML += `
<tr>
<td>${r.nipd}</td>
<td>${r.nama}</td>
<td>${r.alamat}</td>
<td>${r.status}</td>
</tr>
`

})

/* BUAT GRAFIK */

drawBar(res.stats)
drawLine(res.trend)

}


function drawBar(stats){

const ctx = document.getElementById("barChart")

new Chart(ctx,{
type:"bar",

data:{
labels:["Hadir","Terlambat","Izin","Alpha"],

datasets:[{
label:"Statistik Bulan Ini",

data:[
stats.hadir,
stats.terlambat,
stats.izin,
stats.alpha
],

backgroundColor:[
"#4CAF50",   // hijau hadir
"#FF9800",   // orange terlambat
"#2196F3",   // biru izin
"#F44336"    // merah alpha
],

borderRadius:6
}]
},

options:{
responsive:true,
plugins:{
legend:{
display:false
}
}
}

})

}


function drawLine(trend){

const labels = Object.keys(trend)
const values = Object.values(trend)

const ctx = document.getElementById("lineChart")

new Chart(ctx,{

type:"line",

data:{
labels:labels,

datasets:[{
label:"Trend Kehadiran",

data:values,

borderColor:"#4CAF50",
backgroundColor:"rgba(76,175,80,0.2)",

pointBackgroundColor:"#4CAF50",

fill:true,

tension:0.3
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
