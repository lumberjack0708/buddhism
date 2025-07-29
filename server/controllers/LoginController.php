<?php

class LoginController extends Controller {
    private $model;

    public function __construct() {
        $this->model = new Login();
    }

    public function login() {
        $data = $this->getPostData(['username', 'password']);
        
        // 檢查必要參數
        if (empty($data['username']) || empty($data['password'])) {
            return array('status' => 400, 'message' => '用戶名和密碼為必填項目');
        }
        
        return $this->model->login($data['username'], $data['password']);
    }
    
    public function createUser() {
        $data = $this->getPostData(['username', 'password']);
        
        // 檢查必要參數
        if (empty($data['username']) || empty($data['password'])) {
            return array('status' => 400, 'message' => '用戶名和密碼為必填項目');
        }
        
        return $this->model->createUser($data['username'], $data['password']);
    }
    
    public function updatePassword() {
        $data = $this->getPostData(['username', 'newPassword']);
        
        // 檢查必要參數
        if (empty($data['username']) || empty($data['newPassword'])) {
            return array('status' => 400, 'message' => '用戶名和新密碼為必填項目');
        }
        
        // 檢查新密碼長度
        if (strlen($data['newPassword']) < 4) {
            return array('status' => 400, 'message' => '新密碼長度不能少於4個字符');
        }
        
        return $this->model->updatePassword($data['username'], $data['newPassword']);
    }
}

?>