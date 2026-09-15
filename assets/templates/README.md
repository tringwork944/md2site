# Thư mục templates

Thư mục gồm các nhóm giao diện chính:

- `pages/page-basic-01/index.js`: mẫu page, parser Markdown và registry cấp trang.
- `pages/page-basic-01/style.css`: CSS dành riêng cho `page-basic-01`.
- `body/runtime.js`: registry và body đang được kích hoạt cho trang.
- `body/body-basic-01/`: body mặc định, bao bọc và render các div theo thứ tự Markdown.
- `header/header-basic-01/index.js`: markup header, điều hướng, mobile menu và bộ chọn ngôn ngữ.
- `footer/footer-basic-01/index.js`: markup footer, điều hướng phụ và liên kết chính sách.
- `sections/runtime.js`: registry và helper dùng chung cho các mẫu section.
- `sections/div-basic-01/index.js`: nội dung trái, danh sách đánh số phải.
- `sections/div-basic-02/index.js`: danh sách đánh số trái, nội dung phải.
- `sections/div-basic-03/index.js`: lưới thẻ nội dung.
- `sections/div-basic-04/index.js`: callout gọn có nút hành động.
- `sections/div-basic-05/index.js`: điều hướng và danh sách giai đoạn lộ trình.
- `sections/div-basic-06/index.js`: danh sách bài viết Markdown.
- `sections/div-basic-07/index.js`: thông tin gói tải xuống.
- `sections/div-basic-08/index.js`: danh sách các bước triển khai.
- `sections/div-basic-09/index.js`: thông tin và biểu mẫu liên hệ.
- Mỗi thư mục template có file `example.md` đi kèm. Đây là cú pháp Markdown tối thiểu có thể sao chép vào `pages/content/vi/*.md` hoặc `pages/index.md` để sử dụng template.
- Mỗi thư mục `div-basic-*` chứa `index.js`, `style.css` và `example.md`; CSS của mẫu không nằm trong một file div dùng chung.

`pages/page-basic-01/index.js` phân tích Markdown rồi giao toàn bộ section cho body đã khai báo. Body gọi renderer của từng section qua `window.md2siteDivTemplates`, nên các div luôn phụ thuộc vào body đang hoạt động.

`body-basic-01` áp dụng quy tắc viền theo hướng: divider dọc dùng nét đứt, divider ngang dùng nét liền; các đường viền bao kín panel, form, ảnh và control vẫn dùng nét liền.

Mọi renderer `div-basic-*` bắt buộc trả về đúng một phần tử gốc `<section>` có class `template-div`. Bên trong section, dùng `<div>` cho container/layout, `<article>` cho nội dung độc lập, `<aside>` cho nội dung bổ trợ và `<header>` cho phần giới thiệu có heading. Registry sẽ từ chối template vi phạm quy ước này.

Các mẫu có sẵn:

- `page-meta`
- `hero`
- `div-basic-01`
- `div-basic-02`
- `div-basic-03`
- `div-basic-04`
- `div-basic-05`
- `div-basic-06`
- `div-basic-07`
- `div-basic-08`
- `div-basic-09`
- `div-basic-10` — showcase gallery
- `div-basic-11` — article reader
- `div-basic-12` — legal/policy document
- `div-basic-13` — centered, borderless hero section
- `div-basic-14` — reusable error page state

`pages/page-basic-01/style.css` chứa CSS chỉ dành cho các mẫu được dựng động. Các token, component nền tảng và responsive grid dùng chung vẫn lấy từ `assets/css/main.css`.

Trang sử dụng template cần tải theo thứ tự:

```html
<link rel="stylesheet" href="assets/templates/pages/page-basic-01/style.css">
<link rel="stylesheet" href="assets/templates/body/body-basic-01/style.css">
<link rel="stylesheet" href="assets/templates/sections/div-basic-01/style.css">
<script src="assets/templates/header/header-basic-01/index.js"></script>
<script src="assets/templates/footer/footer-basic-01/index.js"></script>
<script src="assets/js/site-shell.js"></script>
<script src="assets/templates/sections/runtime.js"></script>
<script src="assets/templates/body/runtime.js"></script>
<script src="assets/templates/body/body-basic-01/index.js"></script>
<script src="assets/templates/sections/div-basic-01/index.js"></script>
<script src="assets/templates/sections/div-basic-02/index.js"></script>
<script src="assets/templates/sections/div-basic-03/index.js"></script>
<script src="assets/templates/sections/div-basic-04/index.js"></script>
<script src="assets/templates/sections/div-basic-05/index.js"></script>
<script src="assets/templates/sections/div-basic-06/index.js"></script>
<script src="assets/templates/sections/div-basic-07/index.js"></script>
<script src="assets/templates/sections/div-basic-08/index.js"></script>
<script src="assets/templates/sections/div-basic-09/index.js"></script>
<script src="assets/templates/pages/page-basic-01/index.js"></script>
<script src="assets/js/app.js"></script>
```

Trong Markdown, dùng trực tiếp `## page-meta`, `## hero` hoặc `## div-basic-*` để chọn mẫu. Cú pháp `template: ten-mau` cũ vẫn được hỗ trợ để tương thích.

Khi dùng thêm một mẫu, tải cả `style.css` và `index.js` trong cùng thư mục mẫu. `assets/css/main.css` chỉ cung cấp token và component nền tảng của toàn site.

## Quy ước file Markdown mẫu

- `pages/*/example.md`: ví dụ một trang hoàn chỉnh gồm `page-meta`, `hero` và section.
- `header/*/example.md`, `body/*/example.md`, `footer/*/example.md`: ví dụ khai báo template trong `pages/index.md`.
- `sections/div-basic-*/example.md`: ví dụ khối nội dung có thể chép trực tiếp vào file trong `pages/content/vi/`.
- Khi thêm template mới, luôn tạo `example.md` cùng thư mục và cập nhật danh sách trong README này.
