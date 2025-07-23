<?php

class ThemeController extends Controller {
    private $model;
    private $sectionModel;
    
    public function __construct() {
        $this->model = new Theme();
        $this->sectionModel = new Section();
    }
    
    // 取得所有主題
    public function getAll() {
        return $this->model->getAll();
    }
    
    // 根據小節 ID 取得主題
    public function getBySectionId() {
        if (!isset($_POST['section_id']) || empty($_POST['section_id'])) {
            return self::response(400, '小節 ID 為必填欄位');
        }
        
        return $this->model->getBySectionId($_POST['section_id']);
    }
    
    // 根據 ID 取得單一主題
    public function getById() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '主題 ID 為必填欄位');
        }
        
        return $this->model->getById($_POST['id']);
    }
    
    // 搜尋主題
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
    
    // 新增主題
    public function create() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '主題 ID',
            'section_id' => '小節 ID',
            'name' => '主題名稱'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        // 檢查小節是否存在
        $sectionExists = $this->sectionModel->exists($_POST['section_id']);
        if ($sectionExists['status'] !== 200 || $sectionExists['result'][0]['count'] === 0) {
            return self::response(404, '所屬小節不存在');
        }
        
        // 檢查主題 ID 是否已存在
        $existsResult = $this->model->exists($_POST['id']);
        if ($existsResult['status'] === 200 && $existsResult['result'][0]['count'] > 0) {
            return self::response(409, "主題 ID「{$_POST['id']}」已經存在");
        }
        
        // 檢查在同一小節中名稱是否重複
        $nameExistsResult = $this->model->checkNameExists($_POST['section_id'], $_POST['name']);
        if ($nameExistsResult['status'] === 200 && $nameExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "在此小節中主題名稱「{$_POST['name']}」已經存在");
        }
        
        // 準備資料
        $data = [
            'id' => $_POST['id'],
            'section_id' => $_POST['section_id'],
            'name' => $_POST['name'],
            'outline' => isset($_POST['outline']) ? $_POST['outline'] : '',
            'key_points' => isset($_POST['key_points']) ? $_POST['key_points'] : '',
            'transcript' => isset($_POST['transcript']) ? $_POST['transcript'] : '',
            'youtube_id' => isset($_POST['youtube_id']) ? $_POST['youtube_id'] : '',
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : $this->model->getNextOrderIndex($_POST['section_id'])
        ];
        
        return $this->model->create($data);
    }
    
    // 更新主題
    public function update() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '主題 ID',
            'section_id' => '小節 ID',
            'name' => '主題名稱'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        $id = $_POST['id'];
        
        // 檢查主題是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '主題不存在');
        }
        
        // 檢查小節是否存在
        $sectionExists = $this->sectionModel->exists($_POST['section_id']);
        if ($sectionExists['status'] !== 200 || $sectionExists['result'][0]['count'] === 0) {
            return self::response(404, '所屬小節不存在');
        }
        
        // 檢查在同一小節中名稱是否重複（排除自己）
        $nameExistsResult = $this->model->checkNameExists($_POST['section_id'], $_POST['name'], $id);
        if ($nameExistsResult['status'] === 200 && $nameExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "在此小節中主題名稱「{$_POST['name']}」已經存在");
        }
        
        // 準備資料
        $data = [
            'section_id' => $_POST['section_id'],
            'name' => $_POST['name'],
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
    
    // 刪除主題
    public function delete() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '主題 ID 為必填欄位');
        }
        
        $id = $_POST['id'];
        
        // 檢查主題是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '主題不存在');
        }
        
        return $this->model->delete($id);
    }
}

?> 