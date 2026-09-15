# Triển khai và quản lý sitemap
date: 12/09/2026
description: Cách xây dựng, cập nhật, kiểm tra và gửi sitemap.xml cho các trang và bài viết của md2site.
keywords: md2site, sitemap.xml, quản lý sitemap, SEO kỹ thuật, Google Search Console

Bài này chỉ tập trung vào việc công bố và quản lý URL cho công cụ tìm kiếm. Cách tạo trang, viết bài hoặc cấu hình máy chủ được giải thích trong các bài chuyên biệt tương ứng.

md2site có sẵn `sitemap.xml` ở thư mục gốc. File này liệt kê URL công khai mà bạn muốn công cụ tìm kiếm khám phá; nó không liệt kê đường dẫn vật lý tới file Markdown.

Phiên bản hiện tại quản lý sitemap thủ công. Cách này phù hợp khi website có ít URL. Khi số trang và bài viết tăng lên vài chục, nên tạo script sinh sitemap từ `pages/index.md` và các file index bài viết để tránh bỏ sót.

## Phân biệt route và file nội dung

Một trang có file nội dung:

```text
pages/content/vi/contact.md
```

nhưng URL cần đưa vào sitemap là:

```text
https://ten-mien-cua-ban.com/pages/?page=contact
```

Tương tự, file bài viết `pages/data/vi/articles/huong-dan-moi.md` có URL công khai:

```text
https://ten-mien-cua-ban.com/pages/?page=article&post=huong-dan-moi.md
```

Chỉ đưa URL canonical có thể mở bằng trình duyệt vào sitemap.

## Bước 1: thay tên miền mẫu

Mở `sitemap.xml` và thay toàn bộ `https://example.com` bằng tên miền production dùng HTTPS. Sau đó sửa `robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://ten-mien-cua-ban.com/sitemap.xml
```

Không đưa `localhost`, domain preview hoặc cả hai phiên bản `www` và không `www` vào cùng sitemap. Chọn đúng URL canonical mà website đang công bố.

## Bước 2: thêm URL của một trang

Các trang được khai báo trong `pages/index.md`. Ví dụ:

```md
## faq
nguon_trang: pages/content/vi/faq.md
trang: faq
nav: false
```

`nav: false` chỉ ẩn trang khỏi menu; trang vẫn có URL và có thể đưa vào sitemap nếu bạn muốn nó xuất hiện trong kết quả tìm kiếm:

```xml
<url>
  <loc>https://ten-mien-cua-ban.com/pages/?page=faq</loc>
  <lastmod>2026-09-12</lastmod>
</url>
```

Không thêm route `article` nếu thiếu tham số `post`, trang 404, URL quản trị, file Markdown hoặc URL đã đặt `noindex`.

## Bước 3: thêm URL của bài viết

Danh sách bài viết hiển thị nằm trong `pages/data/vi/articles/index.md`. Với file `huong-dan-moi.md`, thêm:

```xml
<url>
  <loc>https://ten-mien-cua-ban.com/pages/?page=article&amp;post=huong-dan-moi.md</loc>
  <lastmod>2026-09-12</lastmod>
</url>
```

Trong XML, dấu `&` phải được escape thành `&amp;`. `lastmod` dùng định dạng `YYYY-MM-DD` và phản ánh lần thay đổi đáng kể gần nhất của nội dung, dữ liệu có cấu trúc hoặc liên kết chính trong trang.

Không dùng ngày deploy cho mọi URL nếu nội dung không thay đổi. Thông tin `lastmod` thiếu chính xác làm giảm giá trị của trường này.

## Bước 4: giữ sitemap đồng bộ

Mỗi thay đổi URL nên được xử lý trong cùng commit:

- Thêm trang: cập nhật `pages/index.md`, file nội dung và `sitemap.xml`.
- Thêm bài: cập nhật file bài, `pages/data/vi/articles/index.md` và `sitemap.xml`.
- Đổi tên bài: cập nhật tên file, mọi liên kết `post=`, index và sitemap.
- Xóa nội dung: gỡ URL khỏi sitemap và cập nhật liên kết nội bộ.
- Chuyển URL: cấu hình redirect vĩnh viễn trên hosting rồi thay URL canonical trong sitemap.

Thứ tự `<url>` không ảnh hưởng Google. Bạn có thể nhóm trang trước, bài viết sau để con người dễ bảo trì.

