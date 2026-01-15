<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Student Lodge – Fawad Apps</title>

<!-- PWA -->
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#4f46e5">

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  touch-action:manipulation;
}
body{
  margin:0;
  font-family:system-ui, sans-serif;
  background:#f4f4f5;
}
body.dark{background:#020617;color:#e5e7eb}

#splash{
  position:fixed;
  inset:0;
  background:linear-gradient(135deg,#4f46e5,#1e293b);
  color:#fff;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  align-items:center;
  padding:30px 20px;
  z-index:5000;
}
#splash h1{margin-top:20px;font-size:26px}
#splash h1 span{display:block;font-size:14px}
.go-btn{
  width:160px;
  padding:14px;
  border-radius:30px;
  border:none;
  font-size:16px;
  font-weight:700;
}
header{
  position:sticky;
  top:0;
  background:#fff;
  padding:14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
body.dark header{background:#020617}

.menu-btn,.add-btn{font-size:22px;padding:8px 14px}
#menu{
  position:fixed;
  background:#fff;
  border-radius:18px;
  padding:12px;
  width:240px;
  display:none;
  z-index:1000;
}
body.dark #menu{background:#1e293b}

button{
  width:100%;
  padding:10px;
  margin:6px 0;
  border:none;
  border-radius:14px;
  background:#4f46e5;
  color:#fff;
  font-size:14px;
}
#search{
  width:calc(100% - 20px);
  margin:10px;
  padding:12px;
  border-radius:18px;
  border:1px solid #ccc;
}
.card{
  background:#fff;
  margin:10px;
  border-radius:20px;
  padding:10px;
}
body.dark .card{background:#1e293b}
.row{display:flex;align-items:center;gap:8px}
.expand{display:none}
.expand.show{display:block}
input{
  width:100%;
  padding:10px;
  margin:4px 0;
  border-radius:14px;
  border:1px solid #ccc;
}
</style>
</head>

<body>

<div id="splash">
  <h1>Fawad Apps <span>A Company of Trust</span></h1>
  <button class="go-btn" onclick="enterApp()">GO</button>
</div>

<header>
  <div class="menu-btn" id="menuBtn">⋮</div>
  <b>Fawad Apps</b>
  <div class="add-btn" onclick="addStudent()">＋</div>
</header>

<div id="menu">
  <input type="month" id="monthPicker">
  <button onclick="changeMonth()">📅 Change Month</button>
  <button onclick="save()">💾 Save</button>
  <button onclick="exportBackup()">📤 Export Backup</button>
  <button onclick="importBackup()">📥 Import Backup</button>
  <button onclick="toggleDark()">🌙 Dark Mode</button>
  <button onclick="exportPDF()">📄 Export PDF</button>

  <!-- 🔥 INSTALL BUTTON (MOBILE FIX) -->
  <button id="installBtn" style="display:none;background:#16a34a">
    📲 Install App
  </button>

  <input type="file" id="importFile" hidden>
</div>

<input id="search" placeholder="Search name" oninput="search(this.value)">
<div id="list"></div>

<script>
/* ---------------- SPLASH ---------------- */
if(sessionStorage.getItem("entered")==="true"){
  document.getElementById("splash").style.display="none";
}
function enterApp(){
  splash.style.display="none";
  sessionStorage.setItem("entered","true");
}

/* ---------------- MENU ---------------- */
menuBtn.onclick=e=>{
  const r=e.target.getBoundingClientRect();
  menu.style.top=r.bottom+8+"px";
  menu.style.left=r.right-menu.offsetWidth+"px";
  menu.style.display=menu.style.display==="block"?"none":"block";
};

/* ---------------- DATA ---------------- */
let currentMonth=localStorage.getItem("currentMonth")||new Date().toISOString().slice(0,7);
let data=JSON.parse(localStorage.getItem("data_"+currentMonth)||"[]");
monthPicker.value=currentMonth;

function addStudent(){
  data.push({name:"",paid:false,open:false});
  render();
}
function toggleRow(i){data[i].open=!data[i].open;render();}
function togglePaid(i){data[i].paid=!data[i].paid;render();}
function removeRow(i){data.splice(i,1);render();}

function render(){
  list.innerHTML="";
  data.forEach((r,i)=>{
    list.innerHTML+=`
    <div class="card">
      <div class="row">
        <div>${i+1}</div>
        <input value="${r.name}" placeholder="Name"
          oninput="data[${i}].name=this.value">
        <button onclick="toggleRow(${i})">▶</button>
      </div>
      <div class="expand ${r.open?"show":""}">
        <button onclick="togglePaid(${i})">
          ${r.paid?"Paid":"Not Paid"}
        </button>
        <button onclick="removeRow(${i})" style="background:#991b1b">
          Delete
        </button>
      </div>
    </div>`;
  });
}
render();

/* ---------------- SEARCH ---------------- */
function search(q){
  q=q.toLowerCase();
  document.querySelectorAll(".card").forEach((c,i)=>{
    c.style.display=(data[i].name||"").toLowerCase().includes(q)?"":"none";
  });
}

/* ---------------- STORAGE ---------------- */
function save(){
  localStorage.setItem("data_"+currentMonth,JSON.stringify(data));
  localStorage.setItem("currentMonth",currentMonth);
}
function changeMonth(){
  save();
  currentMonth=monthPicker.value;
  data=JSON.parse(localStorage.getItem("data_"+currentMonth)||"[]");
  render();
}
function exportBackup(){
  save();
  const b=new Blob([JSON.stringify({month:currentMonth,data})]);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(b);
  a.download="backup_"+currentMonth+".json";
  a.click();
}
function importBackup(){importFile.click();}
importFile.onchange=e=>{
  const r=new FileReader();
  r.onload=()=>{
    const b=JSON.parse(r.result);
    currentMonth=b.month;
    data=b.data;
    save();
    render();
  };
  r.readAsText(e.target.files[0]);
};

/* ---------------- DARK MODE ---------------- */
function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("dark",document.body.classList.contains("dark"));
}
if(localStorage.getItem("dark")==="true"){
  document.body.classList.add("dark");
}

/* ---------------- PDF ---------------- */
function exportPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  data.forEach((r,i)=>{
    doc.text(`${i+1}. ${r.name} - ${r.paid?"PAID":"NOT PAID"}`,10,10+i*8);
  });
  doc.save("Student_Lodge.pdf");
}

/* ---------------- SERVICE WORKER ---------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

/* ---------------- 🔥 INSTALL PROMPT (MOBILE FIX) ---------------- */
let deferredPrompt;

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBtn").style.display="block";
});

document.getElementById("installBtn").addEventListener("click", async () => {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});
</script>

</body>
</html>
