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
        $passwordValid = password_verify($password, $storedHash);
        
        if ($passwordValid) {
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
        // 1. 先抓舊雜湊 - 確認用戶存在
        $checkSql = "SELECT UserId, Username, PasswordHash FROM users WHERE Username = ?";
        $checkResult = DB::select($checkSql, array($username));
        
        if ($checkResult['status'] !== 200 || empty($checkResult['result'])) {
            return array('status' => 404, 'message' => '用戶不存在');
        }
        
        $user = $checkResult['result'][0];
        $oldHash = $user['PasswordHash'];
        $userId = $user['UserId'];
        
        // 2. 產生新雜湊（Argon2id）
        $newPasswordHash = password_hash($newPassword, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,    // 64MB
            'time_cost' => 4,          // 4 iterations
            'threads' => 3             // 3 threads
        ]);
        
        // 驗證新密碼雜湊是否正確產生
        if (!$newPasswordHash) {
            return array('status' => 500, 'message' => '密碼雜湊產生失敗');
        }
        
        // 驗證新雜湊是否能正確驗證原始密碼
        if (!password_verify($newPassword, $newPasswordHash)) {
            return array('status' => 500, 'message' => '雜湊驗證失敗，無法確保密碼安全性');
        }
        
        // 3. 更新資料庫
        $updateSql = "UPDATE users SET PasswordHash = ? WHERE Username = ?";
        $result = DB::update($updateSql, array($newPasswordHash, $username));
        
        if ($result['status'] === 200 || $result['status'] === 204) {
            // 4. 再次確認資料庫中的雜湊值是否正確更新
            $verifyResult = DB::select($checkSql, array($username));
            if ($verifyResult['status'] === 200 && !empty($verifyResult['result'])) {
                $updatedHash = $verifyResult['result'][0]['PasswordHash'];
                $canVerify = password_verify($newPassword, $updatedHash);
                
                return array(
                    'status' => 200, 
                    'message' => '密碼更新成功',
                    'result' => array(
                        'userId' => $userId,
                        'username' => $username,
                        'passwordChanged' => true,
                        'timestamp' => date('Y-m-d H:i:s'),
                        'newPasswordHash' => $newPasswordHash,
                        'dbVerification' => $canVerify ? '資料庫密碼驗證成功' : '資料庫密碼驗證失敗',
                        'hashMatches' => ($newPasswordHash === $updatedHash) ? '雜湊值一致' : '雜湊值不一致'
                    )
                );
            } else {
                return array('status' => 500, 'message' => '更新後驗證失敗');
            }
        } else {
            return array('status' => 500, 'message' => '密碼更新失敗：' . $result['message']);
        }
    }
}