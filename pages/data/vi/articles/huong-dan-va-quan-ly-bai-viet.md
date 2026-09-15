# Triển khai và quản lý bài viết
date: 12/09/2026
description: Quy trình đầy đủ để tạo, xuất bản, sắp xếp, cập nhật, đổi tên và gỡ bài viết Markdown trong md2site.
keywords: md2site, triển khai bài viết, quản lý bài viết, chèn hình, Markdown
image: assets/images/beestudiosns/01_bee_studio_sns_light.svg

Bài này chỉ tập trung vào nội dung dạng bài viết trong danh sách Bài viết: tạo file, metadata, hình ảnh, thứ tự và vòng đời xuất bản. Trang độc lập có route hoặc menu riêng được xử lý trong bài quản lý trang.

Bài viết trong md2site là các file Markdown nằm trong `pages/data/vi/articles/`. File `pages/data/vi/articles/index.md` quyết định bài nào xuất hiện và thứ tự của chúng trên trang Bài viết.

Bài viết không cần khai báo riêng trong `pages/index.md`. Quy trình sử dụng gồm:

1. Tạo file Markdown cho bài viết.
2. Thêm tên file vào danh sách bài viết.
3. Mở URL bài để kiểm tra nội dung, hình ảnh và liên kết.
4. Cập nhật, sắp xếp hoặc xóa bài khi cần.

Nếu bạn muốn tạo một trang độc lập và đưa trang đó lên menu, hãy xem bài [Triển khai và quản lý trang](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md).

## Mã Markdown cho một bài viết mẫu

Tạo file `pages/data/vi/articles/kinh-nghiem-viet-noi-dung.md` và sao chép toàn bộ mã sau:

```md
# Kinh nghiệm viết nội dung dễ đọc
date: 11/09/2026
description: Các nguyên tắc giúp bài viết trên website rõ ràng và dễ theo dõi.
keywords: nội dung website, Markdown, md2site
image: assets/images/beestudiosns/01_bee_studio_sns_light.svg

Mở đầu bằng một đoạn ngắn để người đọc biết họ sẽ nhận được gì từ bài viết.

## Chia nội dung thành từng phần

Mỗi phần nên tập trung vào một ý chính. Dùng tiêu đề rõ ràng và đoạn văn vừa phải.

![Logo md2site](assets/images/beestudiosns/01_bee_studio_sns_light.svg "Hình minh họa trong bài viết"){width=240 align=center}

## Dẫn người đọc tới nội dung liên quan

Xem thêm [danh sách bài viết](pages/?page=articles) để tiếp tục tìm hiểu md2site.

## Kết luận

Kiểm tra lại tiêu đề, hình ảnh và liên kết trước khi hoàn tất bài viết.
```

Mã mẫu gồm metadata, đoạn mở đầu, heading, hình có chú thích và liên kết nội bộ. Bạn có thể thay nội dung nhưng nên giữ cấu trúc đầu bài.

## Metadata của bài viết

Các trường đầu file giúp md2site tạo thẻ bài viết và metadata cho trang đọc:

- Heading `#`: tiêu đề bài viết.
- `date`: ngày hiển thị, nên thống nhất định dạng `dd/mm/yyyy`.
- `description`: mô tả ngắn dùng trong danh sách và metadata.
- `keywords`: các từ khóa liên quan, phân tách bằng dấu phẩy.
- `image`: hình đại diện dùng khi chia sẻ bài viết.

Phần nội dung bắt đầu sau metadata. Dùng `##` cho phần chính và `###` cho nội dung cấp dưới.

## Thêm bài vào danh sách

Mở `pages/data/vi/articles/index.md` và thêm tên file:

```md
- kinh-nghiem-viet-noi-dung.md
```

Sau khi lưu, mở `pages/?page=articles`. Bài mới phải xuất hiện trong danh sách và có URL:

```text
pages/?page=article&post=kinh-nghiem-viet-noi-dung.md
```

Tên file nên viết thường, không dấu và ngăn cách từ bằng dấu gạch ngang. Tên này là một phần của URL nên hãy chọn rõ ràng ngay từ đầu.

## Chèn hình vào bài viết

Hình dùng trong bài nên được lưu trong `assets/images/` hoặc thư mục con của nó:

```text
assets/images/beestudiosns/01_bee_studio_sns_light.svg
assets/images/anh-bai-viet/huong-dan-01.webp
```

Tên file nên viết thường, không dấu và dùng dấu gạch ngang. Đường dẫn hình được tính từ thư mục gốc md2site, không phải từ thư mục chứa bài viết.

### Chèn một hình cơ bản

Đặt cú pháp hình trên một dòng riêng:

```md
![Logo md2site](assets/images/beestudiosns/01_bee_studio_sns_light.svg)
```

Kết quả:

![Logo md2site](assets/images/beestudiosns/01_bee_studio_sns_light.svg)

Phần trong ngoặc vuông là mô tả thay thế. Hãy mô tả ngắn gọn nội dung hoặc mục đích của hình để người không nhìn thấy hình vẫn hiểu bài viết.

