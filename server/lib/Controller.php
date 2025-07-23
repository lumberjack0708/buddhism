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
}

?> 