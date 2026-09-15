# Triển khai và quản lý ngôn ngữ
date: 12/09/2026
description: Cách thêm, dịch, kiểm tra và bảo trì ngôn ngữ cho nhãn dùng chung, SEO, nội dung trang và dữ liệu Markdown trong md2site.
keywords: md2site, quản lý ngôn ngữ, đa ngôn ngữ, bản dịch, locale, Markdown

Bài này chỉ tập trung vào locale và bản dịch; màu sắc, CSS cùng cấu trúc template thuộc bài quản lý bố cục giao diện.

md2site tách ngôn ngữ thành ba lớp: danh sách locale, nội dung dùng chung và nội dung từng trang. Dữ liệu như bài viết, roadmap hoặc showcase nằm trong `pages/data/<ma-ngon-ngu>/` và cần được quản lý riêng khi bạn muốn dịch chúng.

Bài này dùng mã `en` làm ví dụ. Bạn có thể áp dụng cùng quy trình cho `ja`, `fr`, `th` hoặc mã ngôn ngữ hợp lệ khác.

## Cấu trúc ngôn ngữ

- `assets/content/languages/index.md`: danh sách ngôn ngữ trong bộ chọn.
- `assets/content/vi/common.md`: nhãn dùng chung tiếng Việt.
- `assets/content/vi/seo.md`: từ khóa và ảnh chia sẻ mặc định tiếng Việt.
- `pages/content/vi/*.md`: nội dung trang tiếng Việt.
- `pages/data/vi/`: bài viết, roadmap và dữ liệu collection tiếng Việt.

Bản tiếng Anh dùng cùng cấu trúc nhưng thay thư mục `vi` bằng `en`.

## Bước 1: khai báo ngôn ngữ

Mở `assets/content/languages/index.md`:

```md
# Ngôn ngữ hỗ trợ

## vi
label: Tiếng Việt
file: assets/content/vi/common.md
default: true

## en
label: English
file: assets/content/en/common.md
```

Heading `##` là mã locale. `label` là tên hiển thị trong menu. `file` trỏ tới nội dung dùng chung. Chỉ nên có một locale `default: true`; nếu không có, md2site dùng mục đầu tiên.

Mã locale phải gồm chữ và số theo dạng như `vi`, `en` hoặc `pt-br`. Giữ chữ thường để tên thư mục, giá trị lưu và thuộc tính `lang` nhất quán.

## Bước 2: dịch nội dung dùng chung

Tạo `assets/content/en/common.md` với cùng bộ khóa của bản tiếng Việt:

```md
# Shared content

## brand
md2site

## nav_home
Home

## nav_articles
Articles

## footer_tagline
A static website managed with Markdown.
```

Không dịch tên khóa như `nav_home`; chỉ dịch nội dung bên dưới. Template tra cứu bằng khóa nên một lỗi chính tả ở heading sẽ khiến nhãn cũ hoặc nhãn rỗng xuất hiện.

Khi thêm một khóa mới vào ngôn ngữ mặc định, thêm cùng khóa vào mọi file `common.md` khác trong cùng lần cập nhật.

## Bước 3: dịch SEO dùng chung

Sao chép `assets/content/vi/seo.md` sang `assets/content/en/seo.md`, giữ nguyên khóa và dịch giá trị:

```md
# Shared SEO

## og_image
assets/images/beestudiosns/01_bee_studio_sns_light.svg

## articles_keywords
md2site, Markdown guides, static website
```

Metadata riêng của từng trang vẫn nằm trong khối `## page-meta` của file trang. Không đặt tất cả tiêu đề và mô tả trang vào `seo.md` nếu chúng đã có trong nội dung trang.

## Bước 4: dịch nội dung trang

Mỗi file `pages/content/vi/<ten-trang>.md` nên có file tương ứng trong `pages/content/en/` với cùng tên. Ví dụ:

```text
pages/content/vi/contact.md
pages/content/en/contact.md
```

Giữ nguyên tên section và trường dữ liệu:

```md
## hero
eyebrow: Contact
title: Tell us about your project
description: Send the details and we will respond soon.
```

`page-router.js` lấy route đã khai báo trong `pages/index.md`, thay thư mục ngôn ngữ trong đường dẫn và thử tải bản dịch. Nếu file bản dịch không tồn tại, hệ thống quay về file nguồn tiếng Việt của route đó.

Fallback giúp trang không bị hỏng, nhưng có thể tạo giao diện trộn hai ngôn ngữ. Vì vậy, nên dịch trọn bộ các trang xuất hiện trên menu trước khi bật locale mới.

## Bước 5: quản lý dữ liệu bài viết và collection

