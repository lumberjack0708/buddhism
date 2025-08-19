<?php

class LoginController extends Controller {
    private $model;

    public function __construct() {
        $this->model = new Login();
    }

    public function login() {
        $data = $this->getPostData(['username', 'password', 'securityCode', 'includeSecurityInfo']);
        
        // 檢查必要參數
        if (empty($data['username']) || empty($data['password'])) {
            return array('status' => 400, 'message' => '用戶名和密碼為必填項目');
        }
        
        // 安全驗證
        if (empty($data['securityCode'])) {
            return array('status' => 400, 'message' => '安全驗證碼為必填項目');
        }
        
        $securityValidation = $this->validateSecurityCode($data['securityCode']);
        if ($securityValidation['status'] !== 200) {
            return $securityValidation;
        }
        
        $loginResult = $this->model->login($data['username'], $data['password']);
        
        // 如果登入成功且要求包含安全驗證碼資訊
        if ($loginResult['status'] === 200 && !empty($data['includeSecurityInfo'])) {
            $securityInfo = $this->getValidSecurityCodeInternal();
            $loginResult['result']['security_info'] = $securityInfo;
        }
        
        return $loginResult;
    }
    
    public function createUser() {
        $data = $this->getPostData(['username', 'password', 'securityCode']);
        
        // 檢查必要參數
        if (empty($data['username']) || empty($data['password'])) {
            return array('status' => 400, 'message' => '用戶名和密碼為必填項目');
        }
        
        // 安全驗證
        if (empty($data['securityCode'])) {
            return array('status' => 400, 'message' => '安全驗證碼為必填項目');
        }
        
        $securityValidation = $this->validateSecurityCode($data['securityCode']);
        if ($securityValidation['status'] !== 200) {
            return $securityValidation;
        }
        
        return $this->model->createUser($data['username'], $data['password']);
    }
    
    public function updatePassword() {
        $data = $this->getPostData(['username', 'newPassword', 'securityCode']);
        
        // 檢查必要參數
        if (empty($data['username']) || empty($data['newPassword'])) {
            return array('status' => 400, 'message' => '用戶名和新密碼為必填項目');
        }
        
        // 檢查新密碼長度
        if (strlen($data['newPassword']) < 4) {
            return array('status' => 400, 'message' => '新密碼長度不能少於4個字符');
        }
        
        // 安全驗證
        if (empty($data['securityCode'])) {
            return array('status' => 400, 'message' => '安全驗證碼為必填項目');
        }
        
        $securityValidation = $this->validateSecurityCode($data['securityCode']);
        if ($securityValidation['status'] !== 200) {
            return $securityValidation;
        }
        
        return $this->model->updatePassword($data['username'], $data['newPassword']);
    }
    
    /**
     * 獲取今日有效的安全驗證碼（內部方法，不對外開放）
     */
    private function getValidSecurityCodeInternal() {
        $validCode = $this->generateValidSecurityCode();
        $today = date('md');
        $month = substr($today, 0, 2);
        $day = substr($today, 2, 2);
        $rearranged = $day . $month;
        
        return array(
            'today_date' => $today,
            'rearranged' => $rearranged,
            'valid_security_code' => $validCode
        );
    }
    
    /**
     * 特殊的安全驗證碼查詢方法（僅限登入後使用）
     * 需要先驗證用戶身份
     */
    public function getSecurityCodeWithAuth() {
        $data = $this->getPostData(['username', 'password']);
        
        // 檢查必要參數
        if (empty($data['username']) || empty($data['password'])) {
            return array('status' => 400, 'message' => '用戶名和密碼為必填項目');
        }
        
        // 先驗證用戶身份
        $loginResult = $this->model->login($data['username'], $data['password']);
        
        if ($loginResult['status'] !== 200) {
            return array('status' => 401, 'message' => '身份驗證失敗，無法查看安全驗證碼');
        }
        
        // 身份驗證成功，返回安全驗證碼資訊
        $securityInfo = $this->getValidSecurityCodeInternal();
        
        return array(
            'status' => 200,
            'message' => '安全驗證碼資訊（需身份驗證）',
            'result' => array(
                'user' => $loginResult['result']['username'],
                'security_info' => $securityInfo,
                'note' => '此功能需要身份驗證才能使用'
            )
        );
    }
}

?>