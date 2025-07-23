# 佛法教學影片網站

一個現代化的佛法學習平台，提供典籍瀏覽、影片教學和問答功能。使用 React + PHP + MySQL 架構。

## 系統架構

### 前端
- **框架**: React 19.1.0
- **UI 組件庫**: Ant Design 5.26.6
- **路由**: React Router DOM 7.7.0
- **狀態管理**: React Hooks + 自定義 DataManager

### 後端
- **語言**: PHP 8.0+
- **數據庫**: MySQL 8.0+
- **Web 服務器**: Apache (XAMPP)
- **API 架構**: RESTful API

## 環境需求

### 開發環境
1. **Node.js** 16.0+ 和 npm
2. **XAMPP** 或其他 PHP + MySQL + Apache 環境
3. **Git**

### 生產環境
1. **Web 服務器**: Apache 2.4+
2. **PHP**: 8.0+
3. **MySQL**: 8.0+
4. **Node.js**: 16.0+ (用於構建前端)

## 安裝與設置

### 1. 克隆專案
```bash
git clone [repository-url]
cd buddhism
```

### 2. 前端設置
```bash
# 安裝前端依賴
npm install

# 啟動開發服務器
npm start
```

### 3. 後端設置

#### XAMPP 安裝與配置
1. 下載並安裝 [XAMPP](https://www.apachefriends.org/)
2. 啟動 Apache 和 MySQL 服務
3. 將專案中的 `api` 資料夾複製到 XAMPP 的 `htdocs` 目錄

#### 數據庫設置
1. 開啟 phpMyAdmin (http://localhost/phpmyadmin)
2. 執行 `api/database/schema.sql` 中的 SQL 腳本
3. 確認資料庫 `buddhism_db` 創建成功

#### API 配置
1. 檢查 `api/config/database.php` 中的數據庫連接設置
2. 根據需要修改數據庫用戶名和密碼
3. 確保 Apache 的 mod_rewrite 模組已啟用

### 4. 初始化數據
系統首次運行時會自動從 `public/data/` 載入預設數據。

## API 端點

### 典籍相關
- `GET /api/scriptures` - 取得所有典籍
- `GET /api/scriptures/{id}` - 取得特定典籍
- `GET /api/scriptures/{id}/chapters` - 取得典籍章節
- `GET /api/scriptures/{scripture_id}/chapters/{chapter_id}` - 取得章節詳情
- `POST /api/scriptures` - 新增典籍
- `PUT /api/scriptures/{id}` - 更新典籍
- `DELETE /api/scriptures/{id}` - 刪除典籍

### 問答相關
- `GET /api/qa` - 取得問答列表
- `GET /api/qa?category={category}` - 按分類篩選
- `GET /api/qa?search={keyword}` - 搜尋問答
- `GET /api/qa/categories` - 取得所有分類
- `POST /api/qa` - 新增問答
- `PUT /api/qa/{id}` - 更新問答
- `DELETE /api/qa/{id}` - 刪除問答

### 搜尋功能
- `GET /api/search?keyword={keyword}&type={type}` - 搜尋內容

### 數據管理
- `GET /api/data/export` - 匯出所有數據
- `POST /api/data/import` - 匯入數據
- `POST /api/data/reset` - 重設為預設數據
- `GET /api/data/init` - 初始化檢查

## 主要功能

### 1. 典籍瀏覽
- 按典籍分類瀏覽佛經內容
- 章節結構化顯示
- 支援多層次主題組織

### 2. 影片學習
- YouTube 影片整合
- 按章節組織的教學影片
- 影片與經文內容同步

### 3. 問答系統
- 分類問答瀏覽
- 關鍵字搜尋功能
- 標籤系統

### 4. 搜尋功能
- 全文搜尋經典內容
- 高亮關鍵字顯示
- 快速定位相關章節

### 5. 管理員後台
- 典籍內容管理
- 問答內容管理
- 數據匯出入功能
- 系統設置

## 技術特色

### 前端
- **響應式設計**: 適配各種設備屏幕
- **組件化架構**: 可重用的 React 組件
- **用戶體驗**: 流暢的導航和互動
- **無障礙設計**: 符合網頁可訪問性標準

### 後端
- **RESTful API**: 清晰的 API 設計
- **數據庫優化**: 索引和查詢優化
- **錯誤處理**: 完善的錯誤回應機制
- **安全性**: 數據驗證和清理

## 開發指南

### 前端開發
```bash
# 啟動開發服務器
npm start

# 構建生產版本
npm run build

# 運行測試
npm test
```

### 後端開發
1. 修改 PHP 文件後重啟 Apache（如需要）
2. 使用 phpMyAdmin 管理數據庫
3. 查看 Apache 錯誤日誌進行除錯

### 數據庫遷移
- 執行 `api/database/schema.sql` 更新數據庫結構
- 使用管理後台的匯出入功能遷移數據

## 疑難排解

### 常見問題

1. **CORS 錯誤**
   - 確認 `.htaccess` 設置正確
   - 檢查 Apache 是否啟用 headers 模組

2. **數據庫連接失敗**
   - 檢查 MySQL 服務是否運行
   - 確認 `api/config/database.php` 中的連接參數

3. **API 404 錯誤**
   - 確認 Apache mod_rewrite 已啟用
   - 檢查 `.htaccess` 文件是否存在

4. **前端無法載入數據**
   - 檢查 API 基礎 URL 設置
   - 確認後端服務正常運行

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 許可證

此專案使用 MIT 許可證 - 詳見 [LICENSE](LICENSE) 文件

## 聯絡方式

如有任何問題或建議，請透過以下方式聯絡：
- 創建 Issue
- 發送 Pull Request
- 聯絡專案維護者
