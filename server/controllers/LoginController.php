<?php

class LoginController extends Controller {
    private $model;

    public function __construct() {
        $this->model = new Login();
    }

    public function login() {
        $data = $this->getPostData(['username', 'password']);
        return $this->model->login($data['username'], $data['password']);
    }
    
    public function createUser() {
        $data = $this->getPostData(['username', 'password']);
        return $this->model->createUser($data['username'], $data['password']);
    }
    
    public function updatePassword() {
        $data = $this->getPostData(['userId', 'newPassword']);
        return $this->model->updatePassword($data['userId'], $data['newPassword']);
    }
}

?>