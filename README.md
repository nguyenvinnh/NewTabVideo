# NewTabVideo 

**NewTabVideo** là một tiện ích / tùy chỉnh đơn giản giúp nâng cấp trang New Tab (trang thẻ mới) cũ kỹ, nhàm chán trên các trình duyệt nhân Chromium 

---

## 🛠️ Hướng Dẫn Cài Đặt 

Để thay thế trang New Tab mặc định bằng **NewTabVideo**, bạn hãy làm theo các bước đơn giản sau:

### **Bước 1: Tải về và giải nén**
1. Tải toàn bộ mã nguồn của dự án về máy:
   👉 [**Tải NewTabVideo (.zip)**](https://github.com/nguyenvinnh/NewTabVideo/archive/refs/heads/main.zip)
2. Giải nén file `.zip` vừa tải về vào thư mục lưu trữ mà bạn mong muốn (ví dụ: `C:\NewTabVideo` hoặc `D:\Tools\NewTabVideo`).

### **Bước 2: Bật tính năng "Custom New Tab Page" trên trình duyệt**
1. Mở trình duyệt Chromium của bạn và truy cập đường dẫn:
   [**chrome://flags/**](chrome://flags/)
2. Tại ô tìm kiếm, nhập từ khóa: **`Custom New Tab Page`**
3. Chuyển trạng thái của tính năng này từ **Default / Disabled** sang **Enabled** (Bật).

### **Bước 3: Lấy URL file `index.html`**
1. Tìm đến thư mục bạn vừa giải nén ở **Bước 1**.
2. Click chuột phải (hoặc kéo thả) file **`index.html`** vào trình duyệt để mở file.
3. Sao chép toàn bộ địa chỉ URL trên thanh địa chỉ của trình duyệt (ví dụ sẽ có dạng: `file:///C:/NewTabVideo-main/index.html`).

### **Bước 4: Cấu hình trang New Tab**
1. Quay lại trang `chrome://flags/` tại mục **Custom New Tab Page** đã bật ở Bước 2.
2. Dán địa chỉ URL của file `index.html` (đã sao chép ở Bước 3) vào ô nhập liệu của tùy chọn Custom New Tab Page.
3. Relaunch (Khởi động lại) trình duyệt để áp dụng thay đổi.



## 💡 Đóng Góp & Phản Hồi

Nếu bạn gặp lỗi hoặc có ý tưởng muốn đóng góp cho dự án, vui lòng tạo **Issue** hoặc gửi **Pull Request** tại GitHub repo của dự án!
