# 蒲恆菲車業 — 網站排版與交互設計參考

> 綜合研究 Porsche、BMW、Lexus、Mercedes-Benz 官方網站，Carvana、SUM汽車網、ABC好車網、弘達國際汽車等平台，以及 2025–2026 年網頁設計趨勢整理而成。

---

## 一、整體設計原則

### 1.1 視覺層次與留白
- 每個區塊之間使用大量留白（80–120px padding），讓內容呼吸
- 資訊密度適中：一屏最多呈現一個核心訊息
- 用色克制：主色（品牌色）+ 輔助灰階 + 一個強調色，不超過三組
- 字體大小對比鮮明：標題 clamp(32px, 5vw, 64px)、內文 16–18px

### 1.2 信任感建立
- 首屏即可見品牌 Logo、電話、LINE 入口
- Goo 鑑定、認證標章放在醒目位置（車卡左上角 badge）
- 顧客評價 / 影片見證放在中段，搭配真實頭像與姓名
- 數據統計區（成交數、客戶數、年資）用動態計數器強化

### 1.3 轉換路徑設計
- 首頁 → 車輛列表(SRP) → 車輛詳情(VDP) → 聯繫/詢價，每一步都明確
- CTA 按鈕不超過兩個選項（避免選擇障礙）
- 浮動 LINE / 電話按鈕常駐右下角，隨時可觸及
- 手機版底部固定 CTA bar（電話 + LINE + 回頂部）

---

## 二、各區塊排版指南

### 2.1 導覽列 (Navbar)
- **Sticky header**：滾動後縮小高度、加深背景模糊（backdrop-filter: blur）
- Logo 左對齊，導覽項目居中或靠右
- 最右側放主要 CTA 按鈕（聯絡我們），用品牌色填充
- 手機版：漢堡選單 + 側滑抽屜（slide-in drawer），不用下拉
- 滾動方向偵測：往下滾隱藏 navbar，往上滾顯示

```css
/* 滾動縮小效果 */
.navbar { transition: all 0.3s ease; }
.navbar.scrolled {
    padding: 8px 0;
    box-shadow: 0 4px 30px rgba(0,0,0,0.08);
    backdrop-filter: blur(20px);
}
```

### 2.2 首屏 Hero
- **全屏高度**（100vh 或 min-height: 90vh）
- 背景：高品質車輛照片 + 放射狀 mask 淡化（中心透明，向外漸顯）
- 輪播：3–5 張，5 秒自動切換，底部指示點
- 標題字重 900，品牌名用漸層色強調
- 副標簡短有力（6–12 字），letter-spacing 加寬
- CTA 按鈕兩個：主要（實色）+ 次要（描邊）
- 底部加向下箭頭動畫引導滾動

**進階交互：**
- 滑鼠移動時背景圖微幅位移（parallax tilt effect）
- 切換時用 clip-path 或 opacity 過渡，不要用水平滑動
- 文字進場動畫：fadeInUp，延遲 0.3s

```css
/* Radial mask — 中心透明向外擴散 */
.hero-slide-bg {
    mask-image: radial-gradient(ellipse 120% 110% at 50% 48%,
        transparent 0%, rgba(0,0,0,0.1) 20%,
        rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 65%,
        rgba(0,0,0,0.85) 100%);
}
```

### 2.3 關於我們 (About)
- 左圖右文或上圖下文（手機版堆疊）
- 圖片使用實景店面照，加圓角 16px
- 文案分兩段：品牌故事 + 服務特色
- 下方放 4 個特色標籤（Goo認證、外匯車專營、售後完善、全省估價）
- 圖片可加微幅 parallax 滾動位移

### 2.4 服務項目 (Services)
- **Bento Grid** 或等寬三欄卡片
- 每張卡片：圖示 + 標題 + 2–3 行描述
- Hover 效果：卡片上浮 + 陰影加深 + 圖示變色
- 進場動畫：stagger（每張卡片延遲 0.1s 依序出現）

```css
/* Hover 上浮效果 */
.service-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}
```

