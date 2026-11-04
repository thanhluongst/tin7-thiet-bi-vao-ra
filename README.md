# Tin học 7 – Bài 1. Thiết bị vào – ra

Trang học tương tác theo **nghiên cứu bài học**. Học sinh trả lời từng câu hỏi trong SGK (Kết nối tri thức với cuộc sống). Giáo viên theo dõi câu trả lời của các nhóm theo thời gian thực rồi chốt kiến thức cho cả lớp.

- **Trang học sinh:** `index.html`. Học sinh không cần tài khoản.
- **Trang giáo viên:** `giaovien.html`. Cần mã giáo viên, chỉ dùng khi đã nối Google Sheets.
- **Nơi lưu bài:**
  - mặc định: trình duyệt của máy đang dùng (Cách 1);
  - hoặc Google Sheet của giáo viên qua Google Apps Script, miễn phí (Cách 2).

**Trang trực tuyến:** https://thanhluongst.github.io/tin7-thiet-bi-vao-ra/

```
Học sinh (index.html) ──gửi bài──▶ Apps Script ──▶ Google Sheet "BaiLam"
Giáo viên (giaovien.html) ◀──xem bài── Apps Script
Giáo viên ──chốt──▶ Apps Script ──▶ trang học sinh tự hiện phần chốt (10–15 giây)
```

## Cấu trúc thư mục

| Tệp | Nội dung |
| --- | --- |
| `index.html` | Trang học sinh |
| `giaovien.html` | Trang giáo viên: mã QR, theo dõi lớp, chốt kiến thức, tải CSV |
| `config.js` | **Chỉ sửa tệp này:** dán link Apps Script |
| `assets/content.js` | Câu hỏi SGK, đáp án chốt, cách chấm |
| `assets/hs.js`, `assets/gv.js`, `assets/api.js`, `assets/style.css` | Mã giao diện |
| `hinh/` | Hình 1.1–1.5 cắt từ SGK |
| `apps-script/Code.gs` | Mã dán vào Google Apps Script |

## Cách 1. Dùng ngay, không cần Google Sheets (đang dùng)

Khi `API_URL` trong `config.js` để trống, trang chạy **chế độ một máy nhiều nhóm**. Không cần mạng sau khi trang đã tải, cũng không cần tài khoản.

1. Mở trang học trên **máy trình chiếu**, nhập mã giáo viên `tin7` và bấm **Vào chế độ GV**.
2. Khi một nhóm báo cáo, bấm tên nhóm ở đầu trang (Nhóm 1, Nhóm 2, …), ghi câu trả lời của nhóm rồi bấm **Nộp**. Bấm **+ Thêm nhóm** nếu lớp có hơn 8 nhóm (tối đa 20).
3. Mục **Theo dõi lớp** so sánh câu trả lời của các nhóm theo từng câu. Mỗi nhóm có ô nhận xét riêng của giáo viên.
4. Bấm **GV nhận xét & chốt** ở từng câu, hoặc **Chốt tất cả**.
5. Sang lớp khác: **Làm lại từ đầu → Xoá bài của tất cả nhóm**.

**Lưu ý:**
- Bài làm chỉ lưu trong trình duyệt của máy đó. Hãy dùng cùng một máy và cùng một trình duyệt suốt buổi.
- Không mở bằng cửa sổ ẩn danh.
- Không xoá dữ liệu trình duyệt trước khi xong buổi suy ngẫm.

Học sinh vẫn có thể mở trang trên máy riêng để làm bài, nhưng bài chỉ lưu trên máy của các em. Phần chốt chỉ hiện khi giáo viên nhập mã trên chính máy đó.

## Cách 2. Học sinh gửi bài về cho giáo viên (cần Google Sheets)

Làm theo Bước 1 bên dưới. Khi `config.js` đã có `API_URL`, trang học sinh hiện thêm ô **Mã buổi học**, và trang giáo viên dùng để mở buổi học, chiếu mã QR, theo dõi và chốt cho cả lớp.

## Bước 1. Tạo Google Sheet và Apps Script (khoảng 10 phút)

