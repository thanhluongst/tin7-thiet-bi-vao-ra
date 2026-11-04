/* Thanh "Tiến trình bài học": đánh số các bước, hoạt động; hiện tiến độ; tô sáng phần đang học.
   Dùng chung cho trang học sinh và trang giáo viên. */
(function(){
"use strict";
function el(tag, attrs, html){ const e = document.createElement(tag); if (attrs) for (const a in attrs) e.setAttribute(a, attrs[a]); if (html != null) e.innerHTML = html; return e; }

const LEGEND = [
  ["empty", "Chưa làm"], ["draft", "Đang làm, chưa nộp"], ["sub", "Đã nộp, chờ chốt"], ["right", "Đúng"], ["wrong", "Cần sửa"]
];

function mount(opts){
  const {root, aside, progress, chot, title} = opts;
  const STAGES = window.LESSON.STAGES, esc = window.LESSON.esc;

  /* 1. Gắn mã số và id cho từng hoạt động trong nội dung bài */
  STAGES.forEach(st => st.acts.forEach(a => {
    const slot = root.querySelector('[data-task="' + a.tasks[0] + '"]');
    const act = slot && slot.closest(".act");
    if (!act) return;
    act.id = a.id; act.setAttribute("data-code", a.code);
    const tag = act.querySelector(".act-tag");
    if (tag && !tag.querySelector(".code")) tag.insertBefore(el("span", {class: "code"}, a.code), tag.firstChild);
  }));

  /* 2. Dựng thanh tiến trình */
  aside.innerHTML = "";
  const det = el("details", {class: "ol"});
  det.open = !window.matchMedia("(max-width: 1099px)").matches;
  const sum = el("summary", null, '<span>' + esc(title || "Tiến trình bài học") + '</span><span class="ol-total"></span>');
  det.appendChild(sum);
  const list = el("ol", {class: "ol-stages"});
  const rows = [];
  STAGES.forEach(st => {
    const li = el("li", {class: "ol-stage", "data-stage": st.id});
    li.appendChild(el("div", {class: "ol-step"}, esc(st.step)));
    li.appendChild(el("a", {href: "#" + st.id, class: "ol-st"}, '<span class="sn">' + st.code + "</span> " + esc(st.title)));
    const acts = el("ol", {class: "ol-acts"});
    st.acts.forEach(a => {
      const ai = el("li", {"data-act": a.id});
      const link = el("a", {href: "#" + a.id}, '<span class="sn">' + a.code + '</span><span class="t">' + esc(a.title) + '</span><span class="cnt"></span>');
      const bar = el("span", {class: "bar", "aria-hidden": "true"}, "<i></i>");
      ai.append(link, bar); acts.appendChild(ai);
      rows.push({a, st, ai, cnt: link.querySelector(".cnt"), fill: bar.querySelector("i")});
    });
    if (st.acts.length > 1 || st.acts[0].title !== st.title) li.appendChild(acts);
    else { li.appendChild(acts); }
    list.appendChild(li);
  });
  det.appendChild(list);
  const leg = el("div", {class: "legend"}, '<div class="legend-t">Màu câu trả lời</div>' +
    LEGEND.map(([k, t]) => '<span class="lg"><i class="sw ' + k + '"></i>' + t + "</span>").join(""));
  det.appendChild(leg);
  aside.appendChild(det);

  /* 3. Cập nhật tiến độ */
  function update(){
    let done = 0, total = 0;
    rows.forEach(r => {
      const p = progress(r.a) || {done: 0, total: 0};
      done += p.done; total += p.total;
      const ratio = p.total ? p.done / p.total : 0;
      r.cnt.textContent = p.label || (p.done + "/" + p.total);
      r.fill.style.width = Math.round(ratio * 100) + "%";
      r.ai.classList.toggle("done", p.total > 0 && ratio >= 1);
      r.ai.classList.toggle("chot", !!(chot && chot(r.a)));
    });
    sum.querySelector(".ol-total").textContent = total ? Math.round(done / total * 100) + "%" : "";
  }

  /* 4. Tô sáng hoạt động đang xem */
  const navLinks = [...document.querySelectorAll("nav.toc a[data-stage]")];
  function setCurrent(actId){
    const r = rows.find(x => x.a.id === actId); if (!r) return;
    rows.forEach(x => x.ai.classList.toggle("cur", x === r));
    list.querySelectorAll(".ol-stage").forEach(li => li.classList.toggle("cur", li.getAttribute("data-stage") === r.st.id));
    navLinks.forEach(l => l.classList.toggle("cur", l.getAttribute("data-stage") === r.st.id));
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis.length) setCurrent(vis[0].target.id);
    }, {rootMargin: "-25% 0px -60% 0px"});
    rows.forEach(r => { const n = document.getElementById(r.a.id); if (n) io.observe(n); });
  }
  aside.addEventListener("click", e => {
    const a = e.target.closest("a[href^='#']"); if (!a) return;
    if (window.matchMedia("(max-width: 1099px)").matches) det.open = false;
  });

  update();
  return {update};
}

window.Outline = {mount};
})();
