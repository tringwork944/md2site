# Sử dụng icon trong md2site
date: 12/09/2026
description: Dùng icon có sẵn, Font Awesome sprite hoặc tệp SVG trong các khối nội dung của md2site.
keywords: md2site, icon SVG, Font Awesome, Markdown, accessibility

Bài này chỉ giải thích cách khai báo và xử lý icon. Cách chọn section, xây lưới thẻ hoặc quản lý CSS tổng thể nằm trong bài [Quản lý bố cục giao diện](pages/?page=article&post=huong-dan-su-dung-mau-giao-dien.md).

Icon trong md2site chủ yếu xuất hiện ở các thẻ của `div-basic-03`. Bạn chỉ cần khai báo một tên ngắn trong Markdown; template sẽ tạo phần SVG tương ứng. Cách này giúp các thẻ dùng chung kích thước, màu và nét vẽ mà không phải chèn HTML vào nội dung.

## Bốn icon có sẵn

`div-basic-03` đang hỗ trợ bốn tên mặc định:

- `document`: tài liệu hoặc trang nội dung.
- `book`: kiến thức và hướng dẫn.
- `trend`: lộ trình hoặc tăng trưởng.
- `list`: danh sách và quy trình.

Ví dụ:

```md
## div-basic-03
eyebrow: Danh mục
title: Nội dung nổi bật

### Bắt đầu sử dụng
icon: document
Các bước làm quen với md2site.

### Kiến thức nền
icon: book
Những điều nên biết trước khi tùy chỉnh website.

### Lộ trình
icon: trend
Các giai đoạn phát triển của dự án.

### Checklist
icon: list
Việc cần kiểm tra trước khi xuất bản.
```

Nếu bỏ trường `icon:` hoặc nhập một tên không được hỗ trợ, md2site dùng `document` làm mặc định. Đây là hành vi có chủ đích để thẻ không bị trống khi nội dung có lỗi chính tả.

## Dùng Font Awesome bằng SVG sprite

Runtime của template hiểu cú pháp `fa-solid:`, `fa-regular:` và `fa-brands:`. Ví dụ:

```md
### Trang chủ
icon: fa-solid:house
Đi tới trang chủ.

### GitHub
icon: fa-brands:github
Mở repository của dự án.
```

Để cách này hoạt động, dự án phải có sprite tương ứng:

```text
assets/images/fontawesome/sprites/solid.svg
assets/images/fontawesome/sprites/regular.svg
assets/images/fontawesome/sprites/brands.svg
```

Phần sau dấu hai chấm là id của biểu tượng trong sprite, chẳng hạn `house` hoặc `arrow-right`. Nếu sprite không có id đó, trình duyệt vẫn tạo phần tử SVG nhưng sẽ không có hình để hiển thị.

Tên icon nên viết thường và dùng dấu gạch ngang. Không cần tải webfont hay JavaScript của Font Awesome; md2site tham chiếu trực tiếp tới SVG sprite trên cùng website.

## Dùng một tệp SVG riêng

Khi chỉ có một file SVG, dùng tiền tố `svg:`:

```md
### Cài đặt
icon: svg:assets/images/icons/gear.svg
Mở phần cài đặt.
```

Runtime chỉ chấp nhận đường dẫn kết thúc bằng `.svg` và dùng bộ lọc URL an toàn của template. Ảnh icon được đánh dấu là trang trí vì tiêu đề thẻ ngay bên cạnh đã cung cấp ý nghĩa.

Nên đặt icon dùng chung trong `assets/images/icons/` và giữ cùng `viewBox`, độ dày nét, khoảng trắng quang học. Một nhóm thẻ sẽ trông thiếu nhất quán nếu mỗi biểu tượng đến từ một bộ khác nhau.

## Icon trong thân bài viết

Trình đọc bài không xử lý trường `icon:` như `div-basic-03`. Nếu cần minh họa trong bài, dùng cú pháp ảnh Markdown:

```md
![Dấu kiểm hoàn tất](assets/images/icons/check.svg)
```

Nếu biểu tượng chỉ để trang trí, có thể để mô tả rỗng:

```md
![](assets/images/icons/decorative.svg)
```

Emoji cũng hiển thị như văn bản thông thường, nhưng hình dáng thay đổi theo hệ điều hành. Với trạng thái quan trọng hoặc thành phần nhận diện, SVG ổn định hơn.

## Khi icon không xuất hiện

Trước hết, kiểm tra tên trong `icon:` có đúng cú pháp hay không. Với Font Awesome, mở file sprite và tìm đúng id sau dấu `#`. Với `svg:`, thử mở trực tiếp đường dẫn file trên trình duyệt.

Nếu icon có hình nhưng khó nhìn ở chế độ tối, hãy kiểm tra SVG có gán màu cứng hay không. Icon tích hợp dùng `currentColor`, nhờ vậy tự đi theo màu chữ của giao diện.

Danh sách icon mặc định và logic phân tích nằm trong `assets/templates/sections/runtime.js`. Khi thêm icon mới, cập nhật runtime rồi thử trên trang Showcase trước khi dùng rộng rãi.
