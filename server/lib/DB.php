<?php

class DB {
    private static $dbHost = "localhost";
    private static $dbName = "buddhism_db";
    private static $dbUser = "root";
    private static $dbPassword = "";
    private static $conn = null;
    
    public static function setConfig($host, $name, $user, $password) {
        self::$dbHost = $host;
        self::$dbName = $name;
        self::$dbUser = $user;
        self::$dbPassword = $password;
    }
    
    private static function connect() {
        if (self::$conn != null) return;
        
        $dsn = sprintf("mysql:host=%s;dbname=%s;charset=utf8mb4", self::$dbHost, self::$dbName);
        try {
            self::$conn = new PDO($dsn, self::$dbUser, self::$dbPassword);
            self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            self::$conn = null;
        }
    }
    
    public static function select($sql, $args = null) {
        self::connect();
        if (self::$conn == null) {
            return self::response(500, "無法連接資料庫");
        }
        
        try {
            $stmt = self::$conn->prepare($sql);
            $result = $stmt->execute($args);
            
            if ($result) {
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return self::response(200, "查詢成功", $rows);
            } else {
                return self::response(400, "查詢失敗");
            }
        } catch (PDOException $e) {
            return self::response(500, "SQL 錯誤: " . $e->getMessage());
        }
    }
    
    public static function insert($sql, $args = null) {
        self::connect();
        if (self::$conn == null) {
            return self::response(500, "無法連接資料庫");
        }
        
        try {
            $stmt = self::$conn->prepare($sql);
            $result = $stmt->execute($args);
            
            if ($result) {
                $count = $stmt->rowCount();
                if ($count > 0) {
                    $insertId = self::$conn->lastInsertId();
                    return self::response(200, "新增成功", null, $insertId);
                } else {
                    return self::response(400, "新增失敗");
                }
            } else {
                return self::response(400, "新增失敗");
            }
        } catch (PDOException $e) {
            return self::response(500, "SQL 錯誤: " . $e->getMessage());
        }
    }
    
    public static function update($sql, $args = null) {
        self::connect();
        if (self::$conn == null) {
            return self::response(500, "無法連接資料庫");
        }
        
        try {
            $stmt = self::$conn->prepare($sql);
            $result = $stmt->execute($args);
            
            if ($result) {
                $count = $stmt->rowCount();
                return ($count > 0) ? 
                    self::response(200, "更新成功") : 
                    self::response(204, "沒有資料被更新");
            } else {
                return self::response(400, "更新失敗");
            }
        } catch (PDOException $e) {
            return self::response(500, "SQL 錯誤: " . $e->getMessage());
        }
    }
    
    public static function delete($sql, $args = null) {
        self::connect();
        if (self::$conn == null) {
            return self::response(500, "無法連接資料庫");
        }
        
        try {
            $stmt = self::$conn->prepare($sql);
            $result = $stmt->execute($args);
            
            if ($result) {
                $count = $stmt->rowCount();
                return ($count > 0) ? 
                    self::response(200, "刪除成功") : 
                    self::response(204, "沒有資料被刪除");
            } else {
                return self::response(400, "刪除失敗");
            }
        } catch (PDOException $e) {
            return self::response(500, "SQL 錯誤: " . $e->getMessage());
        }
    }
    
    private static function response($status, $message, $result = null, $insertId = null) {
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
}

?> 