# 佛法教學影片網站

一個基於React和Ant Design的靜態網站，專門用於佛法經典的學習和教學影片觀看。

## 🌸 特色功能

- **📚 典籍選擇**: 內嵌式選擇器，可選擇不同的佛法典籍
- **📖 章節導航**: 選定典籍後顯示對應的章節列表
- **🎥 影片教學**: 每個章節包含YouTube教學影片
- **📝 折疊式內容**: 可折疊的章節綱要和逐字稿
- **📱 響應式設計**: 完美適配桌面和移動設備
- **🎨 優雅UI**: 使用Ant Design打造現代化界面

## 🛠️ 技術架構

- **前端框架**: React 18
- **UI 庫**: Ant Design 5
- **圖標**: @ant-design/icons
- **樣式**: CSS3 + 漸變動畫
- **部署**: 靜態網站（可部署到GitHub Pages、Netlify等）

## 📁 專案結構

```
src/
├── components/
│   ├── HomePage.js          # 首頁組件（典籍選擇和章節列表）
│   └── ChapterPage.js       # 章節內容頁面
├── data/
│   └── scriptures.js        # 佛法典籍數據結構
├── App.js                   # 主應用組件
├── App.css                  # 全局樣式
└── index.js                 # 應用入口
```

## 🎯 內容結構

每個佛法典籍的數據結構：

```javascript
{
  id: "典籍ID",
  name: "典籍名稱", 
  description: "典籍描述",
  chapters: {
    "chapter1": {
      id: "章節ID",
      name: "章節名稱",
      description: "章節描述", 
      sections: [
        {
          id: "小節ID",
          title: "小節標題",
          outline: "章節綱要",
          transcript: "經文內容/逐字稿", 
          youtubeId: "YouTube影片ID"
        }
      ]
    }
  }
}
```

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 啟動開發服務器
```bash
npm start
```

### 建置生產版本
```bash
npm run build
```

## 📖 如何新增內容

### 1. 新增典籍

在 `src/data/scriptures.js` 中的 `scripturesData` 對象中新增：

```javascript
"newScripture": {
  id: "newScripture",
  name: "新典籍名稱",
  description: "典籍描述",
  chapters: {
    // 章節內容
  }
}
```

### 2. 新增章節

在對應典籍的 `chapters` 對象中新增：

```javascript
"newChapter": {
  id: "newChapter", 
  name: "新章節名稱",
  description: "章節描述",
  sections: [
    // 小節內容
  ]
}
```

### 3. 嵌入YouTube影片

將YouTube影片URL中的影片ID填入 `youtubeId` 欄位：

```
YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
youtubeId: "VIDEO_ID"
```

## 🎨 自定義樣式

主要樣式變數定義在 `src/App.css` 中：

- **主色調**: `#722ed1` (紫色，代表智慧)
- **輔助色**: `#52c41a` (綠色，代表慈悲)
- **警告色**: `#fa8c16` (橙色，用於重點提示)

### 修改主題色彩

在 `App.js` 的 `ConfigProvider` 中修改：

```javascript
theme={{
  token: {
    colorPrimary: '#722ed1', // 主色調
    borderRadius: 8,         // 圓角大小
  },
}}
```

## 🌐 部署指南

### GitHub Pages
1. 安裝 gh-pages: `npm install --save-dev gh-pages`
2. 在 package.json 中新增 homepage 和部署腳本
3. 運行: `npm run deploy`

### Netlify
1. 建置專案: `npm run build`
2. 將 `build` 資料夾上傳到 Netlify

### Vercel
1. 連接 GitHub 倉庫
2. 自動部署，無需額外配置

## 📱 響應式特性

- **桌面版**: 3列章節卡片佈局
- **平板版**: 2列章節卡片佈局  
- **手機版**: 1列章節卡片佈局
- **折疊面板**: 在所有裝置上提供良好的內容組織

## 🔧 進階功能擴展

### 1. 新增搜索功能
可以在 `HomePage.js` 中新增搜索框來篩選章節。

### 2. 書籤收藏
使用 localStorage 保存用戶的學習進度和收藏。

### 3. 多語言支持
使用 react-i18next 實現中文繁體、簡體、英文等多語言。

### 4. 學習筆記
新增用戶筆記功能，可以在每個章節下方新增個人學習心得。

## 📋 目前包含的典籍

- **大般若波羅蜜多經**: 般若部重要經典
- **金剛般若波羅蜜經**: 般若系經典中最著名的經典之一  
- **般若波羅蜜多心經**: 般若經典的精髓濃縮

## 🤝 貢獻指南

歡迎貢獻更多的佛法典籍內容！請遵循以下步驟：

1. Fork 此專案
2. 建立功能分支: `git checkout -b feature/new-scripture`
3. 新增典籍內容到 `src/data/scriptures.js`
4. 提交變更: `git commit -m 'Add new scripture: 典籍名稱'`
5. 推送到分支: `git push origin feature/new-scripture`
6. 提交 Pull Request

## 📜 版權聲明

本專案旨在弘揚佛法，促進佛法學習。所有經典內容均來自公開資源，如有版權問題請聯繫。

## 🙏 致謝

感謝所有為佛法弘揚做出貢獻的大德們，願此網站能夠幫助更多人學習佛法，獲得智慧與解脫。

---

**阿彌陀佛** 🙏
