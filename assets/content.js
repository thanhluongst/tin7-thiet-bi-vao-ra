/* Nội dung bài học: câu hỏi SGK, đáp án chốt và cách chấm. Dùng chung cho trang học sinh và trang giáo viên. */
(function(){
"use strict";
const TASKS = {
  kd1:{type:"open", label:"Mở đầu", q:"Ở lớp 6, em đã biết máy tính cần bốn thành phần cơ bản để hỗ trợ con người xử lí thông tin. Đó là những thành phần nào? Thành phần nào giúp máy tính trao đổi dữ liệu với thế giới bên ngoài?",
    k:"Bốn thành phần: <b>thiết bị vào, thiết bị ra, bộ xử lí và bộ nhớ</b>. Trong đó, <b>thiết bị vào – ra</b> đóng vai trò quan trọng, giúp máy tính trao đổi dữ liệu với thế giới bên ngoài."},
  h1a:{type:"open", label:"HĐ1 – câu 1", q:"Các thiết bị trong Hình 1.1 làm việc với dạng thông tin nào?",
    k:"Micro và loa làm việc với thông tin dạng <b>âm thanh</b>."},
  h1b:{type:"open", label:"HĐ1 – câu 2", q:"Thiết bị nào tiếp nhận thông tin và chuyển vào máy tính?",
    k:"<b>Micro</b> nhận âm thanh và chuyển vào máy tính để mã hoá thành dữ liệu số. Micro là <b>thiết bị vào</b>."},
  h1c:{type:"open", label:"HĐ1 – câu 3", q:"Thiết bị nào nhận thông tin từ máy tính đưa ra bên ngoài?",
    k:"<b>Loa</b> nhận dữ liệu từ máy tính, thể hiện ra bên ngoài dưới dạng âm thanh mà chúng ta nghe được. Loa là <b>thiết bị ra</b>."},
  h2a:{type:"open", label:"HĐ2 – câu 1", q:"Mỗi thiết bị vào – ra trong Hình 1.2 làm việc với dạng thông tin nào? Thiết bị nào có cả hai chức năng vào và ra?",
    k:"<ul><li>Thiết bị vào: chuột, bàn phím (lệnh, văn bản); micro (âm thanh); camera, máy quét (hình ảnh).</li><li>Thiết bị ra: màn hình, máy in (văn bản, hình ảnh); tai nghe, loa (âm thanh).</li><li><b>Bảng vẽ điện tử có bút cảm ứng</b> xuất hiện ở cả hai nhóm: vừa nhận nét vẽ, thao tác chạm (vào) vừa hiển thị hình ảnh (ra), nên có cả hai chức năng.</li></ul>"},
  h2b:{type:"open", label:"HĐ2 – câu 2", q:"Máy chiếu là thiết bị vào hay thiết bị ra? Máy chiếu làm việc với dạng thông tin nào?",
    k:"Máy chiếu là <b>thiết bị ra</b>, dùng để hiển thị nội dung màn hình máy tính lên màn chiếu. Máy chiếu làm việc với thông tin dạng <b>hình ảnh, văn bản</b>."},
  h2c:{type:"open", label:"HĐ2 – câu 3", q:"Bộ điều khiển game (Hình 1.3a) là thiết bị vào hay thiết bị ra?",
    k:"Bộ điều khiển game là <b>thiết bị vào</b>: đưa mệnh lệnh vào máy tính để điều khiển đối tượng trong trò chơi."},
  h2d:{type:"open", label:"HĐ2 – câu 4", q:"Màn hình cảm ứng (Hình 1.3b) là thiết bị vào, thiết bị ra hay có cả hai chức năng vào và ra?",
    k:"Màn hình cảm ứng có <b>cả hai chức năng</b>: hiển thị thông tin (ra), đồng thời phát hiện vị trí và sự di chuyển của ngón tay trên bề mặt để chọn đối tượng, thực hiện lệnh (vào)."},
  sortDev:{type:"sort", label:"Xếp thiết bị vào nhóm",
    q:"Chọn nhóm cho từng thiết bị.",
    cats:["Vào","Ra","Vừa vào vừa ra"],
    items:[["Chuột",0],["Bàn phím",0],["Micro",0],["Webcam",0],["Camera an ninh",0],["Máy quét",0],["Bút cảm ứng",0],["Bộ điều khiển game",0],["Tấm cảm ứng (touchpad)",0],
           ["Màn hình",1],["Máy in",1],["Loa",1],["Tai nghe",1],["Máy chiếu",1],
           ["Màn hình cảm ứng",2],["Tai nghe có gắn micro",2]],
    k:"Tiêu chí phân loại là <b>chiều đi của thông tin so với máy tính</b>, không phải hình dạng thiết bị. Thông tin đi vào máy tính: thiết bị vào. Thông tin đi ra khỏi máy tính: thiết bị ra. Có cả hai chiều: vừa vào vừa ra."},
  h2e:{type:"open", label:"Đọc hiểu – câu 5", q:"Loa thông minh và máy ghi hình kĩ thuật số là thiết bị vào hay ra? Ngoài nhập hoặc xuất thông tin, chúng còn thực hiện được những chức năng nào?",
    k:"<ul><li><b>Loa thông minh</b> là <b>thiết bị ra</b>. Ngoài ra, nó còn kết nối không dây với máy tính, điện thoại thông minh, Internet,… để trao đổi dữ liệu; có thể nhận lệnh bằng giọng nói và trả lời bằng giọng nói.</li><li><b>Máy ghi hình kĩ thuật số</b> là <b>thiết bị vào</b>, còn có thể <b>lưu trữ</b> và thực hiện một số chức năng <b>xử lí</b> ảnh, xử lí video đơn giản.</li></ul>"},
  p7a:{type:"mcq", label:"Câu hỏi tr.7 – câu 1", q:"Em hãy cho biết máy ảnh nhập thông tin dạng nào vào máy tính?", o:["Con số.","Văn bản.","Hình ảnh.","Âm thanh."], a:2,
    k:"Máy ảnh là thiết bị vào, nhập thông tin dạng <b>hình ảnh</b>."},
  p7b:{type:"mcq", label:"Câu hỏi tr.7 – câu 2", q:"Thiết bị nào xuất dữ liệu âm thanh từ máy tính ra ngoài?", o:["Máy ảnh.","Micro.","Màn hình.","Loa."], a:3,
    k:"<b>Loa</b> là thiết bị ra, xuất dữ liệu âm thanh. Micro cũng làm việc với âm thanh nhưng là thiết bị vào."},
  h3a:{type:"match", label:"HĐ3 – câu 1", q:"Em hãy lắp các thiết bị vào đúng cổng bằng cách chọn số cổng cho mỗi đầu nối.",
    items:[["a) Bàn phím",7],["b) Dây mạng",6],["c) Chuột",7],["d) Dây màn hình",3],["e) Tai nghe",4],["f) Dây nguồn",8]],
    k:"a – 7, b – 6, c – 7, d – 3, e – 4, f – 8."},
  h3b:{type:"open", label:"HĐ3 – câu 2", q:"Việc cấp nguồn điện cho máy tính cần được thực hiện trước hay sau các kết nối trên? Tại sao?",
    k:"Cấp nguồn điện <b>sau</b> khi các thiết bị đã được kết nối xong, để đảm bảo an toàn điện cho người dùng và cho thiết bị."},
  sortSafe:{type:"sort", label:"Nên / Không nên",
    q:"Với mỗi việc dưới đây khi sử dụng máy tính, em chọn Nên hoặc Không nên.",
    cats:["Nên","Không nên"],
    items:[["Đọc kĩ hướng dẫn trước khi sử dụng thiết bị",0],["Thao tác tuỳ tiện, không theo hướng dẫn",1],["Giữ bàn tay khô, sạch khi sử dụng máy tính",0],["Để đồ uống gần chuột, bàn phím, thẻ nhớ",1],["Gõ phím dứt khoát nhưng nhẹ nhàng",0],["Dùng vật sắc, nhọn tác động lên màn hình",1],["Sử dụng nút lệnh Shut down để tắt máy tính",0],["Tắt máy tính bằng cách ngắt điện đột ngột",1],["Rút điện trước khi lau, dọn máy tính",0],["Chạm vào phần kim loại của máy tính",1],["Đóng mọi tài liệu và ứng dụng trước khi tắt máy",0],["Nối máy tính với máy in khi một trong hai máy đang bật nguồn",1]],
    k:"Đối chiếu Bảng 1.1 (SGK trang 9). Những việc không nên làm có thể gây hỏng thiết bị, mất dữ liệu hoặc mất an toàn điện."},
  p9a:{type:"mcq", label:"Câu hỏi tr.9 – câu 1", q:"Thao tác nào sau đây tắt máy tính một cách an toàn?", o:["Sử dụng nút lệnh Restart của Windows.","Sử dụng nút lệnh Shut down của Windows.","Nhấn giữ công tắc nguồn vài giây.","Rút dây nguồn khỏi ổ cắm."], a:1,
    k:"Dùng nút lệnh <b>Shut down</b>. Restart là khởi động lại máy; nhấn giữ công tắc nguồn hoặc rút dây nguồn là ngắt điện đột ngột, dễ mất dữ liệu và hỏng máy."},
  p9b:{type:"open", label:"Câu hỏi tr.9 – câu 2", q:"Tại sao không nên vừa ăn vừa sử dụng máy tính?",
    k:"Vụn thức ăn, nước uống có thể rơi vào bàn phím, chuột gây kẹt phím, chập điện, hỏng thiết bị; tay dính thức ăn làm bẩn thiết bị. Vừa ăn vừa dùng máy cũng không tốt cho sức khoẻ."},
  lt1:{type:"mcq", label:"Luyện tập – câu 1", q:"Một bộ tai nghe có gắn micro sử dụng cho máy tính là loại thiết bị gì?", o:["Thiết bị vào.","Thiết bị ra.","Thiết bị vừa vào vừa ra.","Không phải thiết bị vào – ra."], a:2,
    k:"Tai nghe xuất âm thanh (ra), micro gắn kèm nhập âm thanh (vào), nên bộ tai nghe có micro là <b>thiết bị vừa vào vừa ra</b>."},
  lt2:{type:"order", label:"Luyện tập – câu 2", q:"Máy tính của em đang làm việc với một tệp trên thẻ nhớ. Em hãy sắp xếp lại thứ tự các thao tác để tắt máy tính an toàn, không làm mất dữ liệu (dùng nút ↑ ↓).",
    items:{a:"Chọn nút lệnh Shut down để tắt máy tính.",b:"Đóng tệp đang mở trên thẻ nhớ.",c:"Chọn \"Safe To Remove Hardware\" để ngắt kết nối với thẻ nhớ.",d:"Lưu lại nội dung của tệp."},
    start:["a","b","c","d"], ans:["d","b","c","a"],
    k:"Thứ tự đúng: <b>d → b → c → a</b>. Lưu tệp, đóng tệp, ngắt kết nối thẻ nhớ an toàn, rồi mới tắt máy bằng Shut down."},
  vd1:{type:"open", label:"Vận dụng – câu 1", q:"Trên màn hình theo dõi, em thấy một người đứng trước camera an ninh. Người đó có biết em đang theo dõi không? Tại sao?",
    k:"<b>Không biết.</b> Camera là thiết bị vào: chỉ thu hình ảnh rồi chuyển vào máy tính, không đưa thông tin nào ra để người đứng trước camera biết có người đang xem."},
  vd2:{type:"open", label:"Vận dụng – câu 2", q:"Máy in của em in ra những kí hiệu không mong muốn và em biết lỗi này là do virus gây ra. Em cần phải diệt virus ở máy in hay không? Tại sao?",
    k:"<b>Không cần</b> diệt virus ở máy in. Máy in là thiết bị ra, chỉ in theo dữ liệu máy tính gửi tới. Virus nằm trên máy tính làm sai dữ liệu gửi đi, vì vậy cần quét và diệt virus <b>trên máy tính</b>."},
  vd3:{type:"open", label:"Vận dụng – câu 3", q:"Em hãy đề xuất một số quy tắc để giúp các bạn sử dụng phòng máy tính an toàn.",
    k:"Gợi ý: không mang đồ ăn, nước uống vào phòng máy; giữ tay khô, sạch; không tự ý cắm, rút thiết bị khi máy đang bật; tắt máy bằng lệnh Shut down; không chạm vào phần kim loại, ổ điện; báo thầy cô khi thiết bị gặp sự cố; giữ chỗ ngồi gọn gàng, sạch sẽ."}
};
const CONCEPTS = {
  c1:{t:"Khái niệm", b:"<ul><li><b>Thiết bị vào</b> được dùng để nhập thông tin vào máy tính như bàn phím, chuột, micro,…</li><li><b>Thiết bị ra</b> được dùng để xuất thông tin từ máy tính ra bên ngoài như màn hình, máy in, loa,…</li><li>Cách nhận biết: xét <b>chiều đi của thông tin</b> so với máy tính.</li></ul>"},
  c2:{t:"Ghi nhớ", b:"<ul><li>Thiết bị vào được dùng để nhập thông tin vào máy tính.</li><li>Thiết bị ra xuất thông tin từ máy tính ra để con người nhận biết được.</li><li>Các thiết bị vào – ra có nhiều loại, có những công dụng và hình dạng khác nhau. Một số thiết bị vào – ra còn thực hiện cả chức năng lưu trữ, xử lí dữ liệu.</li></ul>"},
  c3:{t:"Chốt kiến thức", b:"<ul><li>Đầu nối tai nghe (e) cắm vào cổng <b>4</b>. Cắm nhầm sang cổng 5 sẽ không nghe thấy âm thanh, em có thể tưởng thiết bị bị hỏng.</li><li>Dây màn hình (d) cắm vào cổng <b>3</b>. Cố cắm vào cổng khác có thể làm hỏng đầu nối.</li><li>Cổng <b>7</b> là cổng USB dùng cho nhiều thiết bị như bàn phím, chuột. Cắm nhầm đầu nối khác có thể gây chập điện, hỏng thiết bị.</li><li>Dây nguồn (f) cắm vào cổng <b>8</b>; chỉ cấp nguồn <b>sau khi</b> các thiết bị đã được kết nối.</li></ul>"},
  c4:{t:"Ghi nhớ", b:"<ul><li>Đọc kĩ hướng dẫn của nhà sản xuất trước khi sử dụng thiết bị.</li><li>Kết nối các thiết bị đúng cách.</li><li>Giữ gìn nơi làm việc với máy tính gọn gàng, ngăn nắp, vệ sinh, khô ráo.</li></ul>"}
};
const TASK_IDS = Object.keys(TASKS);
const L = ["A","B","C","D"];
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function grade(id, d){
  const t = TASKS[id];
  if (t.type === "mcq") { const v = d.mcq && d.mcq[id]; if (v == null) return null; return {ok: v === t.a, right: v === t.a ? 1 : 0, total: 1, text: "Chọn " + L[v]}; }
  if (t.type === "sort") { const m = (d.sort && d.sort[id]) || {}; let r = 0, n = 0, wrong = [];
    t.items.forEach(([name, c], i) => { const v = m[i]; if (v != null && v !== -1) n++; if (v === c) r++; else wrong.push(name + (v == null || v === -1 ? " → ?" : " → " + t.cats[v])); });
    if (!n) return null; return {ok: r === t.items.length, right: r, total: t.items.length, text: "Đúng " + r + "/" + t.items.length + (wrong.length ? ". Chưa đúng: " + wrong.join("; ") : "")}; }
  if (t.type === "match") { const m = (d.match && d.match[id]) || {}; let r = 0, n = 0, parts = [];
    t.items.forEach(([name, p], i) => { const v = m[i]; if (v) n++; if (Number(v) === p) r++; parts.push(name.slice(0, 2) + " " + (v || "?")); });
    if (!n) return null; return {ok: r === t.items.length, right: r, total: t.items.length, text: "Đúng " + r + "/" + t.items.length + " (" + parts.join(", ") + ")"}; }
  if (t.type === "order") { const a = d.order && d.order[id]; if (!Array.isArray(a)) return null; let r = 0; a.forEach((k, i) => { if (k === t.ans[i]) r++; });
    return {ok: r === a.length, right: r, total: a.length, text: a.join(" → ")}; }
  return null;
}

function countSub(d){ return TASK_IDS.filter(id => d && d.sub && d.sub[id]).length; }
/* Các cột dễ đọc gửi lên Google Sheet: mỗi câu một cột */
function summary(d){
  return TASK_IDS.map(id => {
    const t = TASKS[id], sub = !!(d.sub && d.sub[id]);
    let v = "";
    if (t.type === "open") v = (d.ans && d.ans[id]) || "";
    else { const g = grade(id, d); if (g) v = g.text + (sub ? (g.ok ? " ✓" : " ✗") : ""); }
    if (v && !sub) v = "(nháp) " + v;
    return [id + " · " + t.label, v];
  });
}
/* Nhận xét mẫu cho giáo viên: ok = khi trả lời đúng/tốt, fix = khi cần sửa.
   Bám theo dự kiến khó khăn của học sinh trong kế hoạch bài dạy. */
const NX_MAU = {
  kd1: {ok:["Chính xác! Em nhớ đủ 4 thành phần: thiết bị vào, thiết bị ra, bộ xử lí và bộ nhớ.","Tốt! Em đã chỉ ra thiết bị vào – ra giúp máy tính trao đổi dữ liệu với thế giới bên ngoài."],
        fix:["Em còn thiếu thành phần. Nhớ lại lớp 6: thiết bị vào, thiết bị ra, bộ xử lí và bộ nhớ.","Em nêu thêm: thành phần nào giúp máy tính trao đổi dữ liệu với thế giới bên ngoài?"]},
  h1a: {ok:["Đúng, micro và loa cùng làm việc với thông tin dạng âm thanh."],
        fix:["Micro thu tiếng nói, loa phát ra tiếng. Đó là dạng thông tin gì?"]},
  h1b: {ok:["Chính xác! Micro nhận âm thanh và chuyển vào máy tính, nên micro là thiết bị vào.","Tốt! Em nói thêm: âm thanh được mã hoá thành dữ liệu số."],
        fix:["Em xét chiều đi của âm thanh: từ người nói đi vào máy tính qua thiết bị nào?"]},
  h1c: {ok:["Chính xác! Loa đưa âm thanh từ máy tính ra ngoài, nên loa là thiết bị ra."],
        fix:["Thông tin đi từ máy tính ra ngoài để em nghe được qua thiết bị nào?"]},
  h2a: {ok:["Em đã nêu đúng dạng thông tin của từng thiết bị. Rất tốt!","Tốt! Em phát hiện bảng vẽ điện tử có mặt ở cả nhóm vào và nhóm ra."],
        fix:["Em còn thiếu dạng thông tin của một số thiết bị. Thử ghép với: âm thanh, hình ảnh, văn bản, lệnh.","Em quan sát kĩ Hình 1.2: thiết bị nào có mặt ở cả nhóm vào và nhóm ra?"]},
  h2b: {ok:["Đúng! Máy chiếu đưa hình ảnh, văn bản từ máy tính ra màn chiếu nên là thiết bị ra."],
        fix:["Máy chiếu nhận hình từ máy tính rồi chiếu cho cả lớp xem. Thông tin đi vào hay đi ra khỏi máy tính?"]},
  h2c: {ok:["Chính xác! Bộ điều khiển game đưa lệnh vào máy tính để điều khiển trò chơi."],
        fix:["Khi em bấm nút trên tay cầm, lệnh đi vào hay đi ra khỏi máy tính?"]},
  h2d: {ok:["Đúng! Màn hình cảm ứng vừa hiển thị (ra) vừa nhận thao tác chạm (vào)."],
        fix:["Màn hình cảm ứng có hiển thị hình không? Có nhận ngón tay chạm không? Vậy nó có mấy chức năng?"]},
  sortDev: {ok:["Nhóm xếp đúng tất cả thiết bị. Rất tốt!"],
        fix:["Nhóm hãy phân loại theo chiều đi của thông tin, không dựa vào hình dạng thiết bị."]},
  h2e: {ok:["Đúng! Loa thông minh là thiết bị ra; máy ghi hình là thiết bị vào và còn lưu trữ, xử lí ảnh, video."],
        fix:["Em đọc lại SGK trang 7: loa thông minh là thiết bị vào hay ra? Ngoài ra nó còn làm được gì?"]},
  p7a: {ok:["Chính xác! Máy ảnh nhập thông tin dạng hình ảnh."],
        fix:["Máy ảnh chụp lại cái gì? Đó là dạng thông tin nào?"]},
  p7b: {ok:["Chính xác! Loa xuất âm thanh từ máy tính ra ngoài."],
        fix:["Micro cũng làm việc với âm thanh nhưng đưa âm thanh vào máy. Thiết bị nào đưa âm thanh ra?"]},
  h3a: {ok:["Nhóm lắp đúng tất cả các cổng!"],
        fix:["Em xem kĩ hình dạng đầu nối, kí hiệu và màu của cổng. Ví dụ: tai nghe cắm cổng màu xanh lá có hình tai nghe."]},
  h3b: {ok:["Đúng! Chỉ cấp nguồn sau khi đã kết nối xong các thiết bị để an toàn điện."],
        fix:["Nếu cắm điện trước rồi mới cắm các dây khác thì điều gì có thể xảy ra?"]},
  sortSafe: {ok:["Nhóm phân biệt đúng việc nên làm và không nên làm. Rất tốt!"],
        fix:["Với mỗi việc, em hỏi: việc này có làm hỏng thiết bị, mất dữ liệu hay mất an toàn điện không?"]},
  p9a: {ok:["Chính xác! Dùng nút lệnh Shut down là cách tắt máy an toàn."],
        fix:["Nhấn giữ công tắc hay rút dây nguồn là ngắt điện đột ngột. Cách nào an toàn hơn?"]},
  p9b: {ok:["Đúng! Thức ăn, nước uống có thể làm hỏng bàn phím, chuột và gây chập điện."],
        fix:["Em nghĩ thêm: nếu nước hay vụn bánh rơi vào bàn phím thì sao?"]},
  lt1: {ok:["Chính xác! Bộ tai nghe có micro là thiết bị vừa vào vừa ra."],
        fix:["Tai nghe phát âm thanh (ra), micro gắn kèm thu âm thanh (vào). Vậy cả bộ là loại thiết bị gì?"]},
  lt2: {ok:["Thứ tự đúng: lưu tệp, đóng tệp, ngắt kết nối thẻ nhớ, rồi tắt máy."],
        fix:["Nếu rút thẻ nhớ khi tệp chưa lưu, dữ liệu có bị mất không? Em sắp xếp lại nhé."]},
  vd1: {ok:["Lập luận rất tốt: camera chỉ là thiết bị vào nên người đứng trước không biết đang bị theo dõi."],
        fix:["Camera có hiển thị gì cho người đứng trước nó không? Em xét chiều đi của thông tin."]},
  vd2: {ok:["Chính xác! Virus nằm ở máy tính, máy in chỉ là thiết bị ra in theo dữ liệu được gửi tới."],
        fix:["Máy in tự nghĩ ra nội dung để in hay in theo dữ liệu máy tính gửi tới? Virus nằm ở đâu?"]},
  vd3: {ok:["Nhóm đưa ra các quy tắc rõ ràng, thiết thực. Rất tốt!"],
        fix:["Em bổ sung thêm quy tắc về đồ ăn uống, cách tắt máy và cách cắm, rút thiết bị."]}
};
const NX_CHUNG = ["Cảm ơn nhóm đã trình bày rõ ràng!","Em giải thích thêm lí do nhé.","Ý đúng nhưng còn thiếu, em bổ sung thêm."];

/* Nhận xét tự sinh, nêu đúng chỗ sai (dùng cho xếp nhóm, ghép cổng, sắp thứ tự) */
function autoComment(id, d){
  const t = TASKS[id];
  if (t.type === "sort") {
    const m = (d.sort && d.sort[id]) || {};
    const wrong = t.items.map(([name, c], i) => ({name, c, v: m[i]})).filter(x => x.v !== x.c && x.v != null && x.v !== -1);
    const unsure = t.items.filter((x, i) => m[i] == null || m[i] === -1).map(x => x[0]);
    if (!wrong.length && !unsure.length) return "";
    let s = "";
    if (wrong.length) s += "Nhóm xếp chưa đúng: " + wrong.map(x => x.name + " (nhóm chọn " + t.cats[x.v] + ")").join("; ") + ". ";
    if (unsure.length) s += "Chưa xếp: " + unsure.join(", ") + ". ";
    return s + (id === "sortDev" ? "Em xét lại: thông tin đi vào hay đi ra khỏi máy tính?" : "Em xét lại: việc này có làm hỏng thiết bị, mất dữ liệu hay mất an toàn không?");
  }
  if (t.type === "match") {
    const m = (d.match && d.match[id]) || {};
    const wrong = t.items.map(([name, p], i) => ({name, p, v: m[i]})).filter(x => Number(x.v) !== x.p);
    if (!wrong.length) return "";
    return "Nhóm cần xem lại: " + wrong.map(x => x.name + (x.v ? " (nhóm chọn cổng " + x.v + ")" : " (chưa chọn)")).join("; ") + ". Gợi ý: so hình dạng đầu nối với kí hiệu, màu của cổng.";
  }
  if (t.type === "order") {
    const a = d.order && d.order[id];
    if (!Array.isArray(a) || a.join() === t.ans.join()) return "";
    return "Nhóm sắp xếp: " + a.join(" → ") + ". Em xem lại: phải lưu và đóng tệp trước, ngắt thẻ nhớ an toàn rồi mới tắt máy.";
  }
  return "";
}
/* Tiến trình bài học theo 4 bước của kế hoạch bài dạy (CV 5512) */
const STAGES = [
  {id:"mo-dau", code:"1", step:"Bước 1", title:"Khởi động", acts:[
    {title:"Nhớ lại kiến thức lớp 6", tasks:["kd1"]}]},
  {id:"phan-1", code:"2.1", step:"Bước 2 · Hình thành kiến thức mới", title:"Thiết bị vào – ra", acts:[
    {title:"Hoạt động 1: Micro và loa", tasks:["h1a","h1b","h1c"], concept:"c1"},
    {title:"Hoạt động 2: Sự đa dạng của thiết bị", tasks:["h2a","h2b","h2c","h2d"]},
    {title:"Thảo luận: Xếp thiết bị vào nhóm", tasks:["sortDev"]},
    {title:"Đọc hiểu: Lưu trữ, xử lí dữ liệu", tasks:["h2e"], concept:"c2"},
    {title:"Câu hỏi SGK trang 7", tasks:["p7a","p7b"]}]},
  {id:"phan-2", code:"2.2", step:"Bước 2 · Hình thành kiến thức mới", title:"An toàn thiết bị", acts:[
    {title:"Hoạt động 3: Kết nối thiết bị", tasks:["h3a","h3b"], concept:"c3"},
    {title:"Thảo luận: Nên / Không nên", tasks:["sortSafe"], concept:"c4"},
    {title:"Câu hỏi SGK trang 9", tasks:["p9a","p9b"]}]},
  {id:"luyen-tap", code:"3", step:"Bước 3", title:"Luyện tập", acts:[
    {title:"Bài tập SGK trang 9", tasks:["lt1","lt2"]}]},
  {id:"van-dung", code:"4", step:"Bước 4", title:"Vận dụng", acts:[
    {title:"Liên hệ thực tế", tasks:["vd1","vd2","vd3"]}]}
];
STAGES.forEach(st => st.acts.forEach((a, i) => { a.code = st.acts.length > 1 ? st.code + "." + (i + 1) : st.code; a.id = "hd-" + a.code.replace(/\./g, "-"); }));
window.LESSON = {STAGES, id: "tin7-bai1", title: "Bài 1. Thiết bị vào – ra", TASKS, CONCEPTS, TASK_IDS, L, grade, countSub, summary, esc, NX_MAU, NX_CHUNG, autoComment};
})();
