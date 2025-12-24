<?php

class Chapter {
    
    // 取得所有章節
    public function getAll() {
        $sql = "SELECT c.*, s.name as scripture_name 
                FROM chapters c 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                ORDER BY s.order_index ASC, c.order_index ASC";
        return DB::select($sql);
    }
    
    // 根據典籍 ID 取得章節
    public function getByScriptureId($scriptureId) {
        $sql = "SELECT * FROM chapters WHERE scripture_id = ? ORDER BY order_index ASC";
        return DB::select($sql, array($scriptureId));
    }
    
    // 根據 ID 取得單一章節
    public function getById($id) {
        $sql = "SELECT c.*, s.name as scripture_name 
                FROM chapters c 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                WHERE c.id = ?";
        return DB::select($sql, array($id));
    }
    
    // 搜尋章節
    public function search($keyword) {
        $sql = "SELECT c.*, s.name as scripture_name 
                FROM chapters c 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                WHERE c.name LIKE ? OR c.description LIKE ? 
                ORDER BY s.order_index ASC, c.order_index ASC";
        $searchTerm = '%' . $keyword . '%';
        return DB::select($sql, array($searchTerm, $searchTerm));
    }
    
    // 新增章節
    public function create($data) {
        $sql = "INSERT INTO chapters (id, scripture_id, name, description, order_index) VALUES (?, ?, ?, ?, ?)";
        $args = array(
            $data['id'],
            $data['scripture_id'],
            $data['name'],
            $data['description'],
            $data['order_index']
        );
        return DB::insert($sql, $args);
    }
    
    // 更新章節
    public function update($id, $data) {
        $sql = "UPDATE chapters SET scripture_id = ?, name = ?, description = ?, order_index = ? WHERE id = ?";
        $args = array(
            $data['scripture_id'],
            $data['name'],
            $data['description'],
            $data['order_index'],
            $id
        );
        return DB::update($sql, $args);
    }
    
    // 刪除章節
    public function delete($id) {
        $sql = "DELETE FROM chapters WHERE id = ?";
        return DB::delete($sql, array($id));
    }
    
    // 檢查章節 ID 是否存在
    public function exists($id) {
        $sql = "SELECT COUNT(*) as count FROM chapters WHERE id = ?";
        return DB::select($sql, array($id));
    }
    
    // 檢查章節名稱在同一典籍中是否重複
    public function checkNameExists($scriptureId, $name, $excludeId = null) {
        if ($excludeId) {
            $sql = "SELECT COUNT(*) as count FROM chapters WHERE scripture_id = ? AND name = ? AND id != ?";
            return DB::select($sql, array($scriptureId, $name, $excludeId));
        } else {
            $sql = "SELECT COUNT(*) as count FROM chapters WHERE scripture_id = ? AND name = ?";
            return DB::select($sql, array($scriptureId, $name));
        }
    }
    
    // 取得章節的完整結構（包含小節和主題）
    public function getStructure($id) {
        $sql = "SELECT 
                    c.id as chapter_id, c.name as chapter_name, c.description as chapter_description,
                    s.id as scripture_id, s.name as scripture_name,
                    sec.id as section_id, sec.title as section_title, sec.theme as section_theme,
                    sec.outline as section_outline, sec.key_points as section_key_points, 
                    sec.transcript as section_transcript, sec.youtube_id as section_youtube_id,
                    sec.order_index as section_order,
                    t.id as theme_id, t.name as theme_name, t.outline as theme_outline,
                    t.key_points as theme_key_points, t.transcript as theme_transcript, 
                    t.verbatim_transcript as theme_verbatim_transcript,
                    t.youtube_id as theme_youtube_id, t.order_index as theme_order
                FROM chapters c
                LEFT JOIN scriptures s ON c.scripture_id = s.id
                LEFT JOIN sections sec ON c.id = sec.chapter_id
                LEFT JOIN themes t ON sec.id = t.section_id
                WHERE c.id = ?
                ORDER BY sec.order_index ASC, t.order_index ASC";
        return DB::select($sql, array($id));
    }
    
    // 取得下一個排序編號（在特定典籍中）
    public function getNextOrderIndex($scriptureId) {
        $sql = "SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM chapters WHERE scripture_id = ?";
        $result = DB::select($sql, array($scriptureId));
        if ($result['status'] === 200 && !empty($result['result'])) {
            return $result['result'][0]['next_order'];
        }
        return 1;
    }
}