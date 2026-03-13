/*** LOAD LAPORAN ***/
function loadLaporan(){

const content = document.getElementById("content")

content.innerHTML = `

<div class="card">

<h3>LAPORAN ABSENSI</h3>

<label>Pilih</label>

<select id="jenisLaporan" onchange="pilihJenisLaporan()">
<option value="">-- Pilih --</option>
<option value="semua">Semua Pegawai</option>
<option value="cari">Cari Pegawai</option>
</select>

<div id="laporanForm"></div>

</div>

`

}

function pilihJenisLaporan(){

const val = document.getElementById("jenisLaporan").value

if(val==="semua") formSemuaPegawai()
if(val==="cari") formCariPegawai()

}

function formSemuaPegawai(){

const form = document.getElementById("laporanForm")

form.innerHTML = `

<div class="card">

<div class="form-row">
<label>Dari Tanggal</label>
<input type="date" id="tglMulai">
</div>

<div class="form-row">
<label>Sampai Tanggal</label>
<input type="date" id="tglSelesai">
<small>Maksimal 100 hari</small>
</div>

<br>

<button class="btn btn-primary" onclick="exportExcelSemua()">
Export Excel
</button>

</div>

`

}

function formCariPegawai(){

const form = document.getElementById("laporanForm")

form.innerHTML = `

<div class="card">

<label>Cari Dengan</label>

<select id="modeCari">
<option value="nipd">NIPD</option>
<option value="nama">Nama</option>
</select>

<input id="keywordPegawai" placeholder="Ketik pencarian">

<button onclick="cariPegawai()">Cari</button>

<div id="hasilCari"></div>

</div>

`

}

async function cariPegawai(){

const mode = document.getElementById("modeCari").value
const keyword = document.getElementById("keywordPegawai").value

const token = getToken()

const res = await api("cariPegawai",{
token:token,
mode:mode,
keyword:keyword
})

if(!res.ok){
alert(res.msg || "Pencarian gagal")
return
}

const box = document.getElementById("hasilCari")
box.innerHTML = ""

res.data.forEach(p=>{

box.innerHTML += `
<div class="card" onclick="pilihPegawai('${p.nipd}','${p.nama}')">
${p.nipd} - ${p.nama}
</div>
`

})

}

function pilihPegawai(nipd,nama){

const form = document.getElementById("laporanForm")

form.innerHTML = `

<div class="card">

<h3>${nama} (${nipd})</h3>

<div class="form-row">
<label>Dari Tanggal</label>
<input type="date" id="tglMulai">
</div>

<div class="form-row">
<label>Sampai Tanggal</label>
<input type="date" id="tglSelesai">
<small>Maksimal 100 hari</small>
</div>

<br>

<button class="btn btn-primary" onclick="exportExcelPegawai('${nipd}')">
Export Excel
</button>

</div>

`

}

function validasiTanggal(){

const mulai = new Date(document.getElementById("tglMulai").value)
const selesai = new Date(document.getElementById("tglSelesai").value)

const diff = (selesai - mulai) / (1000*60*60*24)

if(diff > 100){
alert("Range maksimal 100 hari")
return false
}

return true

}

async function exportExcelPegawai(nipd){

if(!validasiTanggal()) return

const mulai = document.getElementById("tglMulai").value
const selesai = document.getElementById("tglSelesai").value

const token = getToken()

const res = await api("exportExcelPegawai",{
token:token,
nipd:nipd,
mulai:mulai,
selesai:selesai
})

if(!res.ok){
alert(res.msg || "Export gagal")
return
}

/* BASE64 → FILE */

const binary = atob(res.file)
const bytes = new Uint8Array(binary.length)

for(let i=0;i<binary.length;i++){
bytes[i] = binary.charCodeAt(i)
}

const blob = new Blob([bytes],{
type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
})

const url = URL.createObjectURL(blob)

const a = document.createElement("a")
a.href = url
a.download = res.filename
a.click()

URL.revokeObjectURL(url)

}

async function exportExcelSemua(){

if(!validasiTanggal()) return

const mulai = document.getElementById("tglMulai").value
const selesai = document.getElementById("tglSelesai").value

const token = getToken()

const res = await api("exportSemuaExcel",{
token:token,
mulai:mulai,
selesai:selesai
})

if(!res.ok){
alert(res.msg || "Export gagal")
return
}

/* CONVERT BASE64 → FILE */

const binary = atob(res.file)
const bytes = new Uint8Array(binary.length)

for(let i=0;i<binary.length;i++){
bytes[i] = binary.charCodeAt(i)
}

const blob = new Blob([bytes],{
type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
})

const url = URL.createObjectURL(blob)

const a = document.createElement("a")
a.href = url
a.download = res.filename
a.click()

URL.revokeObjectURL(url)

}