### Thêm chú thích cho hình

Đặt chú thích trong dấu ngoặc kép sau đường dẫn:

```md
![Logo md2site](assets/images/beestudiosns/01_bee_studio_sns_light.svg "Logo đang dùng trên website")
```

Kết quả:

![Logo md2site](assets/images/beestudiosns/01_bee_studio_sns_light.svg "Logo đang dùng trên website")

Mô tả thay thế và chú thích có mục đích khác nhau. Mô tả thay thế giải thích nội dung hình; chú thích bổ sung ngữ cảnh hiển thị bên dưới hình.

### Điều chỉnh chiều rộng và căn lề

Thêm `{width=... align=...}` ngay sau cú pháp hình:

```md
![Logo md2site](assets/images/beestudiosns/01_bee_studio_sns_light.svg "Logo căn giữa"){width=240 align=center}
```

Kết quả:

![Logo md2site](assets/images/beestudiosns/01_bee_studio_sns_light.svg "Logo căn giữa"){width=240 align=center}

`width` nhận `small`, `medium`, `large`, `full`, số pixel như `480`, hoặc phần trăm như `60%`. `align` nhận `left`, `center` hoặc `right`.

Hình luôn bị giới hạn bởi chiều rộng vùng đọc, vì vậy không làm tràn màn hình nhỏ. Khi người đọc bấm vào hình, md2site dùng file gốc trong trình xem lớn.

### Hình chia sẻ và hình trong nội dung

Trường `image:` ở đầu bài khai báo hình đại diện:

```md
# Tiêu đề bài viết
date: 11/09/2026
description: Mô tả ngắn của bài viết.
image: assets/images/anh-chia-se.webp
```

Trường này không tự chèn hình vào thân bài. Muốn hình xuất hiện trong nội dung, bạn vẫn phải dùng cú pháp `![Mô tả](đường-dẫn)` tại vị trí mong muốn.

### Khi hình không hiển thị

Kiểm tra lần lượt:

- Tên file, phần mở rộng và chữ hoa/chữ thường.
- File hình có nằm đúng trong `assets/images/` hay không.
- Đường dẫn có bắt đầu từ thư mục gốc md2site hay không.
- Dấu ngoặc vuông, ngoặc tròn và dấu ngoặc kép có đầy đủ hay không.
- URL hình có mở trực tiếp trong trình duyệt hay không.
- Console hoặc Network có request hình trả về `404` hay không.

## Chèn liên kết và đoạn mã

Liên kết nội bộ dùng đường dẫn của md2site:

```md
[Xem danh sách bài viết](pages/?page=articles)
```

Đoạn mã ngắn đặt trong một cặp dấu backtick:

```md
Mở file `pages/data/vi/articles/index.md`.
```

Khối mã nhiều dòng đặt trong ba dấu backtick và có thể khai báo ngôn ngữ như `md`, `html`, `css` hoặc `js`.

## Sắp xếp bài viết

Thứ tự các dòng trong `pages/data/vi/articles/index.md` là thứ tự hiển thị. Ví dụ:

```md
- bai-moi.md
- bai-huong-dan.md
- bai-cu.md
```

Muốn đưa `bai-huong-dan.md` lên đầu, hãy di chuyển nguyên dòng:

```md
- bai-huong-dan.md
- bai-moi.md
- bai-cu.md
```

Không cần thêm trường `order` vào bài viết.

## Cập nhật và đổi tên bài viết

Để cập nhật bài, sửa trực tiếp file Markdown rồi tải lại URL đọc bài. Nên giữ nguyên tên file nếu không cần thay đổi URL.

Khi đổi tên, ví dụ:

```text
kinh-nghiem-viet-noi-dung.md
→ huong-dan-viet-noi-dung.md
```

Hãy cập nhật đồng thời:

1. Tên file trong `pages/data/vi/articles/index.md`.
2. Các liên kết có tham số `post=kinh-nghiem-viet-noi-dung.md`.
3. Các nơi khác trong md2site đang tham chiếu tên file cũ.

URL mới sẽ là:

```text
pages/?page=article&post=huong-dan-viet-noi-dung.md
```

## Xóa bài viết

Thực hiện theo thứ tự:

1. Gỡ tên file khỏi `pages/data/vi/articles/index.md`.
2. Tìm và cập nhật các liên kết đang trỏ tới bài.
3. Xóa file Markdown trong `pages/data/vi/articles/`.
4. Tải lại danh sách bài viết và kiểm tra không còn mục cũ.

Gỡ bài khỏi file index trước giúp danh sách không tạo liên kết tới một file đã bị xóa.

## Kiểm tra sau khi cập nhật

- Bài xuất hiện đúng vị trí trong danh sách.
- URL `page=article&post=...` mở đúng nội dung.
- Tiêu đề, ngày, mô tả và hình đại diện hiển thị chính xác.
- Các heading có thứ bậc rõ ràng.
- Hình và liên kết không trả về `404`.
- Chú thích, chiều rộng và căn lề hình hoạt động đúng.
- Bài dễ đọc trên màn hình nhỏ và khối mã không tràn ngang.
