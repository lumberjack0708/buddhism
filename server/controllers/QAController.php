<?php

class QAController extends Controller {
    private $model;
    
    public function __construct() {
        $this->model = new QA();
    }
    
    // 取得所有問答
    public function getAll() {
        return $this->model->getAll();
    }
    
    // 根據分類取得問答
    public function getByCategory() {
        if (!isset($_POST['category']) || empty($_POST['category'])) {
            return self::response(400, '分類為必填欄位');
        }
        
        return $this->model->getByCategory($_POST['category']);
    }
    
    // 根據 ID 取得單一問答
    public function getById() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '問答 ID 為必填欄位');
        }
        
        return $this->model->getById($_POST['id']);
    }
    
    // 搜尋問答
    public function search() {
        if (!isset($_POST['keyword']) || empty($_POST['keyword'])) {
            return self::response(400, '搜尋關鍵字為必填欄位');
        }
        
        return $this->model->search($_POST['keyword']);
    }
    
    // 全文搜索
    public function fullTextSearch() {
        if (!isset($_POST['keyword']) || empty($_POST['keyword'])) {
            return self::response(400, '搜尋關鍵字為必填欄位');
        }
        
        return $this->model->fullTextSearch($_POST['keyword']);
    }
    
    // 根據標籤搜尋
    public function getByTag() {
        if (!isset($_POST['tag']) || empty($_POST['tag'])) {
            return self::response(400, '標籤為必填欄位');
        }
        
        return $this->model->getByTag($_POST['tag']);
    }
    
    // 取得所有分類
    public function getCategories() {
        return $this->model->getCategories();
    }
    
    // 取得所有標籤
    public function getAllTags() {
        return $this->model->getAllTags();
    }
    
    // 取得隨機問答
    public function getRandom() {
        $limit = isset($_POST['limit']) && is_numeric($_POST['limit']) ? (int)$_POST['limit'] : 5;
        return $this->model->getRandom($limit);
    }
    
    // 新增問答
    public function create() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '問答 ID',
            'category' => '分類',
            'question' => '問題',
            'answer' => '答案'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        // 檢查問答 ID 是否已存在
        $existsResult = $this->model->exists($_POST['id']);
        if ($existsResult['status'] === 200 && $existsResult['result'][0]['count'] > 0) {
            return self::response(409, "問答 ID「{$_POST['id']}」已經存在");
        }
        
        // 檢查問題是否重複
        $questionExistsResult = $this->model->checkQuestionExists($_POST['question']);
        if ($questionExistsResult['status'] === 200 && $questionExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "問題「{$_POST['question']}」已經存在");
        }
        
        // 處理標籤（確保是 JSON 格式）
        $tags = '[]';
        if (isset($_POST['tags']) && !empty($_POST['tags'])) {
            if (is_array($_POST['tags'])) {
                $tags = json_encode($_POST['tags'], JSON_UNESCAPED_UNICODE);
            } else {
                // 如果是字串，嘗試解析為 JSON
                $decoded = json_decode($_POST['tags'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $tags = $_POST['tags'];
                } else {
                    // 如果不是有效的 JSON，將其作為單一標籤
                    $tags = json_encode([$_POST['tags']], JSON_UNESCAPED_UNICODE);
                }
            }
        }
        
        // 準備資料
        $data = [
            'id' => $_POST['id'],
            'category' => $_POST['category'],
            'question' => $_POST['question'],
            'answer' => $_POST['answer'],
            'tags' => $tags,
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : $this->model->getNextOrderIndex($_POST['category'])
        ];
        
        return $this->model->create($data);
    }
    
    // 更新問答
    public function update() {
        // 驗證必填欄位
        $validation = $this->validateRequired([
            'id' => '問答 ID',
            'category' => '分類',
            'question' => '問題',
            'answer' => '答案'
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        $id = $_POST['id'];
        
        // 檢查問答是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '問答不存在');
        }
        
        // 檢查問題是否重複（排除自己）
        $questionExistsResult = $this->model->checkQuestionExists($_POST['question'], $id);
        if ($questionExistsResult['status'] === 200 && $questionExistsResult['result'][0]['count'] > 0) {
            return self::response(409, "問題「{$_POST['question']}」已經存在");
        }
        
        // 處理標籤（確保是 JSON 格式）
        $tags = '[]';
        if (isset($_POST['tags']) && !empty($_POST['tags'])) {
            if (is_array($_POST['tags'])) {
                $tags = json_encode($_POST['tags'], JSON_UNESCAPED_UNICODE);
            } else {
                // 如果是字串，嘗試解析為 JSON
                $decoded = json_decode($_POST['tags'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $tags = $_POST['tags'];
                } else {
                    // 如果不是有效的 JSON，將其作為單一標籤
                    $tags = json_encode([$_POST['tags']], JSON_UNESCAPED_UNICODE);
                }
            }
        }
        
        // 準備資料
        $data = [
            'category' => $_POST['category'],
            'question' => $_POST['question'],
            'answer' => $_POST['answer'],
            'tags' => $tags,
            'order_index' => isset($_POST['order_index']) && is_numeric($_POST['order_index']) 
                ? (int)$_POST['order_index'] 
                : 0
        ];
        
        return $this->model->update($id, $data);
    }
    
    // 刪除問答
    public function delete() {
        if (!isset($_POST['id']) || empty($_POST['id'])) {
            return self::response(400, '問答 ID 為必填欄位');
        }
        
        $id = $_POST['id'];
        
        // 檢查問答是否存在
        $existsResult = $this->model->exists($id);
        if ($existsResult['status'] !== 200 || $existsResult['result'][0]['count'] === 0) {
            return self::response(404, '問答不存在');
        }
        
        return $this->model->delete($id);
    }
}

?> 