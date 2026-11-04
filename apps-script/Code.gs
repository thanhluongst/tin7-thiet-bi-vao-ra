/**
 * Máy chủ lưu bài làm cho trang học Tin học 7 (GitHub Pages) bằng Google Sheets.
 *
 * CÀI ĐẶT (xem README.md để có hướng dẫn kèm hình):
 * 1. Tạo một Google Sheet mới → Tiện ích mở rộng → Apps Script → dán toàn bộ tệp này.
 * 2. Cài đặt dự án (biểu tượng bánh răng) → Thuộc tính tập lệnh → Thêm:
 *      Thuộc tính: MA_GIAO_VIEN   Giá trị: mã bí mật của thầy/cô
 * 3. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *      Thực thi dưới dạng: Tôi      Người có quyền truy cập: Bất kỳ ai
 * 4. Sao chép URL ứng dụng web (đuôi /exec) và dán vào config.js của trang GitHub.
 *
 * Không ghi mã giáo viên vào tệp này hay vào GitHub: mã chỉ nằm trong Thuộc tính tập lệnh.
 */

const SHEET_BAI = "BaiLam";
const SHEET_CHOT = "Chot";
const SHEET_NX = "NhanXet";
const NX_HEADERS = ["Khóa", "Bài", "Buổi", "Nhóm / Học sinh", "Mã máy", "Nhận xét (không sửa)", "Tóm tắt nhận xét", "Cập nhật"];
const BASE_HEADERS = ["Khóa", "Bài", "Buổi", "Nhóm / Học sinh", "Mã máy", "Cập nhật", "Đã nộp", "Dữ liệu (không sửa)"];
const COL_JSON = 8;               // cột "Dữ liệu"
const MAX_JSON = 45000;           // giới hạn ô Google Sheets là 50 000 kí tự
const ID_RE = /^[A-Za-z0-9_.\-]{1,60}$/;

function doGet(e) {
  return handle_(function () {
    const p = (e && e.parameter) || {};
    switch (p.action) {
      case "ping": return {};
      case "reveal": return { rev: getReveal_(id_(p.bai), id_(p.buoi)) };
      case "status": return { rev: getReveal_(id_(p.bai), id_(p.buoi)), nx: getNx_(id_(p.bai), id_(p.buoi), id_(p.clientId)) };
      case "checkpin": checkPin_(p.pin); return {};
      case "class": checkPin_(p.pin); return { docs: getClass_(id_(p.bai), id_(p.buoi)) };
      default: throw new Error("Hành động không hợp lệ");
    }
  });
}

function doPost(e) {
  return handle_(function () {
    let b;
    try { b = JSON.parse(e.postData.contents); } catch (err) { throw new Error("Dữ liệu gửi lên không hợp lệ"); }
    switch (b.action) {
      case "submit": saveSubmission_(b); return {};
      case "setReveal": checkPin_(b.pin); setReveal_(id_(b.bai), id_(b.buoi), b.rev); return {};
      case "comment": checkPin_(b.pin); return { nx: setComment_(b) };
      default: throw new Error("Hành động không hợp lệ");
    }
  });
}

