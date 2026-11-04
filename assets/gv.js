/* Trang giáo viên: mở buổi học, theo dõi bài các nhóm gửi lên Google Sheets, chốt kiến thức. */
(function(){
"use strict";
const {TASKS, CONCEPTS, TASK_IDS, L, grade, countSub, esc, summary} = window.LESSON;
const BAI = window.LESSON.id;
const $ = id => document.getElementById(id);
function el(tag, attrs, html){ const e = document.createElement(tag); if (attrs) for (const a in attrs) e.setAttribute(a, attrs[a]); if (html != null) e.innerHTML = html; return e; }
function ss(k, v){ try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch(e) { return null; } }
function ls(k, v){ try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch(e) { return null; } }
const stamp = () => new Date().toLocaleTimeString("vi-VN", {hour:"2-digit", minute:"2-digit", second:"2-digit"});

/* Thứ tự chốt theo tiến trình bài học */
const SECTIONS = [
  ["Mở đầu", ["kd1"]],
  ["Phần 1. Thiết bị vào – ra", ["h1a","h1b","h1c","c1","h2a","h2b","h2c","h2d","sortDev","h2e","c2","p7a","p7b"]],
  ["Phần 2. An toàn thiết bị", ["h3a","h3b","c3","sortSafe","c4","p9a","p9b"]],
  ["Luyện tập", ["lt1","lt2"]],
  ["Vận dụng", ["vd1","vd2","vd3"]]
];
const ALL = SECTIONS.flatMap(s => s[1]);
const labelOf = id => TASKS[id] ? TASKS[id].label : (CONCEPTS[id].t + " (" + (id === "c1" ? "sau HĐ1" : id === "c2" ? "sau phần 1" : id === "c3" ? "sau HĐ3" : "sau phần 2") + ")");

let PIN = ss("gv-pin") || "", BUOI = ls("gv-buoi") || "";
let REV = {}, DOCS = [], pollTimer = null;

$("conn-text").textContent = API.demo ? "Chế độ thử: chưa nối Google Sheets (mã giáo viên thử: tin7)." : "Đã cấu hình Google Sheets.";
$("buoi").value = BUOI;
function suggest(){ const d = new Date(); return "LOP-" + String(d.getDate()).padStart(2, "0") + String(d.getMonth() + 1).padStart(2, "0") + "-" + Math.random().toString(36).slice(2, 5).toUpperCase(); }
$("gen").addEventListener("click", () => { $("buoi").value = suggest(); });

async function login(){
  const pin = $("pin").value || PIN, buoi = API.normSession($("buoi").value);
  const msg = $("login-msg");
  if (!pin) { msg.textContent = "Nhập mã giáo viên."; return; }
  if (!buoi) { msg.textContent = "Nhập hoặc tạo mã buổi học."; return; }
  msg.textContent = "Đang kiểm tra…";
  try { await API.checkPin(pin); }
  catch(e) { msg.textContent = e.message; return; }
  msg.textContent = "";
  PIN = pin; BUOI = buoi; ss("gv-pin", pin); ls("gv-buoi", buoi); $("pin").value = "";
  start();
}
$("login").addEventListener("click", login);
$("pin").addEventListener("keydown", e => { if (e.key === "Enter") login(); });
$("buoi").addEventListener("keydown", e => { if (e.key === "Enter") login(); });

function studentLink(){ const u = new URL("index.html", location.href); u.search = ""; u.hash = ""; u.searchParams.set("buoi", BUOI); return u.toString(); }

async function start(){
  $("dang-nhap").hidden = true; $("app").hidden = false;
  $("code").textContent = BUOI;
  const link = studentLink();
  $("link").textContent = link;
  const qr = $("qr"); qr.innerHTML = "";
  if (typeof window.qrcode === "function") {
    try { const q = window.qrcode(0, "M"); q.addData(link); q.make(); qr.appendChild(el("img", {src: q.createDataURL(6, 2), alt: "Mã QR mở trang học sinh"})); }
    catch(e) { qr.hidden = true; }
  } else qr.hidden = true;
  try { REV = await API.getReveal(BAI, BUOI); } catch(e) { setSync("Chưa tải được phần chốt: " + e.message); }
  renderRev();
  poll();
}
function stop(){ clearTimeout(pollTimer); $("app").hidden = true; $("dang-nhap").hidden = false; }
$("switch").addEventListener("click", () => { stop(); $("buoi").value = ""; $("buoi").focus(); });
$("logout").addEventListener("click", () => { stop(); PIN = ""; ss("gv-pin", null); });
$("copy").addEventListener("click", async () => {
  const t = $("link").textContent;
  try { await navigator.clipboard.writeText(t); $("copy").textContent = "Đã sao chép"; }
  catch(e) { const r = document.createRange(); r.selectNodeContents($("link")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); $("copy").textContent = "Đã chọn link, nhấn Ctrl+C"; }
  setTimeout(() => { $("copy").textContent = "Sao chép link"; }, 2500);
});

function setSync(t){ $("sync").textContent = t; }

/* ---------- Theo dõi lớp ---------- */
async function poll(){
  clearTimeout(pollTimer);
  try {
    const docs = await API.getClass(BAI, BUOI, PIN);
    DOCS = docs.map(x => Object.assign({name: x.group || "(chưa nhập tên)", t: x.t, clientId: x.clientId}, x.data || {}))
               .sort((a, b) => String(a.name).localeCompare(String(b.name), "vi", {numeric: true}));
    setSync("Cập nhật lúc " + stamp());
    renderDash();
  } catch(e) {
    setSync("Chưa tải được bài làm: " + e.message);
    if (/mã giáo viên/i.test(e.message)) { stop(); $("login-msg").textContent = e.message; return; }
  }
  pollTimer = setTimeout(poll, 8000);
}
$("refresh").addEventListener("click", poll);

const dsel = $("dash-select");
TASK_IDS.forEach(id => dsel.appendChild(el("option", {value:id}, esc(TASKS[id].label))));
dsel.addEventListener("change", renderDash);
$("dash-reveal").addEventListener("click", () => toggleRev(dsel.value));
function timeAgo(t){ if (!t) return "—"; const s = Math.round((Date.now() - t) / 1000); if (s < 60) return "vừa xong"; if (s < 3600) return Math.floor(s / 60) + " phút trước"; return new Date(t).toLocaleTimeString("vi-VN", {hour:"2-digit", minute:"2-digit"}); }

function renderDash(){
  const docs = DOCS, id = dsel.value, t = TASKS[id];
  const nSub = docs.filter(d => d.sub && d.sub[id]).length;
  let nOk = 0;
  if (t.type !== "open") docs.forEach(d => { if (d.sub && d.sub[id]) { const g = grade(id, d); if (g && g.ok) nOk++; } });
  $("dash-sum").innerHTML = "<span>Số nhóm/học sinh: <b>" + docs.length + "</b></span><span>Đã nộp câu đang xem: <b>" + nSub + "/" + docs.length + "</b></span>" +
    (t.type !== "open" ? "<span>Đúng: <b>" + nOk + "/" + nSub + "</b></span>" : "");
  const tb = $("dash-rows"); tb.innerHTML = "";
  if (!docs.length) tb.appendChild(el("tr", null, '<td colspan="3" class="empty">Chưa có nhóm nào vào buổi học. Học sinh quét mã QR, nhập tên nhóm và bấm Vào buổi học.</td>'));
  docs.forEach(d => tb.appendChild(el("tr", null, "<td>" + esc(d.name) + '</td><td class="num">' + countSub(d) + "/" + TASK_IDS.length + '</td><td class="num">' + timeAgo(d.t) + "</td>")));
  $("dash-reveal").textContent = REV[id] ? "Ẩn phần chốt câu này" : "Chốt câu này cho cả lớp";
  $("dash-key").innerHTML = "<b>Đáp án / chốt:</b> " + (t.type === "mcq" ? "Đáp án đúng: <b>" + L[t.a] + "</b>. " : "") + t.k;
  const list = $("dash-answers"); list.innerHTML = "";
  if (!docs.length) { list.appendChild(el("p", {class:"empty"}, "Câu trả lời của các nhóm sẽ hiện ở đây.")); return; }
  docs.forEach(d => {
    const sub = !!(d.sub && d.sub[id]);
    let body = "", chip = sub ? '<span class="chip sub">Đã nộp</span>' : '<span class="chip draft">Đang làm</span>';
    if (t.type === "open") body = esc((d.ans && d.ans[id]) || "");
    else { const g = grade(id, d); if (g) { body = esc(g.text); if (sub) chip += g.ok ? ' <span class="chip ok">Đúng</span>' : ' <span class="chip bad">Chưa đúng</span>'; } }
    if (!body) { body = '<span class="empty">Chưa trả lời</span>'; chip = '<span class="chip draft">Chưa làm</span>'; }
    const item = el("div", {class:"ans-item"});
    item.appendChild(el("div", {class:"who-l"}, esc(d.name) + " " + chip));
    item.appendChild(el("div", {class:"txt"}, body));
    list.appendChild(item);
  });
}

/* ---------- CSV ---------- */
$("csv").addEventListener("click", () => {
  const head = ["Nhóm / Học sinh", "Đã nộp", "Cập nhật"].concat(summary({}).map(c => c[0]));
  const rows = DOCS.map(d => [d.name, countSub(d) + "/" + TASK_IDS.length, d.t ? new Date(d.t).toLocaleString("vi-VN") : ""].concat(summary(d).map(c => c[1])));
  const q = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
  const csv = "﻿" + [head].concat(rows).map(r => r.map(q).join(",")).join("\r\n");
  const a = el("a", {href: URL.createObjectURL(new Blob([csv], {type: "text/csv;charset=utf-8"})), download: "bai-lam-" + BUOI + ".csv"});
  document.body.appendChild(a); a.click(); a.remove();
});

/* ---------- Chốt kiến thức ---------- */
let saving = false, again = false;
async function pushRev(){
  if (saving) { again = true; return; }
  saving = true; setSync("Đang lưu phần chốt…");
  try { await API.setReveal(BAI, BUOI, PIN, REV); setSync("Đã lưu phần chốt lúc " + stamp()); }
  catch(e) { setSync("Chưa lưu được phần chốt: " + e.message + ". Bấm lại để thử."); }
  saving = false; if (again) { again = false; pushRev(); }
}
function toggleRev(id){ REV = Object.assign({}, REV, {[id]: !REV[id]}); renderRev(); renderDash(); pushRev(); }
function setAll(v){ const n = {}; ALL.forEach(k => n[k] = v); REV = n; renderRev(); renderDash(); pushRev(); }
$("rev-all").addEventListener("click", () => setAll(true));
$("rev-none").addEventListener("click", () => setAll(false));
function renderRev(){
  const box = $("rev-list"); box.innerHTML = "";
  SECTIONS.forEach(([title, ids]) => {
    box.appendChild(el("div", {class:"rev-group"}, esc(title)));
    ids.forEach(id => {
      const on = !!REV[id];
      const row = el("div", {class:"rev-row" + (on ? " on" : "")});
      row.appendChild(el("span", null, (TASKS[id] ? "" : "<b>") + esc(labelOf(id)) + (TASKS[id] ? "" : "</b>")));
      const b = el("button", {class:"btn " + (on ? "" : "keybtn"), type:"button"}, on ? "Ẩn" : "Chốt");
      b.addEventListener("click", () => toggleRev(id));
      row.appendChild(b); box.appendChild(row);
    });
  });
}

if (PIN && BUOI) start();
})();