Collection dùng thư mục `pages/data/`. Muốn có danh sách bài viết tiếng Anh độc lập, cấu trúc mục tiêu là:

```text
pages/data/en/articles/index.md
pages/data/en/articles/bat-dau-voi-md2site.md
```

Sau đó, bản tiếng Anh của `pages/content/en/articles.md` phải trỏ tới index tiếng Anh:

```md
## div-basic-06
index: pages/data/en/articles/index.md
```

Trang đọc bài và danh sách hiện ưu tiên dữ liệu theo locale đang chọn. Giữ cùng tên file giữa `pages/data/vi/articles/` và `pages/data/en/articles/` để khi chuyển ngôn ngữ, tham số `post` vẫn mở đúng bài tương ứng. Dịch cả tiêu đề, mô tả, từ khóa, nội dung và chú thích ảnh. Nếu bản dịch chưa có, hệ thống mới dùng fallback về file nguồn/tiếng Việt.

Roadmap và showcase cũng cần đổi trường `index:` trong file trang bản dịch để trỏ tới `pages/data/en/...` nếu bạn có dữ liệu dịch riêng. Nếu chưa dịch collection, giữ đường dẫn tiếng Việt và chấp nhận nội dung fallback.

## Bước 6: kiểm tra bộ chọn ngôn ngữ

Lựa chọn được lưu trong `localStorage` bằng khóa `md2site-language`. Khi kiểm tra:

1. Chọn từng ngôn ngữ từ header.
2. Tải lại trang và xác nhận lựa chọn được giữ.
3. Mở trực tiếp từng route trên menu.
4. Kiểm tra thuộc tính `lang` của thẻ `<html>`.
5. Kiểm tra tiêu đề, mô tả, menu và footer.
6. Thử một file bản dịch bị thiếu để xác nhận fallback có chủ đích.

Để kiểm tra trạng thái người dùng mới, xóa riêng khóa `md2site-language` trong Application → Local Storage hoặc mở cửa sổ riêng tư.

## Quy trình cập nhật bản dịch

Khi nội dung gốc thay đổi:

1. Xác định các file ngôn ngữ tương ứng.
2. Dịch nội dung mới nhưng giữ nguyên heading, field và URL nội bộ.
3. So sánh bộ khóa `common.md` giữa các ngôn ngữ.
4. Kiểm tra độ dài nhãn trên menu mobile và desktop.
5. Mở preview trước khi merge production.

Không dùng bản dịch máy chưa được rà soát cho metadata SEO, nút hành động hoặc nội dung pháp lý.

## Xóa một ngôn ngữ

1. Gỡ khối locale khỏi `assets/content/languages/index.md`.
2. Đổi locale mặc định nếu ngôn ngữ bị xóa đang có `default: true`.
3. Kiểm tra người dùng đã lưu locale cũ có được đưa về mặc định hay không.
4. Chỉ xóa thư mục bản dịch sau khi xác nhận không còn đường dẫn tham chiếu.
5. Cập nhật sitemap hoặc `hreflang` nếu website đã công bố URL riêng theo ngôn ngữ.

## Xử lý lỗi thường gặp

- **Bộ chọn ngôn ngữ biến mất:** kiểm tra `languages/index.md`, trường `file` và request tới `common.md`.
- **Một nhãn không dịch:** tìm khóa đó trong cả hai file `common.md`.
- **Trang vẫn là tiếng Việt:** kiểm tra file cùng tên có tồn tại trong `pages/content/<locale>/` hay không.
- **Một trang trộn hai ngôn ngữ:** file trang hoặc khóa dùng chung đang rơi vào fallback.
- **Bài viết vẫn là tiếng Việt:** kiểm tra file cùng tên và index trong `pages/data/en/articles/`; thiếu bản dịch sẽ khiến hệ thống dùng fallback.
- **Nhãn làm vỡ menu:** rút gọn bản dịch hoặc điều chỉnh responsive của header, không giảm cỡ chữ chỉ cho một ngôn ngữ.

## Checklist nghiệm thu ngôn ngữ

- Locale xuất hiện đúng trong bộ chọn.
- Chỉ có một locale mặc định.
- Các file `common.md` có cùng bộ khóa cần thiết.
- Mọi trang trên menu có bản dịch tương ứng.
- Metadata SEO thay đổi theo ngôn ngữ.
- Lựa chọn được giữ sau khi tải lại.
- Không có request bản dịch bị `404` ngoài fallback đã chủ động.
- Menu, nút và heading không tràn ở màn hình nhỏ.

Đọc tiếp [Triển khai và quản lý trang](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md) để hiểu cách route tìm file nội dung theo locale.
