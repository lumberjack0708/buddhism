# 佛法網站簡化版 MVC API

這是一個基於你的佛法網站資料庫結構建立的簡化版 MVC 架構，提供完整的增刪改查 API 功能。

## 目錄結構

```
server/
├── lib/                    # 基礎類別庫
│   ├── DB.php             # 資料庫操作類別
│   ├── Controller.php     # 控制器基類
│   └── Router.php         # 路由器
├── models/                # 資料模型層
│   ├── Scripture.php      # 典籍模型
│   ├── Chapter.php        # 章節模型
│   ├── Section.php        # 小節模型
│   ├── Theme.php          # 主題模型
│   └── QA.php             # 問答模型
├── controllers/           # 控制器層
│   ├── ScriptureController.php  # 典籍控制器
│   ├── ChapterController.php    # 章節控制器
│   ├── SectionController.php    # 小節控制器
│   ├── ThemeController.php      # 主題控制器
│   └── QAController.php         # 問答控制器
├── routes/                # 路由配置
│   └── api.php           # API 路由定義
├── bootstrap.php         # 系統初始化
├── DB.php               # 資料庫連線設定
├── index.php            # 主入口檔案
└── README.md            # 說明文件
```

## 安裝與設定

1. **資料庫設定**  
   在 `DB.php` 中修改資料庫連線參數：
   ```php
   DB::setConfig(
       'localhost',     // 主機
       'buddhism_db',   // 資料庫名稱
       'root',          // 使用者名稱
       ''               // 密碼
   );
   ```

2. **匯入資料庫**  
   將 `sql/buddhism_db.sql` 匯入到你的 MySQL 資料庫中。

3. **Web 伺服器設定**  
   確保 Web 伺服器指向 `server/` 目錄。

## API 使用方式

所有 API 請求都透過 `index.php` 處理，使用 `action` 參數指定要執行的操作。

### 請求格式

**GET 請求：**
```
GET /server/index.php?action=scriptures_getAll
```

**POST 請求：**
```
POST /server/index.php
Content-Type: application/x-www-form-urlencoded

action=scriptures_create&id=newScripture&name=新典籍
```

### 響應格式

所有 API 都會回傳 JSON 格式：
```json
{
    "status": 200,
    "message": "查詢成功",
    "result": [...]
}
```

## API 清單

### 典籍 (Scriptures) API

| Action | 說明 | 必要參數 | 選擇參數 |
|--------|------|----------|----------|
| `scriptures_getAll` | 取得所有典籍 | - | - |
| `scriptures_getById` | 取得單一典籍 | `id` | - |
| `scriptures_search` | 搜尋典籍 | `keyword` | - |
| `scriptures_create` | 新增典籍 | `id`, `name` | `description`, `order_index` |
| `scriptures_update` | 更新典籍 | `id`, `name` | `description`, `order_index` |
| `scriptures_delete` | 刪除典籍 | `id` | - |
| `scriptures_getStructure` | 取得典籍結構 | `id` | - |

### 章節 (Chapters) API

| Action | 說明 | 必要參數 | 選擇參數 |
|--------|------|----------|----------|
| `chapters_getAll` | 取得所有章節 | - | - |
| `chapters_getByScriptureId` | 根據典籍取得章節 | `scripture_id` | - |
| `chapters_getById` | 取得單一章節 | `id` | - |
| `chapters_search` | 搜尋章節 | `keyword` | - |
| `chapters_create` | 新增章節 | `id`, `scripture_id`, `name` | `description`, `order_index` |
| `chapters_update` | 更新章節 | `id`, `scripture_id`, `name` | `description`, `order_index` |
| `chapters_delete` | 刪除章節 | `id` | - |
| `chapters_getStructure` | 取得章節結構 | `id` | - |

### 小節 (Sections) API

