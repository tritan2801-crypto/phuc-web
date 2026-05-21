# Khang Phuc — Website Sitemap & Navigation Structure

This sitemap outlines all the pages, section-by-section requirements, and link structures to be built.

---

## 1. Global Layout Structure

- **Topbar**: Hotline, Zalo, Email, Office address, Shipping Policy toggle, B2B quick link.
- **Main Header**: Brand logo, Search bar (instant keypress matches), Cart count, Account/B2B Agent indicator.
- **Mega Menu (Desktop)**:
  - **Máy móc**: Máy mài sàn, Máy hút bụi, Máy chà sàn, Máy đánh bóng, Máy trộn, Máy vệ sinh công nghiệp
  - **Đĩa mài & Phụ kiện**: Đĩa mài bê tông, Đĩa đánh bóng, Pad đánh bóng, Chổi vệ sinh, Dao gạt, Dụng cụ thi công
  - **Hóa chất & Vật liệu**: Chất tăng cứng, Sơn PU, Sơn Epoxy, Phụ gia, Nguyên liệu trộn hồ, Chống thấm
  - **Combo & Giải pháp**: Combo thi công Epoxy, Combo đánh bóng sàn, Combo setup xưởng, Combo nhà thầu, Combo vệ sinh công nghiệp
  - **Theo ngành nghề**: Nhà xưởng, Nhà máy thực phẩm, Kho logistics, Bãi xe, Trung tâm thương mại, Bệnh viện, Khách sạn, Công trình dân dụng
  - **Tin tức**: Hướng dẫn thi công, Tư vấn kỹ thuật, So sánh vật liệu, Video thực tế, Case study
  - **Về chúng tôi**: Giới thiệu, Dự án, Chính sách, Liên hệ
  - **Đại lý B2B**: Login & Portal fastlink.
- **Footer**:
  - **Cột 1 — Về Khang Phúc**: Giới thiệu, Dự án, Tuyển dụng, Liên hệ.
  - **Cột 2 — Chính sách**: Giao hàng, Bảo hành, Đổi trả, Thanh toán.
  - **Cột 3 — Danh mục nổi bật**: Máy mài, Máy vệ sinh, Sơn epoxy, Đĩa mài.
  - **Cột 4 — Hỗ trợ & Liên hệ**: Hotline, Zalo, Messenger, Email.
  - **Cột 5 — Chứng nhận & Ngân hàng**: CO CQ, Nhà phân phối chính hãng, Đối tác thanh toán.

---

## 2. Pages Sitemap

### Home Page (`/`)
1. **Section 1: Hero Carousel Banner** — Giant deal slides + Tech Consultation & quote request buttons + Monthly deals side banners.
2. **Section 2: Quick Categories Grid** — 8 clean interactive round icons for direct navigation.
3. **Section 3: Floor Solutions Combos (Kumisai inspired)** — Horizontal setup bundles with interactive breakdown lists, custom pricing savings, and Buy/Quote buttons.
4. **Section 4: Product Category Tabs Block** — Quick filters (tabs) showing 4–8 responsive product cards with price recalculations.
5. **Section 5: Industry Solutions Grid** — Interactive cards matching flooring specifications for warehouses, hospitals, logistics depots, food plants.
6. **Section 6: Video Cases & Before-After Studies** — Video/Image comparisons.
7. **Section 7: SEO News & Guides Slider** — Real floor-care advice.
8. **Section 8: Customer & Contractor Feedback** — High trust reviews.
9. **Section 9: Core Trust USPs** — 100% Genuine, CO-CQ credentials, On-site tech support, Nationwide delivery.

### Category Pages (Hierarchical Routing)
- `/may-mai-san` (Level 1)
- `/may-mai-san/may-mai-mini` (Level 2)
- `/son-epoxy/son-tu-san`
- `/dia-mai/dia-mai-kim-cuong`
- *Features*: Sidebar filter list (Brand, motor power, dimensions, price range, flooring app), Grid items count display, quick sort (highest discount, price inc/dec).

### Product Details Page (`/products/[id]`)
- *Structure*: Left gallery slider (photos, 360-view mockup, construction video demo), right info details (title, current price, warehouse stock, dynamic quote request form).
- *Interactivity Tabs*: Description, Specifications sheet, Practical Guide, Warranty.
- *Recommendations*: Buy Along (grinding discs + floor chemicals + safety gear bundles), matching industry combos.

### B2B Portal (`/agency`)
- `/agency/login`: Secure credential validator.
- `/agency/dashboard`: Active dealer balance, past orders tracking, dealer price lists (Excel/PDF) download, customized wholesale tier discount toggle.

### Industry Solutions Landing Pages (`/giai-phap/[slug]`)
- `/giai-phap/nha-xuong`
- `/giai-phap/kho-logistics`
- `/giai-phap/benh-vien`
- `/giai-phap/nha-may-thuc-pham`
- *Structure*: Target challenges, required equipment checklists, suitable chemical coatings, and dedicated quotation estimators.
