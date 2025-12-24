<?php

class Scripture {
    
    // 取得所有典籍
    public function getAll() {
        $sql = "SELECT * FROM scriptures ORDER BY order_index ASC, name ASC";
        return DB::select($sql);
    }
    
    // 根據 ID 取得單一典籍
    public function getById($id) {
        $sql = "SELECT * FROM scriptures WHERE id = ?";
        return DB::select($sql, array($id));
    }
    
    // 搜尋典籍
    public function search($keyword) {
        $sql = "SELECT * FROM scriptures WHERE name LIKE ? OR description LIKE ? ORDER BY order_index ASC";
        $searchTerm = '%' . $keyword . '%';
        return DB::select($sql, array($searchTerm, $searchTerm));
    }
    
    // 新增典籍
    public function create($data) {
        $sql = "INSERT INTO scriptures (id, name, description, order_index) VALUES (?, ?, ?, ?)";
        $args = array(
            $data['id'],
            $data['name'],
            $data['description'],
            $data['order_index']
        );
        return DB::insert($sql, $args);
    }
    
    // 更新典籍
    public function update($id, $data) {
        $sql = "UPDATE scriptures SET name = ?, description = ?, order_index = ? WHERE id = ?";
        $args = array(
            $data['name'],
            $data['description'],
            $data['order_index'],
            $id
        );
        return DB::update($sql, $args);
    }
    
    // 刪除典籍
    public function delete($id) {
        $sql = "DELETE FROM scriptures WHERE id = ?";
        return DB::delete($sql, array($id));
    }
    
    // 檢查典籍 ID 是否存在
    public function exists($id) {
        $sql = "SELECT COUNT(*) as count FROM scriptures WHERE id = ?";
        return DB::select($sql, array($id));
    }
    
    // 檢查典籍名稱是否重複
    public function checkNameExists($name, $excludeId = null) {
        if ($excludeId) {
            $sql = "SELECT COUNT(*) as count FROM scriptures WHERE name = ? AND id != ?";
            return DB::select($sql, array($name, $excludeId));
        } else {
            $sql = "SELECT COUNT(*) as count FROM scriptures WHERE name = ?";
            return DB::select($sql, array($name));
        }
    }
    
    // 取得典籍的完整結構（包含章節、小節）
    public function getStructure($id) {
        $sql = "SELECT 
                    s.id as scripture_id, s.name as scripture_name, s.description as scripture_description,
                    c.id as chapter_id, c.name as chapter_name, c.description as chapter_description,
                    sec.id as section_id, sec.title as section_title, sec.theme as section_theme
                FROM scriptures s
                LEFT JOIN chapters c ON s.id = c.scripture_id
                LEFT JOIN sections sec ON c.id = sec.chapter_id
                WHERE s.id = ?
                ORDER BY c.order_index ASC, sec.order_index ASC";
        return DB::select($sql, array($id));
    }
    
    // 取得下一個排序編號
    public function getNextOrderIndex() {
        $sql = "SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM scriptures";
        $result = DB::select($sql);
        if ($result['status'] === 200 && !empty($result['result'])) {
            return $result['result'][0]['next_order'];
        }
        return 1;
    }
}