| Action | 說明 | 必要參數 | 選擇參數 |
|--------|------|----------|----------|
| `sections_getAll` | 取得所有小節 | - | - |
| `sections_getByChapterId` | 根據章節取得小節 | `chapter_id` | - |
| `sections_getById` | 取得單一小節 | `id` | - |
| `sections_search` | 搜尋小節 | `keyword` | - |
| `sections_getByYoutubeId` | 根據 YouTube ID 搜尋 | `youtube_id` | - |
| `sections_create` | 新增小節 | `id`, `chapter_id`, `title` | `theme`, `outline`, `key_points`, `transcript`, `youtube_id`, `order_index` |
| `sections_update` | 更新小節 | `id`, `chapter_id`, `title` | `theme`, `outline`, `key_points`, `transcript`, `youtube_id`, `order_index` |
| `sections_delete` | 刪除小節 | `id` | - |
| `sections_getStructure` | 取得小節結構 | `id` | - |

### 主題 (Themes) API

| Action | 說明 | 必要參數 | 選擇參數 |
|--------|------|----------|----------|
| `themes_getAll` | 取得所有主題 | - | - |
| `themes_getBySectionId` | 根據小節取得主題 | `section_id` | - |
| `themes_getById` | 取得單一主題 | `id` | - |
| `themes_search` | 搜尋主題 | `keyword` | - |
| `themes_getByYoutubeId` | 根據 YouTube ID 搜尋 | `youtube_id` | - |
| `themes_create` | 新增主題 | `id`, `section_id`, `name` | `outline`, `key_points`, `transcript`, `youtube_id`, `order_index` |
| `themes_update` | 更新主題 | `id`, `section_id`, `name` | `outline`, `key_points`, `transcript`, `youtube_id`, `order_index` |
| `themes_delete` | 刪除主題 | `id` | - |

### 問答 (QA) API

| Action | 說明 | 必要參數 | 選擇參數 |
|--------|------|----------|----------|
| `qa_getAll` | 取得所有問答 | - | - |
| `qa_getByCategory` | 根據分類取得問答 | `category` | - |
| `qa_getById` | 取得單一問答 | `id` | - |
| `qa_search` | 搜尋問答 | `keyword` | - |
| `qa_fullTextSearch` | 全文搜索 | `keyword` | - |
| `qa_getByTag` | 根據標籤搜尋 | `tag` | - |
| `qa_getCategories` | 取得所有分類 | - | - |
| `qa_getAllTags` | 取得所有標籤 | - | - |
| `qa_getRandom` | 取得隨機問答 | - | `limit` (預設 5) |
| `qa_create` | 新增問答 | `id`, `category`, `question`, `answer` | `tags`, `order_index` |
| `qa_update` | 更新問答 | `id`, `category`, `question`, `answer` | `tags`, `order_index` |
| `qa_delete` | 刪除問答 | `id` | - |

## 使用範例

### JavaScript (Fetch API)

```javascript
// 取得所有典籍
fetch('/server/index.php?action=scriptures_getAll')
  .then(response => response.json())
  .then(data => console.log(data));

// 新增典籍
const formData = new FormData();
formData.append('action', 'scriptures_create');
formData.append('id', 'heartSutra');
formData.append('name', '般若波羅蜜多心經');
formData.append('description', '般若經典的精髓濃縮');

fetch('/server/index.php', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### PHP (cURL)

```php
// 取得所有問答
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/server/index.php?action=qa_getAll');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
```

## 特色功能

1. **無需複雜設定**：沒有 namespace、autoload、middleware 等複雜功能
2. **完整的增刪改查**：每個模組都提供完整的 CRUD 操作
3. **數據驗證**：自動驗證必填欄位和數據重複性
4. **錯誤處理**：統一的錯誤回應格式
5. **跨域支援**：內建 CORS 頭部設定
6. **中文友善**：全中文錯誤訊息和 UTF-8 編碼

## 資料庫表格結構

- `scriptures`: 典籍表
- `chapters`: 章節表
- `sections`: 小節表  
- `themes`: 主題表
- `qa`: 問答表

每個表格都有適當的索引和外鍵約束，確保資料完整性。 