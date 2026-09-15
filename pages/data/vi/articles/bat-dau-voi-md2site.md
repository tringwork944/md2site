# Triển khai và vận hành md2site
date: 12/09/2026
description: Hướng dẫn từ cấu trúc md2site, chạy thử bằng webserver đến triển khai GitHub, Cloudflare Workers và quản lý các lần cập nhật.
keywords: md2site, triển khai md2site, Cloudflare Workers, GitHub, Markdown, website tĩnh

Bài này là điểm bắt đầu dành cho người mới: hiểu các thành phần cần thiết, chạy thử website trên máy, triển khai bằng GitHub và Cloudflare Workers, sau đó duy trì quy trình cập nhật an toàn.

Nội dung không đi sâu vào cách tạo trang, viết bài, làm template hoặc dịch website. Mỗi công việc đó có một bài chuyên biệt được liên kết ở cuối hướng dẫn.

## md2site hoạt động như thế nào?

md2site là website tĩnh dùng Markdown làm nguồn nội dung. Dự án không cần cơ sở dữ liệu, backend hoặc bước build; trình duyệt tải khung HTML, đọc route trên URL rồi lấy file Markdown và template tương ứng để dựng trang.

Khi người dùng mở `pages/?page=home`, hệ thống thực hiện:

1. Tải khung `pages/index.html`.
2. Đọc route `home` từ query string.
3. Tìm khai báo route trong `pages/index.md`.
4. Chọn file nội dung theo ngôn ngữ đang dùng.
5. Phát hiện các section trong Markdown.
6. Tải template và stylesheet cần thiết.
7. Render nội dung, menu, footer và metadata SEO.

Bài viết dùng route `article` cùng tham số `post`, ví dụ:

```text
pages/?page=article&post=bat-dau-voi-md2site.md
```

## Thành phần cần giữ nguyên

Một gói md2site đầy đủ gồm:

- `index.html`: chuyển người dùng vào trang chính.
- `pages/index.html`: khung HTML dùng chung.
- `pages/index.md`: khai báo route và menu.
- `pages/content/`: nội dung từng trang.
- `pages/data/`: bài viết, roadmap và dữ liệu collection.
- `assets/`: CSS, JavaScript, template và hình ảnh.
- `wrangler.jsonc`: cấu hình Cloudflare Workers.
- `404.html`, `robots.txt` và `sitemap.xml`: xử lý lỗi và SEO kỹ thuật.

Không chỉ sao chép riêng `index.html`. Các đường dẫn trong md2site phụ thuộc vào cấu trúc thư mục, vì vậy toàn bộ gói phải được giải nén và triển khai cùng nhau.

## Bước 1: chạy thử trên máy

Sử dụng một phần mềm webserver cục bộ có khả năng phục vụ website tĩnh. Tải gói md2site, giải nén toàn bộ mã nguồn vào thư mục website mà phần mềm cung cấp rồi khởi động webserver.

Mở địa chỉ `localhost` do phần mềm hiển thị và truy cập thư mục md2site. Không mở trực tiếp file bằng `file://`, vì trình duyệt cần tải nội dung Markdown qua HTTP.

Trước khi triển khai, kiểm tra:

- Trang chủ hiển thị nội dung và menu.
- Trang Bài viết tải được danh sách.
- Một bài viết mở đúng từ danh sách.
- CSS, JavaScript, ảnh và Markdown không trả 404.
- Một đường dẫn không tồn tại hiển thị trang lỗi.

Nếu giao diện có khung nhưng không có nội dung, mở Network trong DevTools và tìm request `.md` bị lỗi.

## Bước 2: kiểm tra cấu hình Cloudflare

Dự án đã có `wrangler.jsonc`:

```json
{
  "name": "md2site",
  "compatibility_date": "2026-08-26",
  "assets": {
    "directory": ".",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

`assets.directory` là `.` vì toàn bộ thư mục dự án là tài nguyên tĩnh cần phát hành. `not_found_handling: 404-page` dùng file `404.html` khi không tìm thấy tài nguyên. `html_handling` giữ cách xử lý URL HTML nhất quán.

Bạn có thể đổi `name` trước lần triển khai đầu tiên. Tên Worker trên Cloudflare Dashboard phải trùng với giá trị này.

## Bước 3: đưa mã nguồn lên GitHub

Tạo một repository trống trên GitHub. Nếu thư mục md2site chưa phải repository Git, chạy:

```bash
git init
git add .
git commit -m "Khoi tao md2site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Thay URL remote bằng repository của bạn. Nếu repository đã có lịch sử, kiểm tra `git status` và `git remote -v` trước khi thay đổi cấu hình.

Không commit token, mật khẩu, file môi trường hoặc dữ liệu chỉ dùng trên máy cá nhân. GitHub nên là nguồn dữ liệu chính để mọi cập nhật có lịch sử và có thể khôi phục.

## Bước 4: kết nối Cloudflare Workers Builds

Trong Cloudflare Dashboard:

