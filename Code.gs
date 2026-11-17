// Derech Library backend: paste into Apps Script attached to a Google Sheet.
// Set the admin PIN: Project Settings > Script Properties > add PIN = (your pin)
const WEEK = 7 * 864e5;
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("Loans");
  if (!sh) { sh = ss.insertSheet("Loans"); sh.appendRow(["book","title","name","phone","token","out","due"]); }
  return sh;
}
function rows_(sh) { const v = sh.getDataRange().getValues(); v.shift(); return v; }
function find_(sh, book) { const v = sh.getDataRange().getValues(); for (let i = 1; i < v.length; i++) if (v[i][0] === book) return i + 1; return 0; }
function doGet(e) {
  let r; const p = e.parameter, lock = LockService.getScriptLock();
  try { lock.waitLock(10000); r = handle_(p); } catch (err) { r = { error: String(err) }; } finally { try { lock.releaseLock(); } catch (x) {} }
  return ContentService.createTextOutput(JSON.stringify(r)).setMimeType(ContentService.MimeType.JSON);
}
function handle_(p) {
  const sh = sheet_(), now = Date.now();
  if (p.action === "status") return { out: rows_(sh).map(r => r[0]) };
  if (p.action === "mine") return { mine: rows_(sh).filter(r => r[4] === p.token).map(r => ({ book: r[0], due: r[6] })) };
  if (p.action === "take") {
    if (!p.book || !p.name) return { error: "Missing name" };
    if (find_(sh, p.book)) return { error: "Someone just took this book" };
    sh.appendRow([p.book, p.title || "", p.name, "'" + (p.phone || ""), p.token, now, now + WEEK]);
    return { ok: true, due: now + WEEK };
  }
  if (p.action === "return" || p.action === "extend") {
    const i = find_(sh, p.book);
    if (!i) return { ok: true };
    if (sh.getRange(i, 5).getValue() !== p.token) return { error: "Only the person who took it can do that" };
    if (p.action === "return") { sh.deleteRow(i); return { ok: true }; }
    const due = sh.getRange(i, 7).getValue() + WEEK; sh.getRange(i, 7).setValue(due); return { ok: true, due };
  }
  if (p.action === "admin" || p.action === "adminreturn") {
    if (p.pin !== PropertiesService.getScriptProperties().getProperty("PIN")) return { error: "Wrong PIN" };
    if (p.action === "adminreturn") { const i = find_(sh, p.book); if (i) sh.deleteRow(i); return { ok: true }; }
    return { loans: rows_(sh).map(r => ({ book: r[0], title: r[1], name: r[2], phone: String(r[3]).replace(/^'/, ""), out: r[5], due: r[6] })) };
  }
  return { error: "Unknown action" };
}
