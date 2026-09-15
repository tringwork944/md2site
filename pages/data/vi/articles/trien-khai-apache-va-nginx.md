# Triển khai md2site trên Apache2 và Nginx
date: 12/09/2026
description: Hướng dẫn triển khai đầy đủ md2site trên hosting Apache2 hoặc máy chủ Nginx.
keywords: md2site, Apache2, Nginx, triển khai website tĩnh, Markdown

Bài này chỉ mô tả cấu hình máy chủ Apache2 hoặc Nginx. Quy trình Git, preview branch và Cloudflare Workers nằm trong bài [Triển khai và vận hành md2site](pages/?page=article&post=bat-dau-voi-md2site.md).

Hãy dùng Apache hoặc Nginx khi bạn đã có shared hosting, VPS riêng hoặc cần tự quản lý máy chủ. Dù chọn phương án nào, nên tiếp tục lưu mã nguồn trên GitHub để theo dõi lịch sử và sao lưu thay đổi.

md2site không có backend và không cần cơ sở dữ liệu, nhưng vẫn cần một máy chủ web phục vụ đầy đủ HTML, CSS, JavaScript, ảnh và Markdown. Chỉ tải `index.html` lên hosting sẽ khiến giao diện mở được nhưng nội dung không thể xuất hiện.

Trước khi triển khai, hãy thay tên miền mẫu trong metadata, `robots.txt` và `sitemap.xml`, rồi kiểm tra website local một lần cuối.

## Những gì cần tải lên máy chủ

Giữ nguyên cấu trúc thư mục của dự án, gồm `assets/`, `pages/`, `index.html`, trang 404 và các file cấu hình liên quan. Trình duyệt sẽ gọi trực tiếp tới các file `.md`, vì vậy chúng phải có quyền đọc công khai.

Các URL của md2site dùng query string như `pages/?page=home`. Apache và Nginx tự giữ phần query string; bạn không cần viết rewrite riêng cho từng trang.

## Triển khai trên Apache2

Tải dự án vào thư mục public của website, thường là `public_html`, `htdocs` hoặc thư mục document root do nhà cung cấp hosting chỉ định.

File `.htaccess` ở gốc dự án hiện cấu hình:

- Dùng `index.html` làm file mặc định.
- Trả nội dung bằng UTF-8.
- Khai báo MIME `text/markdown` cho `.md`.
- Không cache lâu file HTML và Markdown.
- Dùng `404.html` làm trang lỗi và giữ HTTP 404 cho tài nguyên không tồn tại.

Máy chủ phải cho phép đọc `.htaccess`. Nếu dùng VPS, kiểm tra `AllowOverride All` hoặc ít nhất các nhóm chỉ thị cần thiết, cấu hình hiện tại không cần module `rewrite`. Không chuyển request Markdown thiếu sang trang HTML trả HTTP 200 vì sẽ làm hỏng cơ chế fallback.

Nếu cài website trong thư mục con thay vì document root, hãy kiểm tra kỹ quy tắc 404 trong `.htaccess`, vì đường dẫn `/404.html` và các liên kết trong trang lỗi đang được tính từ gốc tên miền.

## Triển khai trên Nginx

Dự án có mẫu `deploy/nginx.conf`. Sao chép mã nguồn vào một thư mục như `/var/www/md2site`, sau đó sửa ít nhất hai dòng:

```nginx
server_name example.com www.example.com;
root /var/www/md2site;
```

Thay `example.com` bằng tên miền và `root` bằng đường dẫn thật. Mẫu hiện khai báo UTF-8, MIME cho Markdown, không cache lâu HTML/Markdown và chuyển lỗi 404 tới trang lỗi của md2site.

Kiểm tra cú pháp trước khi tải lại Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Nếu dùng HTTPS, phần chứng chỉ thường được Certbot hoặc nền tảng hosting thêm vào server block. Hãy kiểm tra lại sau khi công cụ chỉnh cấu hình để tránh tạo hai block cùng `server_name`.

## Kiểm tra sau khi triển khai

Đừng chỉ mở trang chủ. Hãy kiểm tra lần lượt:

- `/` chuyển tới `pages/?page=home`.
- `/pages/?page=articles` hiển thị danh sách bài viết.
- `/pages/?post=bat-dau-voi-md2site.md&page=article` mở được một bài.
- `/pages/data/vi/articles/index.md` trả về nội dung với mã trạng thái `200`.
- Một URL không tồn tại hiển thị trang 404 của md2site.

Nếu khung giao diện có nhưng nội dung trống, mở Network trong DevTools và tìm request `.md` bị lỗi. `404` thường do thiếu file hoặc sai document root; `403` thường do quyền đọc; ký tự tiếng Việt bị lỗi thường liên quan tới UTF-8.

Sau khi mọi URL hoạt động, bật HTTPS và kiểm tra lại canonical, Open Graph, `robots.txt` và `sitemap.xml` trên chính tên miền production.
