# md2site static website

Website tĩnh dùng HTML, CSS, JavaScript thuần và nội dung Markdown.

## Cấu trúc thư mục

```text
website-01/
├── index.html
├── pages/
│   ├── index.md                 # Khai báo trung tâm, trỏ tới source Markdown
│   ├── index.html               # Renderer chung cho trang Markdown
│   ├── content/
│   │   ├── vi/                  # Nội dung trang tiếng Việt
│   │   └── en/                  # Nội dung trang tiếng Anh
│   └── data/
│       ├── vi/                  # Bài viết, roadmap và showcase tiếng Việt
│       └── downloads/           # Tệp nhị phân dùng chung cho mọi ngôn ngữ
├── assets/
│   ├── css/{main.css,site-shell.css}
│   ├── js/{app.js,site-shell.js,theme-init.js}
│   ├── images/
│   │   ├── background/          # Ảnh nền dùng chung
│   │   ├── beestudiosns/        # Logo và favicon sáng/tối
│   │   └── icons/               # Icon SVG dùng trong Markdown
│   ├── content/
│   │   ├── vi/{common.md,seo.md}
│   │   ├── en/{common.md,seo.md}
│   │   └── languages/index.md   # Danh sách locale và file từ điển
│   └── templates/
│       ├── pages/page-basic-01/{index.js,style.css}
│       ├── body/{runtime.js,body-basic-01/}
│       ├── sections/{runtime.js,div-basic-*}
│       ├── header/header-basic-01/index.js
│       ├── footer/footer-basic-01/index.js
│       └── README.md
├── build-release.mjs            # Đóng gói ZIP bằng Node.js
└── README.md
```

## Cập nhật nội dung

