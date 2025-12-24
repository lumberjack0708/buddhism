<?php

class Theme {
    
    // 取得所有主題
    public function getAll() {
        $sql = "SELECT t.*, sec.title as section_title, c.name as chapter_name, s.name as scripture_name 
                FROM themes t 
                LEFT JOIN sections sec ON t.section_id = sec.id 
                LEFT JOIN chapters c ON sec.chapter_id = c.id 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                ORDER BY s.order_index ASC, c.order_index ASC, sec.order_index ASC, t.order_index ASC";
        return DB::select($sql);
    }
    
    // 根據小節 ID 取得主題
    public function getBySectionId($sectionId) {
        $sql = "SELECT * FROM themes WHERE section_id = ? ORDER BY order_index ASC";
        return DB::select($sql, array($sectionId));
    }
    
    // 根據 ID 取得單一主題
    public function getById($id) {
        $sql = "SELECT t.*, sec.title as section_title, c.name as chapter_name, s.name as scripture_name 
                FROM themes t 
                LEFT JOIN sections sec ON t.section_id = sec.id 
                LEFT JOIN chapters c ON sec.chapter_id = c.id 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                WHERE t.id = ?";
        return DB::select($sql, array($id));
    }
    
    // 搜尋主題
    public function search($keyword) {
        $sql = "SELECT t.*, sec.title as section_title, c.name as chapter_name, s.name as scripture_name 
                FROM themes t 
                LEFT JOIN sections sec ON t.section_id = sec.id 
                LEFT JOIN chapters c ON sec.chapter_id = c.id 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                WHERE t.name LIKE ? OR t.outline LIKE ? OR t.transcript LIKE ? OR t.verbatim_transcript LIKE ?
                ORDER BY s.order_index ASC, c.order_index ASC, sec.order_index ASC, t.order_index ASC";
        $searchTerm = '%' . $keyword . '%';
        return DB::select($sql, array($searchTerm, $searchTerm, $searchTerm, $searchTerm));
    }
    
    // 新增主題
    public function create($data) {
        $sql = "INSERT INTO themes (id, section_id, name, outline, key_points, transcript, verbatim_transcript, youtube_id, order_index) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $args = array(
            $data['id'],
            $data['section_id'],
            $data['name'],
            $data['outline'],
            $data['key_points'],
            $data['transcript'],
            $data['verbatim_transcript'],
            $data['youtube_id'],
            $data['order_index']
        );
        return DB::insert($sql, $args);
    }
    
    // 更新主題
    public function update($id, $data) {
        $sql = "UPDATE themes SET section_id = ?, name = ?, outline = ?, key_points = ?, transcript = ?, verbatim_transcript = ?, youtube_id = ?, order_index = ? WHERE id = ?";
        $args = array(
            $data['section_id'],
            $data['name'],
            $data['outline'],
            $data['key_points'],
            $data['transcript'],
            $data['verbatim_transcript'],
            $data['youtube_id'],
            $data['order_index'],
            $id
        );
        return DB::update($sql, $args);
    }
    
    // 刪除主題
    public function delete($id) {
        $sql = "DELETE FROM themes WHERE id = ?";
        return DB::delete($sql, array($id));
    }
    
    // 檢查主題 ID 是否存在
    public function exists($id) {
        $sql = "SELECT COUNT(*) as count FROM themes WHERE id = ?";
        return DB::select($sql, array($id));
    }
    
    // 檢查主題名稱在同一小節中是否重複
    public function checkNameExists($sectionId, $name, $excludeId = null) {
        if ($excludeId) {
            $sql = "SELECT COUNT(*) as count FROM themes WHERE section_id = ? AND name = ? AND id != ?";
            return DB::select($sql, array($sectionId, $name, $excludeId));
        } else {
            $sql = "SELECT COUNT(*) as count FROM themes WHERE section_id = ? AND name = ?";
            return DB::select($sql, array($sectionId, $name));
        }
    }
    
    // 根據 YouTube ID 搜尋
    public function getByYoutubeId($youtubeId) {
        $sql = "SELECT t.*, sec.title as section_title, c.name as chapter_name, s.name as scripture_name 
                FROM themes t 
                LEFT JOIN sections sec ON t.section_id = sec.id 
                LEFT JOIN chapters c ON sec.chapter_id = c.id 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                WHERE t.youtube_id = ?";
        return DB::select($sql, array($youtubeId));
    }
    
    // 取得下一個排序編號（在特定小節中）
    public function getNextOrderIndex($sectionId) {
        $sql = "SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM themes WHERE section_id = ?";
        $result = DB::select($sql, array($sectionId));
        if ($result['status'] === 200 && !empty($result['result'])) {
            return $result['result'][0]['next_order'];
        }
        return 1;
    }
}