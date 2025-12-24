<?php

class Router {
    private $routeTable;
    
    public function __construct() {
        $this->routeTable = array();
    }
    
    public function register($action, $class, $method) {
        $this->routeTable[$action] = array(
            'class' => $class,
            'method' => $method
        );
    }
    
    public function run($action) {
        if (!isset($this->routeTable[$action])) {
            return array(
                'status' => 404,
                'message' => "找不到對應的操作：$action"
            );
        }
        
        $class = $this->routeTable[$action]['class'];
        $method = $this->routeTable[$action]['method'];
        
        // 檢查類別是否存在
        if (!class_exists($class)) {
            return array(
                'status' => 500,
                'message' => "找不到控制器類別：$class"
            );
        }
        
        $controller = new $class();
        
        // 檢查方法是否存在
        if (!method_exists($controller, $method)) {
            return array(
                'status' => 500,
                'message' => "找不到控制器方法：$method"
            );
        }
        
        try {
            $response = $controller->$method();
            return $response;
        } catch (Exception $e) {
            return array(
                'status' => 500,
                'message' => "執行錯誤：" . $e->getMessage()
            );
        }
    }
    
    public function getRoutes() {
        return $this->routeTable;
    }
}