- Chỉnh cấu trúc dùng chung của header và footer trong `assets/js/site-shell.js`.
- Chỉnh màu nền, hình nền và chuyển động hình nền trong `assets/css/site-shell.css`.
- `assets/js/theme-init.js` khởi tạo sớm chế độ `Tự động`, `Sáng` hoặc `Tối` để tránh nháy màu khi chuyển trang.
- Chỉnh tên thương hiệu, điều hướng và footer trong `assets/content/vi/common.md`.
- `pages/index.md` là tệp khai báo có thẩm quyền: mỗi mục `## <slug>` trỏ tới một tệp nội dung bằng `source:` và quản lý URL, menu, thứ tự cùng loại shell.
- Mỗi trang nội dung có một tệp tương ứng trong `pages/content/vi/` hoặc `pages/content/en/`. Heading `## page-meta`, `## hero` hoặc `## div-basic-*` trực tiếp chọn mẫu giao diện.
- Trang Markdown thông thường dùng renderer chung `pages/index.html?page=<slug>`. Không tạo HTML, không chạy build và không dùng công cụ đồng bộ.
- Thư mục gốc chỉ giữ `index.html` làm điểm vào và chuyển tới `pages/?page=home`; mọi trang dùng chung renderer `pages/index.html`.
- Trang chủ được dựng trực tiếp từ `pages/content/vi/home.md`.
- `assets/templates/pages/page-basic-01/`, `assets/templates/body/body-basic-01/`, header, footer và sections là bộ mẫu mặc định. `body` quyết định cách bao bọc và sắp xếp toàn bộ div của trang.
- Mỗi `assets/templates/sections/div-basic-*` tự chứa `index.js` và `style.css`. Trang chỉ tải stylesheet của những mẫu thực sự sử dụng; `assets/css/main.css` giữ token và component nền tảng chung.
- `assets/js/site-shell.js` chỉ điều phối hành vi dùng chung rồi gọi `md2siteHeaderTemplate.render()` và `md2siteFooterTemplate.render()`.
- `assets/js/app.js` chỉ tải Markdown rồi gọi module trong thư mục `assets/templates/`, không chứa giao diện cụ thể của từng mẫu.
- Mỗi mục `##` trong `pages/content/vi/home.md` là một khu vực và hiển thị theo thứ tự từ trên xuống dưới.
- Các mẫu cấp trang gồm `page-meta`, `hero`; các mẫu nội dung gồm `div-basic-01` đến `div-basic-14`. Nội dung lặp lại được khai báo bằng các mục con `###`.
- `div-basic-01` đặt nội dung bên trái, `div-basic-02` đảo nội dung sang phải; thuộc tính `id:` tạo anchor để liên kết trực tiếp đến khu vực.
- Chỉnh nội dung từng trang trong tệp `source:` được khai báo tại `pages/index.md`.
- Giá trị `download_url` trong `pages/content/vi/download.md` chấp nhận đường dẫn nội bộ như `pages/data/downloads/md2site.zip` hoặc URL tải bên ngoài.
- Trong `pages/content/vi/contact.md`, đặt `form_mode` thành `default`, `hidden` hoặc `embed`. Với `embed`, khai báo thêm `form_embed_url`, `form_embed_title` và `form_embed_height` để nhúng form ngoài.
- Chỉnh SEO riêng cho từng trang trong `assets/content/vi/seo.md`. md2site tự tạo canonical, robots, Open Graph, Twitter Card và JSON-LD theo route hiện tại; `og_image` là ảnh chia sẻ mặc định.
- Bài viết có thể khai báo `description`, `keywords` và `image` ngay dưới tiêu đề `#`; nếu thiếu mô tả, md2site tự tạo đoạn trích từ nội dung.
- `sitemap.xml` là tệp mẫu tại thư mục gốc. Khi thêm trang hoặc bài viết Markdown, cập nhật URL tương ứng và thay `https://example.com` bằng tên miền chính thức. Xem bài **Khai báo sitemap.xml cho md2site**.
- `assets/content/languages/index.md` quyết định locale xuất hiện trong bộ chọn và locale mặc định. Nội dung dùng chung cùng SEO được tách tương ứng trong `assets/content/vi/` và `assets/content/en/`.
- Chỉnh nhãn quay lại danh sách trên trang đọc bài trong `pages/content/vi/article.md`.
- Mỗi trường tùy chỉnh dùng cú pháp `## ten_khoa`, nội dung nằm ở các dòng ngay bên dưới. HTML không chứa nội dung dự phòng; vì vậy website cần tải được các file Markdown qua HTTP/hosting tĩnh.
- Các tệp HTML chỉ giữ cấu trúc và vùng render; tiêu đề, mô tả, nhãn, CTA và nội dung hiển thị được lấy từ các file Markdown tương ứng.
- Thay ảnh hero bằng trường `image:` và mô tả ảnh bằng `image_alt:` trong khối `## hero` của `pages/content/vi/home.md`.
- Thêm bài viết bằng cách tạo file trong `pages/data/vi/articles/`, khai báo `date:` ngay sau tiêu đề `#`, rồi thêm tên file vào `pages/data/vi/articles/index.md`.
- Thêm hoặc xóa ảnh `div-basic-10` bằng cách sửa các khối `##` trong `pages/data/vi/showcase.md`. Mỗi khối dùng cú pháp giống bài viết: `![Mô tả](assets/images/ten-anh.webp "Chú thích")`; có thể thêm `position: center`, `top` hoặc `50% 30%` ngay dưới heading để điều khiển vùng ảnh thumbnail.
- Chèn liên kết trong bài viết bằng `[Tên liên kết](https://example.com)` hoặc `[Trang lộ trình](pages/?page=roadmap)`.
- Chèn ảnh vào một dòng riêng bằng `![Mô tả ảnh](assets/images/ten-anh.webp)`. Ảnh tự co giãn theo màn hình và được tải lazy.
- Thêm chú thích bên dưới ảnh bằng `![Mô tả ảnh](assets/images/ten-anh.webp "Chú thích ảnh")`. Có thể dùng URL `https://...`; nếu URL chứa khoảng trắng, đặt trong dấu `< >`.
- Chỉnh kích thước và căn ảnh bằng `![Mô tả](assets/images/ten-anh.webp){width=480 align=center}`. `width` nhận `small`, `medium`, `large`, `full`, px hoặc phần trăm; `align` nhận `left`, `center`, `right`.
- Ảnh khối trong bài viết tự có chế độ phóng to khi bấm hoặc dùng bàn phím; đóng bằng nút `×`, phím `Escape` hoặc vùng nền tối.
- Luôn viết mô tả ảnh có ý nghĩa cho người dùng trình đọc màn hình. Chỉ để trống `![](...)` khi ảnh hoàn toàn mang tính trang trí.
- Thêm giai đoạn bằng cách tạo file trong `pages/data/vi/roadmap/` và thêm tên file vào `pages/data/vi/roadmap/index.md`.
- Trong `div-basic-03`, thuộc tính `icon:` của mỗi mục `###` hỗ trợ `document`, `book`, `trend` và `list`.

Website cần được mở qua HTTP/hosting tĩnh để trình duyệt tải được các file Markdown.

## Triển khai

### Cloudflare Workers + GitHub (khuyến nghị)

`wrangler.jsonc` cấu hình Workers Static Assets đọc trực tiếp thư mục dự án, không có bước build. Triển khai bằng:

```bash
npx wrangler deploy
```

1. Push toàn bộ source lên nhánh `main` của GitHub.
2. Trong Cloudflare chọn **Workers & Pages → Create application → Import a repository**.
3. Chọn repository GitHub và đặt tên Worker là `md2site`, trùng với `name` trong `wrangler.jsonc`.
4. Chọn production branch `main`.
5. Để trống Build command.
6. Đặt Deploy command là `npx wrangler deploy`.
7. Đặt Root directory là `/` nếu dự án nằm ở gốc repository.

Sau khi lưu, mỗi lần push vào `main` sẽ tự động triển khai production. Có thể bật build cho non-production branches trong **Settings → Build → Branch control**; dùng `npx wrangler versions upload` để tạo preview mà không thay đổi production.

File `.gitignore` loại trừ `.wrangler`, `.dev.vars`, `.env`, log và dữ liệu công cụ cục bộ. Không commit token hoặc secret vào repository.

### Apache hoặc Nginx