function handle_(fn) {
  let out;
  try { out = Object.assign({ ok: true }, fn()); }
  catch (err) { out = { ok: false, error: String((err && err.message) || err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function id_(v) {
  const s = String(v || "");
  if (!ID_RE.test(s)) throw new Error("Mã bài hoặc mã buổi học không hợp lệ");
  return s;
}

function checkPin_(pin) {
  const real = PropertiesService.getScriptProperties().getProperty("MA_GIAO_VIEN");
  if (!real) throw new Error("Chưa đặt MA_GIAO_VIEN trong Thuộc tính tập lệnh của Apps Script");
  if (String(pin || "") !== real) {
    Utilities.sleep(800);         // làm chậm việc đoán mã
    throw new Error("Sai mã giáo viên");
  }
}

/* Chặn công thức trong ô (=, +, -, @) để dữ liệu học sinh không chạy như công thức */
function safe_(v) {
  const s = String(v == null ? "" : v).slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function findRow_(sh, key) {
  if (sh.getLastRow() < 2) return 0;
  const cell = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(key).matchEntireCell(true).findNext();
  return cell ? cell.getRow() : 0;
}

/* ---------- Bài làm ---------- */
function saveSubmission_(b) {
  const bai = id_(b.bai), buoi = id_(b.buoi), cid = id_(b.clientId);
  const json = JSON.stringify(b.data || {});
  if (json.length > MAX_JSON) throw new Error("Bài làm quá dài, em hãy rút gọn câu trả lời");
  const cols = Array.isArray(b.cols) ? b.cols.slice(0, 80) : [];

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_(SHEET_BAI, BASE_HEADERS);
    // thêm cột cho câu hỏi mới (nếu có)
    let header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const add = cols.map(c => String(c[0]).slice(0, 120)).filter(h => header.indexOf(h) < 0);
    if (add.length) {
      sh.getRange(1, header.length + 1, 1, add.length).setValues([add]).setFontWeight("bold");
      header = header.concat(add);
    }
    const key = bai + "|" + buoi + "|" + cid;
    const row = new Array(header.length).fill("");
    row[0] = key; row[1] = bai; row[2] = buoi;
    row[3] = safe_(String(b.group || "").slice(0, 80));
    row[4] = cid; row[5] = new Date(); row[6] = Number(b.sub) || 0;
    row[COL_JSON - 1] = json;
    cols.forEach(c => { const i = header.indexOf(String(c[0]).slice(0, 120)); if (i >= 0) row[i] = safe_(c[1]); });

    const r = findRow_(sh, key);
    if (r) sh.getRange(r, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function getClass_(bai, buoi) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_BAI);
  if (!sh || sh.getLastRow() < 2) return [];
  const vals = sh.getRange(2, 1, sh.getLastRow() - 1, COL_JSON).getValues();
  const allNx = getAllNx_(bai, buoi);
  const out = [];
  vals.forEach(v => {
    if (String(v[1]) !== bai || String(v[2]) !== buoi) return;   // Sheets có thể đổi "1104" thành số
    let data = {};
    try { data = JSON.parse(v[COL_JSON - 1] || "{}"); } catch (err) {}
    const g = String(v[3] || "");
    out.push({ group: g.charAt(0) === "'" ? g.slice(1) : g, clientId: v[4], t: v[5] instanceof Date ? v[5].getTime() : 0, data: data, nx: allNx[String(v[4])] || {} });
  });
  return out;
}

/* ---------- Nhận xét của giáo viên cho từng nhóm, từng câu ---------- */
function getNx_(bai, buoi, cid) {
  const cache = CacheService.getScriptCache();
  const ck = "nx|" + bai + "|" + buoi + "|" + cid;
  const hit = cache.get(ck);
  if (hit) return JSON.parse(hit);
  let nx = {};
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NX);
  if (sh) {
    const r = findRow_(sh, bai + "|" + buoi + "|" + cid);
    if (r) { try { nx = JSON.parse(sh.getRange(r, 6).getValue() || "{}"); } catch (err) {} }
  }
  cache.put(ck, JSON.stringify(nx), 21600);
  return nx;
}

function getAllNx_(bai, buoi) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NX);
  const out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues().forEach(v => {
    if (String(v[1]) !== bai || String(v[2]) !== buoi) return;
    try { out[String(v[4])] = JSON.parse(v[5] || "{}"); } catch (err) {}
  });
  return out;
}

function setComment_(b) {
  const bai = id_(b.bai), buoi = id_(b.buoi), cid = id_(b.clientId), task = id_(b.task);
  const text = String(b.text || "").trim().slice(0, 2000);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_(SHEET_NX, NX_HEADERS);
    const key = bai + "|" + buoi + "|" + cid;
    const r = findRow_(sh, key);
    let nx = {};
    if (r) { try { nx = JSON.parse(sh.getRange(r, 6).getValue() || "{}"); } catch (err) {} }
    if (text) nx[task] = text; else delete nx[task];
    const summary = Object.keys(nx).map(k => k + ": " + nx[k]).join("\n");
    const row = [key, bai, buoi, safe_(String(b.group || "").slice(0, 80)), cid, JSON.stringify(nx), safe_(summary), new Date()];
    if (r) sh.getRange(r, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    CacheService.getScriptCache().put("nx|" + key, JSON.stringify(nx), 21600);
    return nx;
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Chốt kiến thức ---------- */
function getReveal_(bai, buoi) {
  const cache = CacheService.getScriptCache();
  const ck = "rev|" + bai + "|" + buoi;
  const hit = cache.get(ck);
  if (hit) return JSON.parse(hit);
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_CHOT);
  let rev = {};
  if (sh) {
    const r = findRow_(sh, bai + "|" + buoi);
    if (r) { try { rev = JSON.parse(sh.getRange(r, 4).getValue() || "{}"); } catch (err) {} }
  }
  cache.put(ck, JSON.stringify(rev), 21600);
  return rev;
}

function setReveal_(bai, buoi, rev) {
  const clean = {};
  Object.keys(rev || {}).slice(0, 200).forEach(k => { if (ID_RE.test(k)) clean[k] = !!rev[k]; });
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_(SHEET_CHOT, ["Khóa", "Bài", "Buổi", "Đã chốt", "Cập nhật"]);
    const key = bai + "|" + buoi;
    const row = [key, bai, buoi, JSON.stringify(clean), new Date()];
    const r = findRow_(sh, key);
    if (r) sh.getRange(r, 1, 1, 5).setValues([row]);
    else sh.appendRow(row);
    CacheService.getScriptCache().put("rev|" + key, JSON.stringify(clean), 21600);
  } finally {
    lock.releaseLock();
  }
}

/* Chạy thử trong trình soạn thảo Apps Script để tạo sẵn hai trang tính */
function khoiTao() {
  sheet_(SHEET_BAI, BASE_HEADERS);
  sheet_(SHEET_CHOT, ["Khóa", "Bài", "Buổi", "Đã chốt", "Cập nhật"]);
  sheet_(SHEET_NX, NX_HEADERS);
}