## Bước 5: kiểm tra cú pháp và HTTP

Trước khi phát hành:

1. Mở `sitemap.xml` bằng trình duyệt hoặc XML validator.
2. Xác nhận file dùng UTF-8.
3. Tìm `example.com`, dấu `&` chưa escape và URL trùng lặp.
4. Mở ngẫu nhiên trang chủ, trang danh sách và vài bài viết từ `<loc>`.
5. Xác nhận mỗi URL trả nội dung thật, không phải soft 404.
6. So sánh URL trong sitemap với canonical của trang.

Một sitemap XML đơn lẻ tối đa 50 MB khi chưa nén hoặc 50.000 URL. Nếu vượt giới hạn, chia thành nhiều sitemap và tạo sitemap index.

## Bước 6: phát hành và gửi sitemap

Triển khai `sitemap.xml` cùng phiên bản website, sau đó mở:

```text
https://ten-mien-cua-ban.com/sitemap.xml
```

File phải trả mã `200` và nội dung XML. Tiếp theo, gửi URL sitemap trong báo cáo **Sitemaps** của Google Search Console. Bạn cũng có thể khai báo sitemap trong `robots.txt` để công cụ tìm kiếm phát hiện khi crawl.

Việc gửi sitemap chỉ là tín hiệu hỗ trợ khám phá URL, không bảo đảm mọi trang được lập chỉ mục.

## Quản lý website đa ngôn ngữ

Phiên bản md2site hiện đổi nội dung theo lựa chọn lưu trong trình duyệt nhưng giữ cùng route URL. Sitemap vì vậy chỉ nên liệt kê URL canonical hiện có một lần.

Nếu sau này mỗi ngôn ngữ có URL riêng, ví dụ `/en/...` và `/vi/...`, hãy thêm từng URL canonical và triển khai `hreflang` nhất quán trong HTML hoặc sitemap. Không khai báo các phiên bản ngôn ngữ như URL riêng khi người dùng và crawler chưa thể truy cập chúng bằng URL ổn định.

## Tự động hóa khi website lớn hơn

Khi sitemap khó quản lý thủ công, script sinh file nên:

1. Đọc các route hợp lệ trong `pages/index.md`.
2. Bỏ route 404, route khung bài viết và trang không muốn index.
3. Đọc danh sách file từ `pages/data/vi/articles/index.md`.
4. Tạo URL tuyệt đối theo một biến tên miền production.
5. Escape XML và chuẩn hóa `lastmod`.
6. Phát hiện URL trùng hoặc file được khai báo nhưng không tồn tại.
7. Ghi `sitemap.xml` trước bước deploy và làm build thất bại nếu kiểm tra không đạt.

Đừng lấy mọi file `.md` làm URL; nhiều file chỉ là dữ liệu nội bộ và không có route đọc công khai.

## Xử lý lỗi thường gặp

- **Sitemap trả 404:** kiểm tra file nằm ở gốc thư mục được deploy.
- **XML không hợp lệ:** tìm dấu `&` chưa đổi thành `&amp;` hoặc thẻ đóng bị thiếu.
- **Search Console báo URL không truy cập được:** mở URL thật và kiểm tra HTTP, redirect cùng tài nguyên Markdown.
- **URL trong sitemap khác canonical:** chọn một dạng duy nhất rồi cập nhật sitemap, canonical và liên kết nội bộ.
- **Bài mới không xuất hiện:** sitemap không tự cập nhật; phải thêm URL hoặc chạy lại generator.
- **URL đã xóa vẫn bị crawl:** gỡ khỏi sitemap, sửa liên kết nội bộ và trả 404/410 hoặc redirect phù hợp.

## Checklist nghiệm thu sitemap

- Không còn `example.com` trên production.
- Tất cả `<loc>` là URL tuyệt đối dùng HTTPS.
- Query string dùng entity XML hợp lệ.
- Không có URL trùng, 404, `noindex` hoặc route nội bộ.
- `lastmod` đúng định dạng và chỉ đổi khi nội dung thay đổi đáng kể.
- `robots.txt` trỏ tới đúng sitemap.
- Sitemap trả HTTP 200 sau deployment.
- Google Search Console không báo lỗi xử lý file.

Tài liệu tham khảo: [Google Search Central — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) và [Sitemaps XML protocol](https://www.sitemaps.org/protocol.html).
