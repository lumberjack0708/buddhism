<?php

abstract class Controller {
    
    protected static function response($status, $message, $result = null, $insertId = null) {
        $resp = array(
            'status' => $status,
            'message' => $message,
            'result' => $result
        );
        
        if ($insertId !== null) {
            $resp['insert_id'] = $insertId;
        }
        
        return $resp;
    }
    
    protected function validateRequired($fields) {
        $errors = array();
        
        foreach ($fields as $field => $label) {
            if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
                $errors[] = $label . "為必填欄位";
            }
        }
        
        if (!empty($errors)) {
            return self::response(400, implode("、", $errors));
        }
        
        return true;
    }
    
    protected function getPostData($fields) {
        $data = array();
        foreach ($fields as $field) {
            $data[$field] = isset($_POST[$field]) ? trim($_POST[$field]) : null;
        }
        return $data;
    }
    
    protected function getRequestMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    /**
     * 驗證安全碼：根據今日日期產生特定數字並檢查是否能被11整除
     * 例如：今日0819 -> 重組為9801 -> 加一位數使其能被11整除
     */
    protected function validateSecurityCode($securityCode) {
        if (empty($securityCode) || !is_numeric($securityCode)) {
            return array('status' => 400, 'message' => '安全驗證碼格式錯誤');
        }
        
        // 取得今日日期，格式 MMDD
        $today = date('md'); // 例如：0819
        
        // 重組日期：將月份和日期拆開重組（MMDD -> DDMM）
        $month = substr($today, 0, 2);
        $day = substr($today, 2, 2);
        $rearranged = $day . $month; // 例如：9801
        
        // 將重組的數字轉為整數
        $baseNumber = intval($rearranged);
        
        // 檢查提供的安全碼是否符合規則
        $providedCode = intval($securityCode);
        
        // 檢查是否以重組的日期開頭，且能被11整除
        $codeStr = strval($providedCode);
        $rearrangedStr = strval($baseNumber);
        
        // 驗證：安全碼必須以重組日期開頭
        if (strpos($codeStr, $rearrangedStr) !== 0) {
            return array('status' => 400, 'message' => '安全驗證碼錯誤');
        }
        
        // 驗證：安全碼必須能被11整除
        if ($providedCode % 11 !== 0) {
            return array('status' => 400, 'message' => '安全驗證碼錯誤');
        }
        
        return array('status' => 200, 'message' => '安全驗證通過');
    }
    
    /**
     * 產生今日有效的安全碼範例（用於測試或提示）
     */
    protected function generateValidSecurityCode() {
        $today = date('md');
        $month = substr($today, 0, 2);
        $day = substr($today, 2, 2);
        $rearranged = intval($day . $month);
        
        // 找出能讓數字被11整除的最小附加位數
        for ($i = 0; $i <= 9; $i++) {
            $candidate = intval($rearranged . $i);
            if ($candidate % 11 === 0) {
                return $candidate;
            }
        }
        
        // 如果單位數不行，嘗試兩位數
        for ($i = 10; $i <= 99; $i++) {
            $candidate = intval($rearranged . str_pad($i, 2, '0', STR_PAD_LEFT));
            if ($candidate % 11 === 0) {
                return $candidate;
            }
        }
        
        return null; // 理論上不會到這裡
    }
}

?> 