1. Vào [sheets.new](https://sheets.new) để tạo bảng tính mới, đặt tên, ví dụ "Tin 7 – Bài làm".
2. Chọn **Tiện ích mở rộng → Apps Script**.
3. Xoá mã có sẵn, dán toàn bộ nội dung `apps-script/Code.gs`, bấm **Lưu**.
4. Bấm biểu tượng **bánh răng (Cài đặt dự án)** → kéo xuống **Thuộc tính tập lệnh** → **Thêm thuộc tính tập lệnh**:
   - Thuộc tính: `MA_GIAO_VIEN`
   - Giá trị: mã bí mật của thầy/cô, ví dụ `Tin7@2026`. **Không** dùng mật khẩu Gmail.
5. Quay lại trình soạn thảo, chọn hàm `khoiTao`, bấm **Chạy**. Lần đầu Google sẽ hỏi quyền truy cập bảng tính: chọn tài khoản của thầy/cô → **Nâng cao** → **Đi tới dự án** → **Cho phép**. Bảng tính sẽ có hai trang `BaiLam` và `Chot`.
6. Bấm **Triển khai → Tùy chọn triển khai mới**:
   - Bánh răng cạnh "Chọn loại" → **Ứng dụng web**
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
   - Bấm **Triển khai**, sao chép **URL ứng dụng web** (kết thúc bằng `/exec`).
7. Mở `config.js` và dán URL vào:
   ```js
   window.APP_CONFIG = {
     API_URL: "https://script.google.com/macros/s/AKfy.../exec"
   };
   ```

> Khi sửa `Code.gs` sau này, phải vào **Triển khai → Quản lý các lần triển khai → Chỉnh sửa → Phiên bản: Phiên bản mới** thì thay đổi mới có hiệu lực. URL giữ nguyên.

## Bước 2. Đưa lên GitHub Pages

1. Tạo kho (repository) mới trên GitHub, ví dụ `tin7-thiet-bi-vao-ra`, để chế độ **Public** (GitHub Pages miễn phí cần kho công khai).
2. Đẩy mã lên. Nếu máy đã cài Git:
   ```bash
   git add .
   git commit -m "Trang học Tin 7 – Bài 1"
   git branch -M main
   git remote add origin https://github.com/<tên-tài-khoản>/tin7-thiet-bi-vao-ra.git
   git push -u origin main
   ```
   Hoặc trên trang GitHub, chọn **Add file → Upload files** và kéo cả thư mục vào.
3. Vào **Settings → Pages**. Ở mục Source chọn **Deploy from a branch**, chọn nhánh **main**, thư mục **/(root)**, rồi bấm **Save**.
4. Sau 1–2 phút trang có địa chỉ dạng:
   - Học sinh: `https://<tên-tài-khoản>.github.io/tin7-thiet-bi-vao-ra/`
   - Giáo viên: `https://<tên-tài-khoản>.github.io/tin7-thiet-bi-vao-ra/giaovien.html`

## Quy trình trên lớp

1. **Giáo viên** mở `giaovien.html`, nhập mã giáo viên và tạo **mã buổi học** riêng cho từng lớp, từng tiết (ví dụ `7A2-T1`), rồi bấm **Mở buổi học**.
2. Chiếu **mã QR** lên màn hình. **Học sinh** quét mã: trang tự điền sẵn mã buổi học. Các em nhập **tên nhóm** và bấm **Vào buổi học**.
3. Học sinh làm bài, bấm **Nộp câu trả lời**. Bài tự gửi lên Google Sheet. Khi mất mạng, bài vẫn lưu trên máy và tự gửi lại.
4. Giáo viên xem mục **Theo dõi lớp**:
   - tiến độ từng nhóm;
   - câu trả lời của cả lớp cho từng câu, kèm nhãn Đúng/Chưa đúng;
   - đáp án chốt để đối chiếu.
5. Sau khi các nhóm trình bày, giáo viên bấm **Chốt** ở từng câu. Trang học sinh tự hiện phần chốt sau 10–15 giây.
6. **Suy ngẫm sau giờ dạy:**
   - mở Google Sheet: mỗi nhóm một dòng, mỗi câu một cột (bài nháp ghi "(nháp)", câu trắc nghiệm có ✓/✗);
   - hoặc bấm **Tải bảng tổng hợp (CSV)** trên trang giáo viên.

**Phòng học không có mạng:** học sinh không bấm "Vào buổi học". Trang chạy chế độ **một máy nhiều nhóm**. Giáo viên nhập mã `tin7` trên máy trình chiếu, chọn từng nhóm để ghi câu trả lời khi nhóm báo cáo, rồi chốt ngay trên máy đó.

## Quản lý học sinh và giáo viên

- **Học sinh** không có tài khoản. Các em được nhận diện bằng *mã buổi học + tên nhóm + mã máy* (tự sinh, lưu trong trình duyệt). Chỉ nên nhập tên nhóm hoặc tên ngắn, không nhập thông tin cá nhân.
- **Giáo viên** dùng chung một mã giáo viên lưu trong Thuộc tính tập lệnh. Muốn thêm giáo viên dự giờ thì đưa họ mã, hoặc chia sẻ Google Sheet ở quyền xem. Đổi mã chỉ cần sửa thuộc tính `MA_GIAO_VIEN`, không phải sửa GitHub.
- **Xoá dữ liệu cũ:** xoá các dòng trong trang `BaiLam` của Google Sheet.
- **Lưu ý:**
  - Link GitHub Pages công khai, ai có link và mã buổi học đều gửi bài được. Mỗi tiết hãy dùng một mã buổi học mới.
  - Mã `tin7` của chế độ một máy nằm trong mã nguồn công khai, chỉ để học sinh không bấm nhầm.

## Thêm bài học khác

Sao chép thư mục, sửa `assets/content.js` (câu hỏi, đáp án, `id` của bài) và phần nội dung trong `index.html`. Có thể dùng chung Google Sheet và Apps Script: bài làm được tách theo cột **Bài**.
