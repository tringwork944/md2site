# Triển khai và quản lý trang
date: 12/09/2026
description: Tạo route, nối file nội dung, quản lý menu và xử lý vòng đời thêm, đổi tên hoặc gỡ một trang trong md2site.
keywords: md2site, quản lý trang, route Markdown, pages index, menu md2site

Bài này chỉ tập trung vào vòng đời của một trang: tạo file nội dung, khai báo route, quản lý menu, đổi URL và gỡ trang. Cách thiết kế từng section nằm trong bài [Quản lý bố cục giao diện](pages/?page=article&post=huong-dan-su-dung-mau-giao-dien.md); quy trình đăng nội dung theo danh sách nằm trong bài [Quản lý bài viết](pages/?page=article&post=huong-dan-va-quan-ly-bai-viet.md).

Một trang md2site cần hai thành phần:

- File Markdown trong `pages/content/<ngon-ngu>/`.
- Một khối route trong `pages/index.md`.

Thiếu file nội dung, route không có gì để tải. Thiếu route, file Markdown tồn tại nhưng không có URL trang công khai.

## Bước 1: chọn slug và tên file

Slug là giá trị xuất hiện trong tham số `page=`. Nên dùng chữ thường không dấu và dấu gạch ngang:

```text
gioi-thieu
dich-vu
cau-hoi-thuong-gap
```

Giữ slug và tên file giống nhau để dễ quản lý. Ví dụ, route `gioi-thieu` dùng file:

```text
pages/content/vi/gioi-thieu.md
```

Không dùng khoảng trắng, ký tự tiếng Việt có dấu hoặc ký tự đặc biệt trong tên file và slug.

## Bước 2: tạo file nội dung tối thiểu

Tạo `pages/content/vi/gioi-thieu.md`:

```md
# Trang giới thiệu

## page-meta
meta_title: Giới thiệu — md2site
meta_description: Thông tin giới thiệu về website.

## hero
variant: centered-borderless
eyebrow: Giới thiệu
title: Câu chuyện của chúng tôi
description: Nội dung trang được quản lý trực tiếp bằng Markdown.
```

`page-meta` cung cấp tiêu đề và mô tả cho trình duyệt, công cụ tìm kiếm và thẻ chia sẻ. `hero` là section hiển thị đầu trang.

Đây chỉ là cấu trúc tối thiểu để kiểm tra route. Khi cần ghép nhiều section hoặc tạo template mới, thực hiện theo bài bố cục giao diện thay vì mở rộng logic route.

## Bước 3: khai báo route trong pages/index.md

Thêm một khối độc lập:

```md
## gioi-thieu
nguon_trang: pages/content/vi/gioi-thieu.md
trang: gioi-thieu
tieu_de_trang: Giới thiệu — md2site
tai_nguyen_phu_thuoc: assets/css/main.css, assets/css/site-shell.css
header: header-basic-01
body: body-basic-01
footer: footer-basic-01
title: Giới thiệu
order: 25
```

Các trường có vai trò:

- `nguon_trang`: file nội dung mặc định của route.
- `trang`: slug trên URL.
- `tieu_de_trang`: tiêu đề tạm thời trước khi metadata trong nội dung được áp dụng.
- `tai_nguyen_phu_thuoc`: CSS hoặc JavaScript dùng chung của trang.
- `header`, `body`, `footer`: bộ khung hiển thị.
- `title`: nhãn menu viết trực tiếp.
- `label`: khóa nhãn menu lấy từ file ngôn ngữ, dùng thay cho `title`.
- `order`: vị trí trên menu; số nhỏ hơn đứng trước.
- `nav: false`: cho phép mở route nhưng không đưa lên menu.
- `active`: chỉ định mục menu được đánh dấu cho một route con.

Mở URL để kiểm tra:

```text
pages/?page=gioi-thieu
```

## Quản lý menu

Menu được tạo từ các route trong `pages/index.md`, không được viết riêng trong từng trang.

### Sắp xếp menu

Dùng `order` theo khoảng cách 10 đơn vị để dễ chèn thêm mục:

```md
order: 10
order: 20
order: 30
```

Nếu cần đặt trang mới giữa hai mục đầu, dùng `order: 15` mà không phải đổi toàn bộ danh sách.

### Dùng nhãn đa ngôn ngữ

Thay `title` bằng khóa `label`:

```md
label: nav_about
```