### 2.5 在庫車輛 (Inventory)
- **三欄 Grid**（桌面），二欄（平板），一欄（手機）
- 車卡結構：圖片區 + 資訊區（品牌、車名、年份、里程、售價）
- 圖片比例固定 4:3 或 16:10，object-fit: cover
- Badge（Goo鑑定）放圖片左上角
- 售價用品牌金色加粗，放在規格列最右側

**進階交互：**
- 圖片 hover 放大 1.05x + 暗化遮罩 + 顯示「查看詳情」按鈕
- 點擊卡片展開 lightbox，顯示多張照片 + 詳細規格
- Lazy loading 圖片（loading="lazy"）
- 篩選功能：品牌 / 價格區間 / 年份（進階版本）

```css
/* 車卡圖片 hover */
.car-image { overflow: hidden; }
.car-image img {
    transition: transform 0.5s ease;
}
.car-card:hover .car-image img {
    transform: scale(1.05);
}

/* 售價強調 */
.car-price {
    font-size: 15px; font-weight: 800;
    color: #b8942e;
    margin-left: auto;
}
```

### 2.6 為何選擇我們 (Why Us)
- 數據統計區：大數字 + 小標題（如「500+ 成交車輛」）
- 用 Intersection Observer 觸發數字計數動畫
- 2×2 或 4 欄佈局，每格一個賣點
- 圖示用 Font Awesome 或自製 SVG

### 2.7 顧客評價 (Testimonials)
- 卡片式或輪播式
- 每則包含：星等 ⭐⭐⭐⭐⭐、評價文字、客戶名稱、車款
- 若有影片見證，嵌入 YouTube 或 Facebook 影片
- 背景用淺色紋理或漸層區隔

### 2.8 聯絡我們 (Contact)
- 資訊卡置中（移除表單後的單欄佈局）
- 包含：地址、電話（可點擊撥號）、LINE QRCode、營業時間
- 底部嵌入 Google Maps iframe
- 社群按鈕：Facebook、Instagram、LINE
- 最大寬度 680px 居中

### 2.9 Footer
- 深色背景，與主體形成對比
- 三欄或四欄：品牌資訊、快速連結、聯絡方式、營業時間
- 版權聲明置底
- 社群 icon 保持一致風格

---

## 三、交互動效指南

### 3.1 滾動觸發動畫 (Scroll Reveal)
- 使用 Intersection Observer API，threshold: 0.1
- 元素初始狀態：opacity: 0; transform: translateY(30px)
- 進入視窗時加 `.visible` class：opacity: 1; transform: none
- 過渡時間 0.6–0.8s，easing: ease-out

```css
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
}
```

### 3.2 Stagger 延遲進場
- Grid 內的卡片用 CSS variable 控制延遲
- 每張卡片延遲遞增 0.1s

```css
.car-card:nth-child(1) { transition-delay: 0s; }
.car-card:nth-child(2) { transition-delay: 0.1s; }
.car-card:nth-child(3) { transition-delay: 0.2s; }
/* 或用 JS 動態設定 */
```

### 3.3 數字計數動畫
- 從 0 計數到目標值，持續 2 秒
- 用 requestAnimationFrame 或 setInterval
- 只在元素進入視窗時觸發一次

### 3.4 平滑滾動
- `html { scroll-behavior: smooth; }`
- 導覽錨點搭配 `scroll-padding-top` 避開 sticky header

### 3.5 Hover 微交互
- 按鈕：translateY(-2px) + 陰影加深
- 卡片：translateY(-8px) + 大陰影
- 連結：底線從左滑入（width 0% → 100%）
- 圖示：輕微旋轉或縮放

### 3.6 Glassmorphism 效果（適用於 navbar、badge、彈窗）
```css
.glass {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
}
```

---

## 四、響應式斷點

| 斷點 | 寬度 | 佈局 |
|------|------|------|
| 桌面 | > 1024px | 三欄 Grid，側邊留白 |
| 平板 | 768–1024px | 二欄 Grid，縮小間距 |
| 手機 | < 768px | 單欄堆疊，全寬卡片 |

