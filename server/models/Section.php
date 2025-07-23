<?php

class Section {
    
    // 取得所有小節
    public function getAll() {
        $sql = "SELECT sec.*, c.name as chapter_name, s.name as scripture_name 
                FROM sections sec 
                LEFT JOIN chapters c ON sec.chapter_id = c.id 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                ORDER BY s.order_index ASC, c.order_index ASC, sec.order_index ASC";
        return DB::select($sql);
    }
    
    // 根據章節 ID 取得小節
    public function getByChapterId($chapterId) {
        $sql = "SELECT * FROM sections WHERE chapter_id = ? ORDER BY order_index ASC";
        return DB::select($sql, array($chapterId));
    }
    
    // 根據 ID 取得單一小節
    public function getById($id) {
        $sql = "SELECT sec.*, c.name as chapter_name, s.name as scripture_name 
                FROM sections sec 
                LEFT JOIN chapters c ON sec.chapter_id = c.id 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                WHERE sec.id = ?";
        return DB::select($sql, array($id));
    }
    
    // 搜尋小節
    public function search($keyword) {
        $searchTerm = '%' . $keyword . '%';
        
        // 搜尋小節內容
        $sectionSql = "SELECT sec.id, sec.chapter_id, sec.title, sec.theme, sec.outline, sec.key_points, sec.transcript, sec.youtube_id, sec.order_index,
                              c.name as chapter_name, 
                              s.id as scripture_id, s.name as scripture_name,
                              'section' as source_type
                       FROM sections sec 
                       LEFT JOIN chapters c ON sec.chapter_id = c.id 
                       LEFT JOIN scriptures s ON c.scripture_id = s.id 
                       WHERE sec.title LIKE ? OR sec.theme LIKE ? OR sec.outline LIKE ? OR sec.transcript LIKE ?";
        
        // 搜尋主題內容
        $themeSql = "SELECT sec.id, sec.chapter_id, sec.title, t.name as theme, t.outline, t.key_points, t.transcript, t.youtube_id, sec.order_index,
                            c.name as chapter_name, 
                            s.id as scripture_id, s.name as scripture_name,
                            'theme' as source_type
                     FROM themes t
                     LEFT JOIN sections sec ON t.section_id = sec.id
                     LEFT JOIN chapters c ON sec.chapter_id = c.id 
                     LEFT JOIN scriptures s ON c.scripture_id = s.id 
                     WHERE t.name LIKE ? OR t.outline LIKE ? OR t.key_points LIKE ? OR t.transcript LIKE ?";
        
        // 合併查詢
        $sql = "($sectionSql) UNION ($themeSql) ORDER BY scripture_id ASC, chapter_id ASC, order_index ASC";
        
        return DB::select($sql, array(
            $searchTerm, $searchTerm, $searchTerm, $searchTerm, // section 參數
            $searchTerm, $searchTerm, $searchTerm, $searchTerm  // theme 參數
        ));
    }
    
    // 新增小節
    public function create($data) {
        $sql = "INSERT INTO sections (id, chapter_id, title, theme, outline, key_points, transcript, youtube_id, order_index) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $args = array(
            $data['id'],
            $data['chapter_id'],
            $data['title'],
            $data['theme'],
            $data['outline'],
            $data['key_points'],
            $data['transcript'],
            $data['youtube_id'],
            $data['order_index']
        );
        return DB::insert($sql, $args);
    }
    
    // 更新小節
    public function update($id, $data) {
        $sql = "UPDATE sections SET chapter_id = ?, title = ?, theme = ?, outline = ?, key_points = ?, transcript = ?, youtube_id = ?, order_index = ? WHERE id = ?";
        $args = array(
            $data['chapter_id'],
            $data['title'],
            $data['theme'],
            $data['outline'],
            $data['key_points'],
            $data['transcript'],
            $data['youtube_id'],
            $data['order_index'],
            $id
        );
        return DB::update($sql, $args);
    }
    
    // 刪除小節
    public function delete($id) {
        $sql = "DELETE FROM sections WHERE id = ?";
        return DB::delete($sql, array($id));
    }
    
    // 檢查小節 ID 是否存在
    public function exists($id) {
        $sql = "SELECT COUNT(*) as count FROM sections WHERE id = ?";
        return DB::select($sql, array($id));
    }
    
    // 檢查小節標題在同一章節中是否重複
    public function checkTitleExists($chapterId, $title, $excludeId = null) {
        if ($excludeId) {
            $sql = "SELECT COUNT(*) as count FROM sections WHERE chapter_id = ? AND title = ? AND id != ?";
            return DB::select($sql, array($chapterId, $title, $excludeId));
        } else {
            $sql = "SELECT COUNT(*) as count FROM sections WHERE chapter_id = ? AND title = ?";
            return DB::select($sql, array($chapterId, $title));
        }
    }
    
    // 取得小節的完整結構（包含主題）
    public function getStructure($id) {
        $sql = "SELECT 
                    sec.*, 
                    c.name as chapter_name, 
                    s.name as scripture_name,
                    t.id as theme_id, t.name as theme_name, t.outline as theme_outline
                FROM sections sec
                LEFT JOIN chapters c ON sec.chapter_id = c.id
                LEFT JOIN scriptures s ON c.scripture_id = s.id
                LEFT JOIN themes t ON sec.id = t.section_id
                WHERE sec.id = ?
                ORDER BY t.order_index ASC";
        return DB::select($sql, array($id));
    }
    
    // 根據 YouTube ID 搜尋
    public function getByYoutubeId($youtubeId) {
        $sql = "SELECT sec.*, c.name as chapter_name, s.name as scripture_name 
                FROM sections sec 
                LEFT JOIN chapters c ON sec.chapter_id = c.id 
                LEFT JOIN scriptures s ON c.scripture_id = s.id 
                WHERE sec.youtube_id = ?";
        return DB::select($sql, array($youtubeId));
    }
    
    // 取得下一個排序編號（在特定章節中）
    public function getNextOrderIndex($chapterId) {
        $sql = "SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM sections WHERE chapter_id = ?";
        $result = DB::select($sql, array($chapterId));
        if ($result['status'] === 200 && !empty($result['result'])) {
            return $result['result'][0]['next_order'];
        }
        return 1;
    }
}

?> 