Sau đó khai báo `## nav_about` trong các file `assets/content/<ngon-ngu>/common.md`. Bài này chỉ mô tả điểm kết nối của route; quy trình tạo và kiểm tra bản dịch nằm trong bài [Quản lý ngôn ngữ](pages/?page=article&post=tuy-chinh-giao-dien-va-ngon-ngu.md).

### Tạo trang không nằm trên menu

Các trang cảm ơn, chính sách hoặc landing page có thể dùng:

```md
nav: false
```

Route vẫn mở được qua URL và có thể được liên kết từ nội dung khác.

### Giữ trạng thái menu cho trang con

Ví dụ route `chi-tiet-dich-vu` thuộc nhóm `dich-vu`:

```md
active: dich-vu
nav: false
```

Khi người dùng mở trang chi tiết, mục Dịch vụ trên menu vẫn được đánh dấu.

## Cập nhật nội dung mà không đổi URL

Nếu chỉ sửa tiêu đề, mô tả hoặc section, chỉnh file trong `pages/content/` và giữ nguyên route. URL cùng các liên kết hiện có sẽ không thay đổi.

Sau khi cập nhật:

1. Tải lại đúng route.
2. Kiểm tra title và description trong `<head>`.
3. Kiểm tra liên kết và hình ảnh.
4. Thử màn hình nhỏ và chế độ tối.
5. Cập nhật `lastmod` trong sitemap nếu nội dung thay đổi đáng kể.

## Đổi tên file nhưng giữ URL

Bạn có thể đổi:

```text
pages/content/vi/gioi-thieu.md
pages/content/vi/ve-chung-toi.md
```

rồi chỉ sửa `nguon_trang`:

```md
## gioi-thieu
nguon_trang: pages/content/vi/ve-chung-toi.md
trang: gioi-thieu
```

URL vẫn là `pages/?page=gioi-thieu`. Đây là lựa chọn an toàn khi chỉ tổ chức lại file nội bộ.

## Đổi URL của trang

Để đổi từ `gioi-thieu` sang `ve-chung-toi`:

1. Đổi trường `trang` và nên đổi heading route tương ứng.
2. Tìm mọi liên kết có `page=gioi-thieu`.
3. Cập nhật menu, CTA, bài viết và sitemap.
4. Cấu hình redirect từ URL cũ nếu website đã được xuất bản.
5. Kiểm tra URL cũ và mới trên môi trường preview.

Tìm tham chiếu trước khi đổi:

```bash
rg "page=gioi-thieu|gioi-thieu.md" .
```

Không chỉ sửa tên file vì URL được quyết định bởi `trang`, không phải tên file nội dung.

## Gỡ một trang

Quy trình an toàn:

1. Tìm route và URL đang trỏ tới trang.
2. Cập nhật hoặc gỡ các liên kết đó.
3. Xóa khối route khỏi `pages/index.md`.
4. Gỡ URL khỏi `sitemap.xml`.
5. Xóa file nội dung khi chắc chắn không còn sử dụng.
6. Kiểm tra URL cũ trả 404 hoặc redirect như dự kiến.

Nếu chỉ muốn tạm ẩn khỏi menu, dùng `nav: false`; không cần xóa route hoặc file.

## Xử lý lỗi thường gặp

- **Trang chuyển sang 404:** kiểm tra slug trong URL và trường `trang`.
- **Hiện thông báo không thể tải trang:** kiểm tra `nguon_trang`, `body`, `header` và `footer`.
- **Trang mở nhưng không có nội dung:** kiểm tra file Markdown và tên section.
- **Không xuất hiện trên menu:** kiểm tra `nav`, `order`, `title` hoặc khóa `label`.
- **Menu đánh dấu sai:** kiểm tra trường `active`.
- **Chỉ một ngôn ngữ bị lỗi:** kiểm tra file cùng tên trong `pages/content/<locale>/`.

## Checklist nghiệm thu trang

- Slug hợp lệ và không trùng route khác.
- File `nguon_trang` tồn tại.
- URL mở đúng nội dung.
- Metadata title và description đúng.
- Menu hiển thị, sắp xếp và đánh dấu đúng ý định.
- Không có liên kết hoặc tài nguyên bị 404.
- Phiên bản ngôn ngữ cần thiết đã tồn tại.
- Sitemap đã đồng bộ nếu route được lập chỉ mục.
- URL cũ được xử lý khi đổi hoặc gỡ trang.

Sau khi route hoạt động, chuyển sang bài [Quản lý bố cục giao diện](pages/?page=article&post=huong-dan-su-dung-mau-giao-dien.md) nếu cần phát triển cấu trúc trình bày bên trong trang.
