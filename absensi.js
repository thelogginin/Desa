async function showAbsen(){

const content = document.getElementById("content")

content.innerHTML = `

<div id="cardQR" class="card">

<h3>SCAN QR ABSENSI</h3>

<button class="btn btn-primary" onclick="startQR('MASUK')">
ABSEN MASUK
</button>

<button class="btn btn-danger" onclick="startQR('PULANG')">
ABSEN PULANG
</button>

<div id="qrScanner" class="hidden">

<p style="text-align:center">
Arahkan kamera ke QR
</p>

<div class="scanner-box">
  <div id="reader"></div>
</div>

<div style="text-align:center;margin-top:10px;">
<button class="btn btn-danger" onclick="stopScanner()">
Tutup Scanner
</button>
</div>

</div>

</div>

`

}
/* =============
   QR SCANNER
=============== */

let html5QrCode;
let scanMode = null;
let QR_SECRET = null;
let scanOnce = false;


async function getQRSecret(){

  const form = new URLSearchParams();
  form.append("action","getQR");

  const res = await fetch(API_URL,{
    method:"POST",
    body:form
  });

  const data = await res.json();
  QR_SECRET = data.secret;

}


async function startQR(mode){

  scanMode = mode;
  scanOnce = false;

  if(!QR_SECRET){
    await getQRSecret();
  }

  document.getElementById("qrScanner").classList.remove("hidden");

  if(html5QrCode){
    try{
      await html5QrCode.stop();
    }catch(e){}
  }

  html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps:10, qrbox:250 },
    (qrCodeMessage)=>{

      if(scanOnce) return;
      scanOnce = true;

      if(qrCodeMessage.trim() === QR_SECRET){

        stopScanner();

        if(scanMode==="MASUK") absenMasuk();
        if(scanMode==="PULANG") absenPulang();

      }else{

        alert("QR Code tidak valid");
        stopScanner();

      }

    }
  );

}


function stopScanner(){

  if(html5QrCode){
    html5QrCode.stop();
  }

  document.getElementById("qrScanner").classList.add("hidden");

}
/*** ABSEN MASUK ***/
async function absenMasuk(){

  navigator.geolocation.getCurrentPosition(async function(pos){

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const form = new URLSearchParams();

    form.append("action","absenMasuk");
    form.append("token",getToken());
    form.append("lat",lat);
    form.append("lng",lng);

    const res = await fetch(API_URL,{
      method:"POST",
      body:form
    });

    const data = await res.json();

    if(data.ok){

      document.getElementById("ket").innerText = "Berhasil absen masuk";
      loadAbsenHariIni();

    }else{

      alert(data.msg);

    }

  });

}
async function absenPulang(alasan=""){

  navigator.geolocation.getCurrentPosition(async function(pos){

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const form = new URLSearchParams();

    form.append("action","absenPulang");
    form.append("token",getToken());
    form.append("lat",lat);
    form.append("lng",lng);
    form.append("alasan",alasan);

    const res = await fetch(API_URL,{
      method:"POST",
      body:form
    });

    const data = await res.json();

    /* =====================
       PERLU ALASAN
    ===================== */

    if(data.needReason){

      document.getElementById("modalAlasan").style.display="flex";

      return;

    }

    /* =====================
       BERHASIL
    ===================== */

    if(data.ok){

      document.getElementById("ket").innerText="Berhasil absen pulang";

      loadAbsenHariIni();

    }else{

      alert(data.msg);

    }

  });

}
/*** Kirim Alasan ***/
function kirimAlasan(){

	const alasan = document.getElementById("inputAlasan").value.trim()

	if(!alasan){
	alert("Alasan wajib diisi")
	return
	}

	document.getElementById("modalAlasan").style.display="none"

	absenPulang(alasan)

	}

	function batalAlasan(){

	document.getElementById("modalAlasan").style.display="none"

	}





