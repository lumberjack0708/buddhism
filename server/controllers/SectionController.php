<?php

class SectionController extends Controller {
    private $model;
    private $chapterModel;
    
    public function __construct() {
        $this->model = new Section();
        $this->chapterModel = new Chapter();
    }
    
    // 取得所有小節
    public function getAll() {
        return $this->model->getAll();
    }
    
    // 根據章節 ID 取得小節
    public function getByChapterId() {
        if (!isset($_POST['chapter_id']) || empty($_POST['chapter_id'])) {
            return self::response(400, '章節 ID 為必填欄位');
        }
        
        return $this->model->getByChapterId($_POST['chapter_id']);
    }
    
    // 根據 ID 取得單一小節
    public function getById() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '小節 ID 為必填欄位');
        }
        
        return $this->model->getById($_POST['id']);
    }
    
    // 搜尋小節
    public function search() {
        if (!isset($_POST['keyword']) || empty($_POST['keyword'])) {
            return self::response(400, '搜尋關鍵字為必填欄位');
        }
        
        return $this->model->search($_POST['keyword']);
    }
    
    // 根據 YouTube ID 搜尋
    public function getByYoutubeId() {
        if (!isset($_POST['youtube_id']) || empty($_POST['youtube_id'])) {
            return self::response(400, 'YouTube ID 為必填欄位');
        }
        
        return $this->model->getByYoutubeId($_POST['youtube_id']);
    }
    
    // 新增小節
    public function create() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '小節 ID',
            'chapter_id' => '章節 ID',
            'title' => '小節標題'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        // 檢查章節是否存在
        $chapterExists = $this->chapterModel->exists($_POST['chapter_id']);
        if ($chapterExists['status'] !== 200 || $chapterExists['result'][0]['count'] === 0) {
            return self::response(404, '所屬章節不存在');
        }
        
        // 檢查小節 ID 是否已存在
        $existsResult = $this->model->exists($_POST['id']);
        if ($existsResult['status'] === 200 && $existsResult['result'][0]['count'] > 0) {
            return self::response(409, "小節 ID「{$_POST['id']}」已經存在");
        }
        
        // 檢查在同一章節中標題是否重複
        $titleExistsResult = $this->model->checkTitleExists($_POST['chapter_id'], $_POST['title']);
        if ($titleExistsResult['status'] === 200 && $titleExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "在此章節中小節標題「{$_POST['title']}」已經存在");
        }
        
        // 準備資料
        $data = [
            'id' => $_POST['id'],
            'chapter_id' => $_POST['chapter_id'],
            'title' => $_POST['title'],
            'theme' => isset($_POST['theme']) ? $_POST['theme'] : '',
            'outline' => isset($_POST['outline']) ? $_POST['outline'] : '',
            'key_points' => isset($_POST['key_points']) ? $_POST['key_points'] : '',
            'transcript' => isset($_POST['transcript']) ? $_POST['transcript'] : '',
            'youtube_id' => isset($_POST['youtube_id']) ? $_POST['youtube_id'] : '',
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : $this->model->getNextOrderIndex($_POST['chapter_id'])
        ];
        
        return $this->model->create($data);
    }
    
    // 更新小節
    public function update() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '小節 ID',
            'chapter_id' => '章節 ID',
            'title' => '小節標題'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        $id = $_POST['id'];
        
        // 檢查小節是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '小節不存在');
        }
        
        // 檢查章節是否存在
        $chapterExists = $this->chapterModel->exists($_POST['chapter_id']);
        if ($chapterExists['status'] !== 200 || $chapterExists['result'][0]['count'] === 0) {
            return self::response(404, '所屬章節不存在');
        }
        
        // 檢查在同一章節中標題是否重複（排除自己）
        $titleExistsResult = $this->model->checkTitleExists($_POST['chapter_id'], $_POST['title'], $id);
        if ($titleExistsResult['status'] === 200 && $titleExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "在此章節中小節標題「{$_POST['title']}」已經存在");
        }
        
        // 準備資料
        $data = [
            'chapter_id' => $_POST['chapter_id'],
            'title' => $_POST['title'],
            'theme' => isset($_POST['theme']) ? $_POST['theme'] : '',
            'outline' => isset($_POST['outline']) ? $_POST['outline'] : '',
            'key_points' => isset($_POST['key_points']) ? $_POST['key_points'] : '',
            'transcript' => isset($_POST['transcript']) ? $_POST['transcript'] : '',
            'youtube_id' => isset($_POST['youtube_id']) ? $_POST['youtube_id'] : '',
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : 0
        ];
        
        return $this->model->update($id, $data);
    }
    
    // 刪除小節
    public function delete() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '小節 ID 為必填欄位');
        }
        
        $id = $_POST['id'];
        
        // 檢查小節是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '小節不存在');
        }
        
        return $this->model->delete($id);
    }
    
    // 取得小節的完整結構
    public function getStructure() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '小節 ID 為必填欄位');
        }
        
        return $this->model->getStructure($_POST['id']);
    }
}

?> 