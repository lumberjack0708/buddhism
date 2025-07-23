<?php

class QA {
    
    // 取得所有問答
    public function getAll() {
        $sql = "SELECT * FROM qa ORDER BY category ASC, order_index ASC";
        return DB::select($sql);
    }
    
    // 根據分類取得問答
    public function getByCategory($category) {
        $sql = "SELECT * FROM qa WHERE category = ? ORDER BY order_index ASC";
        return DB::select($sql, array($category));
    }
    
    // 根據 ID 取得單一問答
    public function getById($id) {
        $sql = "SELECT * FROM qa WHERE id = ?";
        return DB::select($sql, array($id));
    }
    
    // 搜尋問答
    public function search($keyword) {
        $sql = "SELECT * FROM qa WHERE question LIKE ? OR answer LIKE ? OR category LIKE ? ORDER BY category ASC, order_index ASC";
        $searchTerm = '%' . $keyword . '%';
        return DB::select($sql, array($searchTerm, $searchTerm, $searchTerm));
    }
    
    // 全文搜索（使用 MySQL FULLTEXT）
    public function fullTextSearch($keyword) {
        $sql = "SELECT *, MATCH(question, answer) AGAINST(? IN NATURAL LANGUAGE MODE) as score 
                FROM qa 
                WHERE MATCH(question, answer) AGAINST(? IN NATURAL LANGUAGE MODE) 
                ORDER BY score DESC, category ASC, order_index ASC";
        return DB::select($sql, array($keyword, $keyword));
    }
    
    // 新增問答
    public function create($data) {
        $sql = "INSERT INTO qa (id, category, question, answer, tags, order_index) VALUES (?, ?, ?, ?, ?, ?)";
        $args = array(
            $data['id'],
            $data['category'],
            $data['question'],
            $data['answer'],
            $data['tags'],
            $data['order_index']
        );
        return DB::insert($sql, $args);
    }
    
    // 更新問答
    public function update($id, $data) {
        $sql = "UPDATE qa SET category = ?, question = ?, answer = ?, tags = ?, order_index = ? WHERE id = ?";
        $args = array(
            $data['category'],
            $data['question'],
            $data['answer'],
            $data['tags'],
            $data['order_index'],
            $id
        );
        return DB::update($sql, $args);
    }
    
    // 刪除問答
    public function delete($id) {
        $sql = "DELETE FROM qa WHERE id = ?";
        return DB::delete($sql, array($id));
    }
    
    // 檢查問答 ID 是否存在
    public function exists($id) {
        $sql = "SELECT COUNT(*) as count FROM qa WHERE id = ?";
        return DB::select($sql, array($id));
    }
    
    // 檢查問題是否重複
    public function checkQuestionExists($question, $excludeId = null) {
        if ($excludeId) {
            $sql = "SELECT COUNT(*) as count FROM qa WHERE question = ? AND id != ?";
            return DB::select($sql, array($question, $excludeId));
        } else {
            $sql = "SELECT COUNT(*) as count FROM qa WHERE question = ?";
            return DB::select($sql, array($question));
        }
    }
    
    // 取得所有分類
    public function getCategories() {
        $sql = "SELECT DISTINCT category FROM qa ORDER BY category ASC";
        return DB::select($sql);
    }
    
    // 根據標籤搜尋
    public function getByTag($tag) {
        $sql = "SELECT * FROM qa WHERE JSON_CONTAINS(tags, JSON_QUOTE(?)) ORDER BY category ASC, order_index ASC";
        return DB::select($sql, array($tag));
    }
    
    // 取得所有標籤
    public function getAllTags() {
        $sql = "SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(tags, CONCAT('$[', idx, ']'))) as tag
                FROM qa 
                CROSS JOIN (
                    SELECT 0 as idx UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION 
                    SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION 
                    SELECT 8 UNION SELECT 9
                ) as indexes
                WHERE JSON_EXTRACT(tags, CONCAT('$[', idx, ']')) IS NOT NULL
                ORDER BY tag";
        return DB::select($sql);
    }
    
    // 取得隨機問答
    public function getRandom($limit = 5) {
        $sql = "SELECT * FROM qa ORDER BY RAND() LIMIT ?";
        return DB::select($sql, array($limit));
    }
    
    // 取得下一個排序編號（在特定分類中）
    public function getNextOrderIndex($category) {
        $sql = "SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM qa WHERE category = ?";
        $result = DB::select($sql, array($category));
        if ($result['status'] === 200 && !empty($result['result'])) {
            return $result['result'][0]['next_order'];
        }
        return 1;
    }
}

?> 