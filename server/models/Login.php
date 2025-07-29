<?php

class Login {
    public function login($username, $password) {
        // 先查詢用戶是否存在
        $sql = "SELECT UserId, Username, PasswordHash FROM users WHERE Username = ?";
        $result = DB::select($sql, array($username));
        
        if ($result['status'] !== 200 || empty($result['result'])) {
            return array('status' => 401, 'message' => '用戶名或密碼錯誤');
        }
        
        $user = $result['result'][0];
        $storedHash = $user['PasswordHash'];
        
        // 使用 Argon2 驗證密碼
        if (password_verify($password, $storedHash)) {
            // 登入成功，返回用戶資訊（不包含密碼雜湊）
            return array(
                'status' => 200, 
                'message' => '登入成功',
                'result' => array(
                    'userId' => $user['UserId'],
                    'username' => $user['Username']
                )
            );
        } else {
            return array('status' => 401, 'message' => '用戶名或密碼錯誤');
        }
    }
    
    public function createUser($username, $password) {
        // 檢查用戶名是否已存在
        $checkSql = "SELECT COUNT(*) as count FROM users WHERE Username = ?";
        $checkResult = DB::select($checkSql, array($username));
        
        if ($checkResult['status'] !== 200) {
            return array('status' => 500, 'message' => '檢查用戶名時發生錯誤');
        }
        
        if ($checkResult['result'][0]['count'] > 0) {
            return array('status' => 400, 'message' => '用戶名已存在');
        }
        
        // 使用 Argon2 雜湊密碼
        $passwordHash = password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,    // 64MB
            'time_cost' => 4,          // 4 iterations
            'threads' => 3             // 3 threads
        ]);
        
        // 插入新用戶
        $sql = "INSERT INTO users (Username, PasswordHash) VALUES (?, ?)";
        $result = DB::insert($sql, array($username, $passwordHash));
        
        if ($result['status'] === 200) {
            return array(
                'status' => 200, 
                'message' => '用戶創建成功',
                'result' => array(
                    'userId' => $result['insert_id'],
                    'username' => $username
                )
            );
        } else {
            return array('status' => 500, 'message' => '創建用戶失敗');
        }
    }
    
    public function updatePassword($username, $newPassword) {
        // 使用 Argon2 雜湊新密碼
        $passwordHash = password_hash($newPassword, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,    // 64MB
            'time_cost' => 4,          // 4 iterations
            'threads' => 3             // 3 threads
        ]);

        // 依帳號更新密碼
        $sql = "UPDATE users SET PasswordHash = ? WHERE Username = ?";
        $result = DB::update($sql, array($passwordHash, $username));
        
        if ($result['status'] === 200 || $result['status'] === 204) {
            return array('status' => 200, 'message' => '密碼更新成功');
        } else {
            return array('status' => 500, 'message' => '密碼更新失敗');
        }
    }
}

?>