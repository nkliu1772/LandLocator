# 🏠 LandLocator - HRE 地號座標查詢系統

> 專為不動產估價師設計的台灣地號座標查詢與地圖標示系統

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/nkliu1772/LandLocator)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📖 專案簡介

LandLocator 是一個專為**漢娜不動產估價師聯合事務所**開發的地號座標查詢系統，能夠快速將台灣地號轉換為地圖座標，並在互動式地圖上清楚標示勘估標的與比較標的位置。

### ✨ 主要特色

- 🗺️ **互動式地圖顯示** - 基於 Leaflet.js 的流暢地圖操作體驗
- 📍 **多筆地號批次查詢** - 支援逗號或換行分隔的多筆地號輸入
- 🎨 **自訂標記樣式** - 4 種標記樣式可選（文字標籤、標準 Marker、Marker+文字、小圓點）
- 🎯 **可拖曳標記** - 支援手動微調標記位置
- 🔍 **智慧格式轉換** - 自動處理「台北」→「臺北」、「地號」→「號」等格式
- 📊 **查詢結果表格** - 清楚列出所有查詢結果與 Google Maps 連結
- 🎨 **顏色分類系統** - 勘估標的與比較標的使用不同顏色區分
- 📱 **現代化 UI** - 採用 Bootstrap 5 的響應式設計

## 🚀 快速開始

### 線上使用

直接開啟 `index.html` 即可使用（需要網路連線以載入地圖圖層）

### 本地部署

```bash
# 克隆專案
git clone https://github.com/nkliu1772/LandLocator.git

# 進入專案目錄
cd LandLocator

# 使用任何 HTTP 伺服器開啟 index.html
# 例如使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server
```

然後在瀏覽器開啟 `http://localhost:8000`

## 📝 使用說明

### 地號輸入格式

系統支援以下地號格式：

```
臺北市信義段三小段13地號
臺北市信義段三小段25地號
臺北市信義段三小段39地號
```

**注意事項：**
- 輸入時可包含「地號」關鍵字，系統會自動轉換成 API 支援的格式
- 查詢時不需撰寫「信義區」等行政區名稱
- 可能會因同一縣市有相同「段名」的土地而產生重複結果
- 多筆查詢時，可使用逗號或換行分隔
- 系統會自動將「台北」轉換為「臺北」等標準格式

### 地圖功能

| 功能按鈕 | 說明 |
|---------|------|
| 標記 | 切換顯示/隱藏所有地號標記 |
| 框線 | 切換顯示/隱藏土地範圍框線 |
| 第一筆 | 切換顯示/隱藏第一筆標的（勘估標的） |
| 標記樣式 | 選擇標記樣式（文字標籤/標準 Marker/Marker+文字/小圓點） |
| 標記設定 ⚙️ | 自訂標記文字、顏色與編號起始值 |

### 標記設定

點擊地圖左下角的 ⚙️ 按鈕可以自訂：

- **勘估標的**
  - 標記文字（預設：勘估標的）
  - 顏色選擇（紅、藍、綠、橘、紫）

- **比較標的**
  - 標記文字（預設：比較標的）
  - 顏色選擇（紅、藍、綠、橘、紫）
  - 起始編號（可設定從幾號開始）

## 🛠️ 技術架構

### 前端技術

- **HTML5** - 語義化標籤結構
- **CSS3** - 現代化樣式與動畫效果
- **JavaScript (ES6+)** - 原生 JavaScript 實現
- **Bootstrap 5.3.2** - 響應式 UI 框架
- **Leaflet.js 1.9.4** - 互動式地圖庫

### API 服務

- **地號查詢 API**: `https://twland.ronny.tw/index/search`
  - 提供台灣地號轉座標服務
  - 回傳 GeoJSON 格式資料

### 瀏覽器支援

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📂 專案結構

```
LandLocator/
├── index.html                    # 主要頁面 (v2.0.0 Modern UI)
├── land-locator-scripts.js       # 獨立版本腳本
├── changelog.md                  # 版本更新記錄
├── README.md                     # 專案說明文件
├── TODO.markdown                 # 開發計劃與功能規劃
└── versions/                     # 歷史版本目錄
    ├── index-v1.1.4.html        # v1.1.4 版本
    ├── land-locator-original.html # 簡約版本
    └── scripts.js                # v1.1.4 功能腳本
```

## 📊 版本歷史

### v2.0.0 - Modern UI (Current)
- ✨ 全新現代化介面設計
- ✨ 左右分欄布局（查詢區 + 地圖區）
- ✨ 4 種標記樣式選項
- ✨ 文字大小控制滑桿
- 🎨 Bootstrap 5 整合

### v1.1.4 - 隨機範例地號
- ✨ 新增「填入範例」按鈕
- ✨ 隨機範例地址功能

### v1.1.3 - 地名標準化
- 🐛 修正地名格式問題
- 🔧 自動轉換「台北」為「臺北」

### v1.1.2 - 地號格式修正
- 🐛 修正地號輸入格式處理
- 🔧 改進 API 查詢錯誤處理

### v1.1.1 - 自訂標記功能
- ✨ 標記設定面板
- ✨ 可拖曳標記
- ✨ 顏色與文字自訂

### v1.0.0 - 初始版本
- ✨ 基本地號查詢功能
- ✨ 地圖標記顯示

完整版本記錄請參考 [changelog.md](changelog.md)

## 🤝 貢獻

歡迎提出 Issue 或 Pull Request！

### 開發流程

1. Fork 此專案
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 👥 開發團隊

- **開發者**: nkliu1772
- **組織**: 漢娜不動產估價師聯合事務所 (HRE)

## 🔗 相關連結

- [專案 GitHub](https://github.com/nkliu1772/LandLocator)
- [問題回報](https://github.com/nkliu1772/LandLocator/issues)
- [地號 API 文件](https://twland.ronny.tw/)

## 📞 聯絡方式

如有任何問題或建議，歡迎透過 GitHub Issues 聯繫我們。

---

⭐ 如果這個專案對您有幫助，歡迎給個 Star！