```css
@media (max-width: 1024px) {
    .inventory-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
    .inventory-grid { grid-template-columns: 1fr; }
    .hero-title { font-size: 36px; }
}
```

---

## 五、色彩系統

### 淺色金屬感主題（目前使用）
| 用途 | 色值 | 說明 |
|------|------|------|
| 品牌金 | #9c7c38 | 主要強調色 |
| 品牌金（深） | #7a5f24 | 文字用深金色 |
| 品牌金（亮） | #b8942e | 售價、hover 強調 |
| 背景 | #f0f2f5 | 主背景淺灰 |
| 卡片 | #ffffff | 白色卡片底 |
| 文字主色 | #1a202c | 標題、主要文字 |
| 文字副色 | #4a5568 | 說明、次要文字 |
| 邊框 | #d0d5dd | 分隔線、卡片邊框 |

---

## 六、字體規範

| 用途 | 字體 | 字重 | 大小 |
|------|------|------|------|
| 英文標題 | Montserrat | 800–900 | clamp(42px, 7vw, 80px) |
| 中文標題 | Noto Sans TC | 700–900 | 同上 |
| 區塊標題 | Noto Sans TC | 700 | 32–40px |
| 卡片標題 | Noto Sans TC | 700 | 18–20px |
| 內文 | Noto Sans TC | 400 | 15–16px |
| 小標/標籤 | Noto Sans TC | 500 | 12–13px |

---

## 七、效能優化

- 圖片全部使用 `loading="lazy"`
- Hero 背景圖用 `?w=1920&q=80` 控制尺寸
- 車卡圖片用 `?w=800` 或 Google Drive `=w800` 縮圖
- CSS 動畫優先用 `transform` 和 `opacity`（GPU 加速）
- 避免 `box-shadow` 動畫（改用 pseudo element 預渲染陰影）
- Font Awesome 只載入需要的 icon subset（進階）

---

## 八、待優化項目

1. **車輛詳情頁 (VDP)**：點擊車卡展開 lightbox，含多張照片輪播 + 完整規格
2. **篩選與排序**：品牌篩選、價格排序、關鍵字搜尋
3. **圖片 Lightbox**：全螢幕圖片瀏覽，支援左右滑動
4. **WhatsApp / LINE 一鍵詢價**：帶入車款名稱的預填訊息
5. **SEO 結構化資料**：Vehicle schema markup
6. **PWA 離線支援**：Service Worker 快取靜態資源
7. **暗色模式切換**：根據系統偏好自動切換
8. **多語系**：中 / 英切換

---

## 參考來源

- [INSIDEA — 20+ Website Design Ideas for Car Dealerships 2026](https://insidea.com/blog/marketing/car-dealerships/website-design-ideas-for-automotive-industry/)
- [Colorlib — 18 Best Car Dealer Websites](https://colorlib.com/wp/car-dealer-websites/)
- [Fireart Studio — Top Car Dealership Websites](https://fireart.studio/blog/12-examples-of-car-dealer-websites-with-fantastic-designs/)
- [Fyresite — Car Dealership Website Design Must-Have Features](https://www.fyresite.com/car-dealership-website-design-must-have-features-ux-best-practices/)
- [Space.auto — Lessons From Carvana](https://space.auto/building-the-best-dealership-website-lessons-from-carvana-digital-strategies/)
- [Azuro Digital — 10 Best Automotive Website Designs 2026](https://azurodigital.com/automotive-website-examples/)
- [Kijo London — Luxury Car Brand Websites Reviewed](https://kijo.london/blog/luxury-website-review-of-the-automotive-industry/)
- [Figma — Top Web Design Trends 2026](https://www.figma.com/resource-library/web-design-trends/)
- [Scroll-driven Animations — Stacking Cards CSS](https://scroll-driven-animations.style/demos/stacking-cards/css/)
- [Mobbin — Card UI Design Best Practices](https://mobbin.com/glossary/card)
- [Prototypr — 8 Best Practices for UI Card Design](https://prototypr.io/post/8-best-practices-for-ui-card-design)