1. Mở **Workers & Pages** và chọn **Create application**.
2. Chọn **Get started** tại **Import a repository**.
3. Kết nối tài khoản GitHub và chọn repository md2site.
4. Chọn `main` làm production branch.
5. Để trống **Build command** vì md2site không có bước biên dịch.
6. Giữ **Deploy command** là `npx wrangler deploy`.
7. Đặt **Root directory** là `/` nếu `wrangler.jsonc` nằm ở gốc repository.
8. Lưu cấu hình và chờ deployment đầu tiên hoàn tất.

Với Worker đã tồn tại, mở Worker rồi vào **Settings → Builds → Connect**. Nếu build dừng vì tên không khớp, đối chiếu tên trên Dashboard với trường `name` trong `wrangler.jsonc`.

## Bước 5: thiết lập preview và production

Trong **Settings → Build → Branch control**, bật build cho nhánh không phải production. Quy trình mặc định:

- Nhánh production chạy `npx wrangler deploy` và cập nhật Active Deployment.
- Nhánh khác chạy `npx wrangler versions upload` để tạo preview mà không thay production.

Luồng cập nhật khuyến nghị:

1. Tạo một nhánh cho nhóm thay đổi.
2. Sửa nội dung hoặc giao diện.
3. Kiểm tra bằng webserver trên máy.
4. Push nhánh lên GitHub.
5. Mở URL preview của Cloudflare.
6. Kiểm tra trên màn hình nhỏ và lớn.
7. Merge vào `main` khi đạt yêu cầu.
8. Kiểm tra lại website production.

Không chỉnh file trực tiếp trong deployment vì lần push tiếp theo sẽ thay thế thay đổi đó.

## Quản lý website hằng ngày

Mỗi commit nên chỉ chứa một nhóm công việc rõ ràng. Ví dụ, khi cập nhật bài viết:

```bash
git checkout -b content/cap-nhat-bai-viet
git add pages/data/vi/articles
git commit -m "Cap nhat bai viet"
git push -u origin content/cap-nhat-bai-viet
```

Trước khi merge, kiểm tra tiêu đề, liên kết nội bộ, hình ảnh, chế độ sáng/tối và console trình duyệt. Khi cần quay về phiên bản cũ, ưu tiên tạo commit đảo thay đổi để giữ lịch sử vận hành.

## Gắn tên miền và hoàn thiện SEO

Sau khi bản `workers.dev` hoạt động, thêm custom domain trong phần **Domains & Routes** của Worker. Khi DNS và HTTPS đã sẵn sàng:

1. Thay `https://example.com` trong `sitemap.xml` bằng tên miền thật.
2. Cập nhật dòng `Sitemap:` trong `robots.txt`.
3. Kiểm tra canonical và Open Graph của các route đại diện.
4. Gửi sitemap trên Google Search Console nếu website cần được lập chỉ mục.

## Xử lý lỗi thường gặp

- **Build thất bại ngay khi deploy:** kiểm tra tên Worker, root directory và quyền GitHub integration.
- **Có giao diện nhưng nội dung trống:** xác nhận file Markdown được upload và trả HTTP 200.
- **Bài viết không xuất hiện:** kiểm tra tên file trong `pages/data/vi/articles/index.md`.
- **Preview đúng nhưng production chưa đổi:** xác nhận commit đã nằm trên production branch và deployment mới đã Active.
- **Trang 404 hiển thị sai:** kiểm tra `404.html` và `not_found_handling`.
- **Nội dung cũ còn xuất hiện:** tải lại không dùng cache rồi kiểm tra đúng deployment và domain.

## Checklist trước khi bàn giao

- Toàn bộ cấu trúc md2site được triển khai đầy đủ.
- Trang chủ, menu và footer hoạt động.
- Danh sách và trang đọc bài tải được Markdown.
- URL sai trả trang 404.
- Không có tài nguyên bị lỗi trong Network.
- Preview branch không thay thế production.
- Domain production dùng HTTPS.
- Canonical, `robots.txt` và `sitemap.xml` dùng cùng tên miền.

## Hướng dẫn chuyên biệt tiếp theo

- [Quản lý bố cục giao diện](pages/?page=article&post=huong-dan-su-dung-mau-giao-dien.md): section, template và CSS.
- [Quản lý trang](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md): route, menu và vòng đời trang.
- [Quản lý bài viết](pages/?page=article&post=huong-dan-va-quan-ly-bai-viet.md): đăng, sắp xếp và gỡ bài.
- [Quản lý ngôn ngữ](pages/?page=article&post=tuy-chinh-giao-dien-va-ngon-ngu.md): locale và bản dịch.
- [Quản lý sitemap](pages/?page=article&post=khai-bao-sitemap-xml.md): công bố URL cho công cụ tìm kiếm.
- [Triển khai md2site trên Apache2 và Nginx](pages/?page=article&post=trien-khai-apache-va-nginx.md): phương án máy chủ thay thế Cloudflare.

Tài liệu tham khảo: [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [cấu hình Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) và [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).
