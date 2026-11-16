/* AI 記帳本 — 唯一資料層與頁面初始化（規則見 AGENTS.md 第 4、6 節）
   所有頁面只准呼叫本檔的 init*Page() 與純函式，禁止在 HTML 直接操作 localStorage。 */

const CATEGORIES = ["餐飲","交通","購物","娛樂","醫療","學習","其他"]; // 新增類別＝只改這行

function loadEntries(){
  try{ return JSON.parse(localStorage.getItem(_KEY())) || []; }
  catch(e){ return []; }
}
function saveEntries(list){ localStorage.setItem(_KEY(), JSON.stringify(list)); }
function _KEY(){ return "ledger.entries.v1"; }

function makeEntry(amount, category, note, date){
  return { id: "e" + Date.now() + Math.floor(Math.random()*1000),
           amount: Math.round(amount), category, note: note || "", date };
}
function entriesOfMonth(entries, ym){ // ym = "YYYY-MM"
  return entries.filter(e => e.date.slice(0,7) === ym);
}
function sumByCategory(entries){
  const m = {};
  entries.forEach(e => { m[e.category] = (m[e.category]||0) + e.amount; });
  return m;
}
function countByCategory(entries){
  const m = {};
  entries.forEach(e => { m[e.category] = (m[e.category]||0) + 1; });
  return m;
}
function sortByDateDesc(entries){ return [...entries].sort((a,b)=> b.date.localeCompare(a.date) || b.id.localeCompare(a.id)); }
function currentMonth(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); }
function todayStr(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function fmt(n){ return n.toLocaleString("zh-TW"); }

/* === 首頁（記帳） === */
function initIndexPage(){
  const sel = document.getElementById("category");
  CATEGORIES.forEach(c => { const o=document.createElement("option"); o.value=c; o.textContent=c; sel.appendChild(o); });
  document.getElementById("date").value = todayStr();
  document.getElementById("entry-form").addEventListener("submit", function(ev){
    ev.preventDefault();
    const amount = parseInt(document.getElementById("amount").value,10);
    const date = document.getElementById("date").value;
    const msg = document.getElementById("form-msg");
    if(!amount || amount<=0 || !date){ msg.textContent="金額與日期必填"; msg.className="msg err"; return; }
    const e = makeEntry(amount, sel.value, document.getElementById("note").value.trim(), date);
    const list = loadEntries(); list.push(e); saveEntries(list);
    this.reset(); document.getElementById("date").value = todayStr();
    msg.textContent = "已記錄 " + fmt(amount) + " 元"; msg.className = "msg";
    renderIndex();
  });
  renderIndex();
}
function renderIndex(){
  const ym = currentMonth();
  const list = sortByDateDesc(entriesOfMonth(loadEntries(), ym));
  const ul = document.getElementById("entry-list");
  ul.innerHTML = "";
  document.getElementById("empty-hint").style.display = list.length ? "none":"block";
  let total = 0;
  list.forEach(e => {
    total += e.amount;
    const li = document.createElement("li");
    li.innerHTML = '<span><span class="cat"></span><b class="d"></b> <span class="n"></span></span>' +
      '<span><span class="amt"></span> <button class="del" title="刪除">✕</button></span>';
    li.querySelector(".cat").textContent = e.category;
    li.querySelector(".d").textContent = e.date;
    li.querySelector(".n").textContent = e.note;
    li.querySelector(".amt").textContent = fmt(e.amount);
    li.querySelector(".del").addEventListener("click", function(){
      saveEntries(loadEntries().filter(x => x.id !== e.id)); renderIndex();
    });
    ul.appendChild(li);
  });
  document.getElementById("month-total").textContent = "本月共 NT$ " + fmt(total);
}

/* === 月報表頁 === */
function initStatsPage(){
  const picker = document.getElementById("month-picker");
  picker.value = currentMonth();
  picker.addEventListener("change", renderStats);
  renderStats();
}
function renderStats(){
  const ym = document.getElementById("month-picker").value || currentMonth();
  const ents = entriesOfMonth(loadEntries(), ym);
  const cats = sumByCategory(ents), cnts = countByCategory(ents);
  const grand = Object.values(cats).reduce((a,b)=>a+b,0);
  document.getElementById("stats-empty").style.display = ents.length ? "none":"block";
  document.getElementById("grand-total").textContent = ents.length ? ("共 NT$ "+fmt(grand)) : "";
  const chart = document.getElementById("chart"); chart.innerHTML="";
  const tbody = document.querySelector("#stat-table tbody"); tbody.innerHTML="";
  Object.keys(cats).sort((a,b)=>cats[b]-cats[a]).forEach(c => {
    const pct = grand ? Math.round(cats[c]/grand*100) : 0;
    const row = document.createElement("div"); row.className="row";
    row.innerHTML = '<span class="lab"></span><span class="bar"></span><span class="val"></span>';
    row.querySelector(".lab").textContent = c;
    row.querySelector(".bar").style.width = Math.max(2, pct*3.2) + "px";
    row.querySelector(".val").textContent = fmt(cats[c]) + " 元";
    chart.appendChild(row);
    const tr = document.createElement("tr");
    tr.innerHTML = "<td></td><td></td><td></td><td></td>";
    const tds = tr.querySelectorAll("td");
    tds[0].textContent=c; tds[1].textContent=cnts[c]; tds[2].textContent=fmt(cats[c]); tds[3].textContent=pct+"%";
    tbody.appendChild(tr);
  });
}
