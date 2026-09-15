# Triển khai và quản lý bố cục giao diện md2site
date: 12/09/2026
description: Cách chọn, ghép, tùy chỉnh và bảo trì hệ thống bố cục md2site từ page, header, body, footer đến các section Markdown.
keywords: md2site, bố cục giao diện, template md2site, section Markdown, responsive

Bố cục md2site được chia thành nhiều lớp để nội dung Markdown không phải chứa HTML. Một trang hoàn chỉnh dùng bộ khung `header`, `body`, `footer` trong `pages/index.md`, sau đó render các section được khai báo trong file nội dung.

Bài này chỉ tập trung vào cách trình bày nội dung: chọn section, ghép bố cục, phát triển template và quản lý CSS. Việc tạo URL, khai báo menu hoặc đổi tên route nằm trong bài [Quản lý trang](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md).

## Bản đồ hệ thống giao diện

Các thư mục chính trong `assets/templates/`:

- `pages/page-basic-01/`: phân tích file Markdown của trang và điều phối render.
- `header/header-basic-01/`: thương hiệu, menu desktop, menu mobile và bộ chọn ngôn ngữ.
- `body/body-basic-01/`: bao bọc và sắp xếp các section theo thứ tự Markdown.
- `footer/footer-basic-01/`: chân trang và điều hướng phụ.
- `sections/div-basic-*/`: các khối nội dung có thể tái sử dụng.
- `sections/runtime.js` và `body/runtime.js`: registry cùng các helper dùng chung.

Mỗi template thường có:

- `index.js`: chuyển dữ liệu Markdown thành HTML.
- `style.css`: bố cục và trạng thái riêng của template.
- `example.md`: cú pháp Markdown tối thiểu có thể sao chép.

## Chọn đúng mức tùy chỉnh

- Chỉ đổi chữ, liên kết hoặc danh sách: sửa file trong `pages/content/`.
- Đổi thứ tự khối: di chuyển nguyên section `##` trong file Markdown.
- Đổi màu, font hoặc khoảng cách dùng chung: sửa token trong `assets/css/main.css`.
- Đổi nền và shell toàn site: sửa `assets/css/site-shell.css`.
- Đổi cấu trúc HTML của một khối: sửa hoặc tạo template trong `assets/templates/sections/`.
- Đổi menu hoặc footer: sửa template header/footer và các khóa trong `assets/content/<ngon-ngu>/common.md`.

Không sao chép HTML của template vào nhiều trang. Giữ dữ liệu trong Markdown để một thay đổi renderer có thể áp dụng nhất quán.

## Ghép bố cục từ Markdown

Ví dụ tạo một hero, lưới nội dung và callout:

```md
## page-meta
meta_title: Dịch vụ — md2site
meta_description: Các dịch vụ nổi bật của website.

## hero
variant: centered-borderless
eyebrow: Dịch vụ
title: Giải pháp rõ ràng cho từng nhu cầu
description: Chọn nội dung phù hợp và bắt đầu nhanh chóng.

## div-basic-03
id: danh-sach-dich-vu
eyebrow: Danh mục
title: Dịch vụ nổi bật

### Thiết kế website
icon: document
Xây dựng giao diện responsive từ hệ thống template md2site.

### Quản lý nội dung
icon: book
Cập nhật trang và bài viết trực tiếp bằng Markdown.

## div-basic-04
eyebrow: Bước tiếp theo
title: Trao đổi về dự án của bạn
description: Gửi thông tin để nhận tư vấn phù hợp.
button_label: Liên hệ
button_href: pages/?page=contact
```

Thứ tự các khối `##` là thứ tự hiển thị. Heading `###` bên trong section thường tạo item con; các trường `ten_truong: gia_tri` cung cấp metadata cho renderer.

## Các section hiện có và mục đích sử dụng

- `hero` hoặc `div-basic-13`: phần giới thiệu đầu trang.
- `div-basic-01`: nội dung bên trái, danh sách đánh số bên phải.
- `div-basic-02`: danh sách bên trái, nội dung bên phải.
- `div-basic-03`: lưới thẻ nội dung.
- `div-basic-04`: callout có nút hành động.
- `div-basic-05`: lộ trình theo giai đoạn.
- `div-basic-06`: danh sách bài viết.
- `div-basic-07`: panel tải file.
- `div-basic-08`: danh sách các bước triển khai.
- `div-basic-09`: thông tin liên hệ và biểu mẫu.
- `div-basic-10`: gallery ảnh.
- `div-basic-11`: trình đọc bài viết.
- `div-basic-12`: tài liệu pháp lý hoặc chính sách.
- `div-basic-14`: trạng thái lỗi.

