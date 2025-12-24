<?php

// 引入所有必要的檔案
require_once __DIR__ . '/bootstrap.php';

// 設定 CORS 頭部（允許跨域請求）
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// 處理 OPTIONS 請求（預檢請求）
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 建立路由器
$router = new Router();

// 載入路由配置
require_once __DIR__ . '/routes/api.php';

// 取得 action 參數
$action = 'no_action';
if (isset($_GET['action'])) {
    $action = $_GET['action'];
} elseif (isset($_POST['action'])) {
    $action = $_POST['action'];
}

// 處理請求
try {
    if ($action === 'no_action') {
        $response = [
            'status' => 400,
            'message' => '缺少 action 參數',
            'available_actions' => array_keys($router->getRoutes())
        ];
    } else {
        $response = $router->run($action);
    }
} catch (Exception $e) {
    $response = [
        'status' => 500,
        'message' => '系統錯誤: ' . $e->getMessage()
    ];
}

// 回傳 JSON 響應
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);