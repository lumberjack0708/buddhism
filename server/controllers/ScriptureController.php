<?php

class ScriptureController extends Controller {
    private $model;
    
    public function __construct() {
        $this->model = new Scripture();
    }
    
    // 取得所有典籍
    public function getAll() {
        return $this->model->getAll();
    }
    
    // 根據 ID 取得單一典籍
    public function getById() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '典籍 ID 為必填欄位');
        }
        
        return $this->model->getById($_POST['id']);
    }
    
    // 搜尋典籍
    public function search() {
        if (!isset($_POST['keyword']) || empty($_POST['keyword'])) {
            return self::response(400, '搜尋關鍵字為必填欄位');
        }
        
        return $this->model->search($_POST['keyword']);
    }
    
    // 新增典籍
    public function create() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '典籍 ID',
            'name' => '典籍名稱'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        // 檢查 ID 是否已存在
        $existsResult = $this->model->exists($_POST['id']);
        if ($existsResult['status'] === 200 && $existsResult['result'][0]['count'] > 0) {
            return self::response(409, "典籍 ID「{$_POST['id']}」已經存在");
        }
        
        // 檢查名稱是否重複
        $nameExistsResult = $this->model->checkNameExists($_POST['name']);
        if ($nameExistsResult['status'] === 200 && $nameExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "典籍名稱「{$_POST['name']}」已經存在");
        }
        
        // 準備資料
        $data = [
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => isset($_POST['description']) ? $_POST['description'] : '',
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : $this->model->getNextOrderIndex()
        ];
        
        return $this->model->create($data);
    }
    
    // 更新典籍
    public function update() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '典籍 ID',
            'name' => '典籍名稱'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        $id = $_POST['id'];
        
        // 檢查典籍是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '典籍不存在');
        }
        
        // 檢查名稱是否重複（排除自己）
        $nameExistsResult = $this->model->checkNameExists($_POST['name'], $id);
        if ($nameExistsResult['status'] === 200 && $nameExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "典籍名稱「{$_POST['name']}」已經存在");
        }
        
        // 準備資料
        $data = [
            'name' => $_POST['name'],
            'description' => isset($_POST['description']) ? $_POST['description'] : '',
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : 0
        ];
        
        return $this->model->update($id, $data);
    }
    
    // 刪除典籍
    public function delete() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '典籍 ID 為必填欄位');
        }
        
        $id = $_POST['id'];
        
        // 檢查典籍是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '典籍不存在');
        }
        
        return $this->model->delete($id);
    }
    
    // 取得典籍的完整結構
    public function getStructure() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '典籍 ID 為必填欄位');
        }
        
        return $this->model->getStructure($_POST['id']);
    }
}

?> 