Xem trang [Showcase](pages/?page=showcase) và file `example.md` của section trước khi tự tạo mẫu mới.

## Cách bố cục được nạp

Sau khi route xác định file nội dung, `page-router.js` phát hiện các section `div-basic-*` và tải `style.css` cùng `index.js` tương ứng. Người biên tập chỉ cần khai báo section trong Markdown; không thêm thủ công từng template vào `pages/index.html`.

Phần `header`, `body` và `footer` được chọn ở cấp route. Bài [Quản lý trang](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md) giải thích nơi khai báo các trường này; bài hiện tại tiếp tục với cách phát triển và bảo trì template.

## Tạo một section template mới

Chỉ tạo template mới khi các mẫu hiện có không biểu diễn đúng nội dung. Quy trình đề xuất:

1. Sao chép section gần giống nhất, ví dụ `div-basic-03`.
2. Đặt tên tiếp theo không trùng, ví dụ `div-basic-15`.
3. Cập nhật `index.js`, `style.css` và `example.md` trong cùng thư mục.
4. Giữ đúng một phần tử gốc `<section class="template-div">`.
5. Dùng HTML semantic và escape mọi dữ liệu được đưa vào markup.
6. Thêm template vào danh sách trong `assets/templates/README.md`.
7. Thử template trên Showcase trước khi dùng ở trang production.

Renderer cần xử lý cả dữ liệu thiếu, danh sách rỗng, URL không hợp lệ và nội dung dài. Không giả định file Markdown luôn hoàn hảo.

## Quản lý CSS an toàn

Ưu tiên token dùng chung như màu nền, màu chữ, border và spacing trong `assets/css/main.css`. CSS của section chỉ nên giới hạn trong class của template để tránh ảnh hưởng component khác.

Với responsive:

- Thiết kế một cột trước cho màn hình nhỏ.
- Chỉ chuyển thành nhiều cột khi đủ chiều rộng.
- Cho phép chữ và liên kết dài xuống dòng.
- Cho khối mã cuộn ngang thay vì làm tràn toàn trang.
- Duy trì focus nhìn thấy được trên nút và liên kết.
- Tôn trọng `prefers-reduced-motion` nếu thêm chuyển động.

## Quản lý thay đổi template

Khi sửa một template đang dùng chung, tìm tất cả nơi gọi nó trước:

```bash
rg "## div-basic-03" pages/content
```

Sau đó kiểm tra ít nhất một trang cho mỗi kiểu dữ liệu khác nhau. Nếu thêm trường mới, cung cấp giá trị mặc định để file Markdown cũ vẫn hiển thị được. Nếu bỏ trường, cập nhật đồng thời renderer, `example.md`, Showcase và bài hướng dẫn liên quan.

## Xử lý lỗi thường gặp

- **Section không xuất hiện:** kiểm tra heading có đúng `## div-basic-N` và thư mục template có đủ `index.js` hay không.
- **Có nội dung nhưng không có style:** kiểm tra `style.css`, tên thư mục và lỗi tải tài nguyên trong Network.
- **Sai thứ tự:** di chuyển toàn bộ section trong Markdown, không dùng CSS `order` để sửa dữ liệu.
- **Chỉ lỗi trên điện thoại:** kiểm tra chiều rộng cố định, grid và chuỗi không thể xuống dòng.
- **Chế độ tối khó đọc:** thay màu cứng bằng token và kiểm tra độ tương phản.
- **Template mới làm lỗi cả trang:** xem console để tìm lỗi JavaScript hoặc phần tử gốc không đúng quy ước registry.

## Checklist nghiệm thu bố cục

- Đúng thứ tự section và chỉ có một `h1` chính.
- Không tràn ngang ở màn hình nhỏ.
- Menu, nút và liên kết dùng được bằng bàn phím.
- Focus hiển thị rõ.
- Nội dung vẫn hiểu được khi thiếu ảnh.
- Chế độ sáng và tối đều có độ tương phản tốt.
- `index.js`, `style.css` và `example.md` đồng bộ.
- Console và Network không có lỗi.

Đọc tiếp [Triển khai và quản lý trang](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md) để áp dụng bố cục vào một route hoàn chỉnh.
