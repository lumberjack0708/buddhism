<?php

class ChapterController extends Controller {
    private $model;
    private $scriptureModel;
    
    public function __construct() {
        $this->model = new Chapter();
        $this->scriptureModel = new Scripture();
    }
    
    // 取得所有章節
    public function getAll() {
        return $this->model->getAll();
    }
    
    // 根據典籍 ID 取得章節
    public function getByScriptureId() {
        if (!isset($_POST['scripture_id']) || empty($_POST['scripture_id'])) {
            return self::response(400, '典籍 ID 為必填欄位');
        }
        
        return $this->model->getByScriptureId($_POST['scripture_id']);
    }
    
    // 根據 ID 取得單一章節
    public function getById() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '章節 ID 為必填欄位');
        }
        
        return $this->model->getById($_POST['id']);
    }
    
    // 搜尋章節
    public function search() {
        if (!isset($_POST['keyword']) || empty($_POST['keyword'])) {
            return self::response(400, '搜尋關鍵字為必填欄位');
        }
        
        return $this->model->search($_POST['keyword']);
    }
    
    // 新增章節
    public function create() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '章節 ID',
            'scripture_id' => '典籍 ID',
            'name' => '章節名稱'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        // 檢查典籍是否存在
        $scriptureExists = $this->scriptureModel->exists($_POST['scripture_id']);
        if ($scriptureExists['status'] !== 200 || $scriptureExists['result'][0]['count'] === 0) {
            return self::response(404, '所屬典籍不存在');
        }
        
        // 檢查章節 ID 是否已存在
        $existsResult = $this->model->exists($_POST['id']);
        if ($existsResult['status'] === 200 && $existsResult['result'][0]['count'] > 0) {
            return self::response(409, "章節 ID「{$_POST['id']}」已經存在");
        }
        
        // 檢查在同一典籍中名稱是否重複
        $nameExistsResult = $this->model->checkNameExists($_POST['scripture_id'], $_POST['name']);
        if ($nameExistsResult['status'] === 200 && $nameExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "在此典籍中章節名稱「{$_POST['name']}」已經存在");
        }
        
        // 準備資料
        $data = [
            'id' => $_POST['id'],
            'scripture_id' => $_POST['scripture_id'],
            'name' => $_POST['name'],
            'description' => isset($_POST['description']) ? $_POST['description'] : '',
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : $this->model->getNextOrderIndex($_POST['scripture_id'])
        ];
        
        return $this->model->create($data);
    }
    
    // 更新章節
    public function update() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '章節 ID',
            'scripture_id' => '典籍 ID',
            'name' => '章節名稱'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        $id = $_POST['id'];
        
        // 檢查章節是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '章節不存在');
        }
        
        // 檢查典籍是否存在
        $scriptureExists = $this->scriptureModel->exists($_POST['scripture_id']);
        if ($scriptureExists['status'] !== 200 || $scriptureExists['result'][0]['count'] === 0) {
            return self::response(404, '所屬典籍不存在');
        }
        
        // 檢查在同一典籍中名稱是否重複（排除自己）
        $nameExistsResult = $this->model->checkNameExists($_POST['scripture_id'], $_POST['name'], $id);
        if ($nameExistsResult['status'] === 200 && $nameExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "在此典籍中章節名稱「{$_POST['name']}」已經存在");
        }
        
        // 準備資料
        $data = [
            'scripture_id' => $_POST['scripture_id'],
            'name' => $_POST['name'],
            'description' => isset($_POST['description']) ? $_POST['description'] : '',
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : 0
        ];
        
        return $this->model->update($id, $data);
    }
    
    // 刪除章節
    public function delete() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '章節 ID 為必填欄位');
        }
        
        $id = $_POST['id'];
        
        // 檢查章節是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '章節不存在');
        }
        
        return $this->model->delete($id);
    }
    
    // 取得章節的完整結構
    public function getStructure() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '章節 ID 為必填欄位');
        }
        
        return $this->model->getStructure($_POST['id']);
    }
}

?> 