Đây là phương án thay thế khi đã có hosting hoặc VPS riêng. Với Apache, tải toàn bộ dự án vào `public_html` hoặc `htdocs`; file `.htaccess` đã khai báo `index.html`, UTF-8, MIME `text/markdown` và trang lỗi giữ HTTP 404. Máy chủ cần cho phép các chỉ thị trong `.htaccess` (ví dụ `AllowOverride All`); cấu hình này không cần module `rewrite`.

Với Nginx, dùng mẫu `deploy/nginx.conf`, sửa `server_name` và `root`, sau đó kiểm tra bằng `nginx -t` trước khi reload dịch vụ. File thiếu phải giữ HTTP 404; không chuyển hướng request Markdown, CSS hoặc JavaScript sang một trang HTML trả HTTP 200.

## Kiểm tra và đóng gói bản phát hành

Luồng chạy dùng `assets/js/content-runtime.js` để tải và cache Markdown cùng manifest trong một lần mở trang. Request lỗi không được cache; request quá 15 giây được hủy để có thể báo lỗi hoặc fallback. Router tải đồng thời các nhóm tài nguyên độc lập, nhưng chờ template, shell và stylesheet sẵn sàng trước khi chạy app.

`assets/js/collection-loader.js` chỉ được tải ở trang dùng danh sách bài viết hoặc roadmap. Bộ điều khiển tải tối đa 4 mục mỗi đợt, gộp thao tác tải đồng thời và dừng tự tải khi lỗi; nút tải thêm cho phép thử lại đúng đợt đang lỗi. Nhiều khối danh sách trên cùng trang được khởi tạo riêng. Liên kết neo được chuẩn hóa tại các bước render thay vì theo dõi mọi thay đổi DOM.

Trong workspace nguồn, chạy `node build-release.mjs` để tạo lại `pages/data/downloads/md2site.zip` từ mã nguồn hiện tại. Script chỉ dùng module tích hợp của Node.js, không cần PowerShell hoặc thư viện ngoài và chủ động không tự đưa mình vào ZIP. Gói phát hành chỉ chứa website, nội dung và cấu hình triển khai; không chứa chính file ZIP, script đóng gói hoặc thư mục công cụ đóng gói.

Ngôn ngữ được chọn một lần từ `assets/content/languages/index.md`: ưu tiên lựa chọn đã lưu nếu còn được hỗ trợ, sau đó dùng `default: true`. Dữ liệu thử bản ngôn ngữ đang chọn trước và dùng bản nguồn/tiếng Việt khi bản dịch chưa có. Tám bài hướng dẫn và roadmap hiện có bản English. Giữ cùng tên file bài viết ở hai thư mục locale để chuyển ngôn ngữ mà không đổi bài; chỉ nội dung chưa có bản dịch mới dùng fallback.

## Thêm hoặc xóa trang

### 1. Tạo tệp nội dung

Tạo `pages/content/vi/gioi-thieu.md`:

```md
# Giới thiệu

## page-meta
meta_title: Giới thiệu — md2site
meta_description: Thông tin giới thiệu.

## hero
title: Giới thiệu
description: Nội dung trang được quản lý hoàn toàn bằng Markdown.

## div-basic-03

### Nội dung thứ nhất
Nội dung div được hiển thị theo đúng thứ tự khai báo trong tệp.
```

### 2. Khai báo trong tệp bên ngoài

Thêm vào `pages/index.md`:

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

Trang hoạt động ngay tại `pages/?page=gioi-thieu`, không cần chạy thêm lệnh. Muốn gỡ trang khỏi website, xóa khối `## gioi-thieu` trong `pages/index.md`; tệp nội dung có thể giữ lại làm bản nháp.

Các thuộc tính khai báo hỗ trợ:

- Heading `##`: tên định danh của khối khai báo.
- `nguon_trang`: bắt buộc, đường dẫn tới tệp Markdown nội dung.
- `trang`: slug dùng trên URL.
- `tieu_de_trang`: tiêu đề tài liệu trên trình duyệt.
- `tai_nguyen_phu_thuoc`: danh sách CSS/JavaScript dùng chung, phân cách bằng dấu phẩy.
- `header`: tên header trong `assets/templates/header/`.
- `body`: bắt buộc, tên body trong `assets/templates/body/`; mọi `div-basic-*` của trang được render thông qua body này.
- `footer`: tên footer trong `assets/templates/footer/`.
- `title`: nhãn menu viết trực tiếp.
- `label`: key nhãn lấy từ `assets/content/vi/common.md`.
- `order`: thứ tự trên menu.
- `nav: false`: trang tồn tại nhưng không xuất hiện trên menu.
- `active`: slug menu cần đánh dấu active, dùng cho trang con.

Trong tệp nội dung, dùng `## page-meta`, `## hero` hoặc `## div-basic-*` để chọn mẫu. Không cần khai báo `template:`; không cần `order:` nếu muốn hiển thị theo đúng thứ tự từ trên xuống dưới. Cú pháp cũ vẫn được hỗ trợ để tương thích.
