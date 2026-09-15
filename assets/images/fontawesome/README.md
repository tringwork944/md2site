# Font Awesome SVG

md2site hỗ trợ Font Awesome bằng SVG sprite được tự host.

1. Tải gói Font Awesome phù hợp với giấy phép của bạn.
2. Sao chép các sprite cần dùng vào `assets/images/fontawesome/sprites/`.
3. Giữ tên tệp là `solid.svg`, `regular.svg` hoặc `brands.svg`.
4. Gọi icon trong Markdown bằng `fa-solid:tên-icon`, `fa-regular:tên-icon` hoặc `fa-brands:tên-icon`.

```md
### Trang chủ
icon: fa-solid:house
Đi tới trang chủ.
```

Tên icon phải viết thường và dùng dấu gạch ngang. Các sprite cần nằm cùng máy chủ với website.
