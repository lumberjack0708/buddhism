// 資料管理器 - 使用 PHP API 
class DataManager {
  constructor() {
    this.listeners = [];
    // 修正XAMPP環境下的API路徑
    this.apiBaseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost/buddhism/api' : '/api';
    this.scripturesCache = null;
    this.qaCache = null;
    this.isLoading = false;
  }

  // 訂閱資料變化
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // 通知所有訂閱者
  notify() {
    this.listeners.forEach(callback => callback());
  }

  // API 請求通用函數
  async apiRequest(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '請求失敗');
      }

      return data;
    } catch (error) {
      console.error('API 請求錯誤:', error);
      throw error;
    }
  }

  // 初始化資料庫（檢查並載入預設資料）
  async initializeData() {
    try {
      this.isLoading = true;
      await this.apiRequest('/data/init');

      this.clearCache();
      this.notify();
    } catch (error) {
      console.error('初始化資料失敗:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // 取得典籍資料
  async getScripturesData() {
    if (this.scripturesCache) {
      return this.scripturesCache;
    }

    try {
      const response = await this.apiRequest('/scriptures');
      const scriptures = response.data || [];
      
      // 轉換為原有的物件格式以保持相容性
      const formattedData = {};
      scriptures.forEach(scripture => {
        formattedData[scripture.id] = {
          id: scripture.id,
          name: scripture.name,
          description: scripture.description,
          chapters: {}
        };
      });
      
      this.scripturesCache = formattedData;
      return formattedData;
    } catch (error) {
      console.error('取得典籍資料失敗:', error);
      return {};
    }
  }

  // 取得原始典籍陣列格式（供管理員使用）
  async getScripturesArray() {
    try {
      const response = await this.apiRequest('/scriptures');
      return response.data || [];
    } catch (error) {
      console.error('取得典籍陣列失敗:', error);
      return [];
    }
  }

  // 儲存典籍資料（新增）
  async saveScriptureData(scripture) {
    try {
      await this.apiRequest('/scriptures', {
        method: 'POST',
        body: JSON.stringify(scripture)
      });
      this.clearCache();
      this.notify();
      return true;
    } catch (error) {
      console.error('儲存典籍資料失敗:', error);
      throw error;
    }
  }

  // 更新典籍資料
  async updateScriptureData(id, scripture) {
    try {
      await this.apiRequest(`/scriptures/${id}`, {
        method: 'PUT',
        body: JSON.stringify(scripture)
      });
      this.clearCache();
      this.notify();
      return true;
    } catch (error) {
      console.error('更新典籍資料失敗:', error);
      throw error;
    }
  }

  // 刪除典籍資料
  async deleteScriptureData(id) {
    try {
      await this.apiRequest(`/scriptures/${id}`, {
        method: 'DELETE'
      });
      this.clearCache();
      this.notify();
      return true;
    } catch (error) {
      console.error('刪除典籍資料失敗:', error);
      throw error;
    }
  }

  // 取得問答資料
  async getQAData(category = null, search = null) {
    try {
      let endpoint = '/qa';
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      if (params.toString()) {
        endpoint += '?' + params.toString();
      }

      const response = await this.apiRequest(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('取得問答資料失敗:', error);
      return [];
    }
  }

  // 儲存問答資料（新增）
  async saveQAData(qa) {
    try {
      await this.apiRequest('/qa', {
        method: 'POST',
        body: JSON.stringify(qa)
      });
      this.clearCache();
      this.notify();
      return true;
    } catch (error) {
      console.error('儲存問答資料失敗:', error);
      throw error;
    }
  }

  // 更新問答資料
  async updateQAData(id, qa) {
    try {
      await this.apiRequest(`/qa/${id}`, {
        method: 'PUT',
        body: JSON.stringify(qa)
      });
      this.clearCache();
      this.notify();
      return true;
    } catch (error) {
      console.error('更新問答資料失敗:', error);
      throw error;
    }
  }

  // 刪除問答資料
  async deleteQAData(id) {
    try {
      await this.apiRequest(`/qa/${id}`, {
        method: 'DELETE'
      });
      this.clearCache();
      this.notify();
      return true;
    } catch (error) {
      console.error('刪除問答資料失敗:', error);
      throw error;
    }
  }

  // 取得典籍列表
  async getScripturesList() {
    try {
      const response = await this.apiRequest('/scriptures');
      const scriptures = response.data || [];
      
      return scriptures.map(scripture => ({
        value: scripture.id,
        label: scripture.name,
        description: scripture.description
      }));
    } catch (error) {
      console.error('取得典籍列表失敗:', error);
      return [];
    }
  }

  // 根據典籍ID取得章節列表
  async getChaptersList(scriptureId) {
    try {
      const response = await this.apiRequest(`/scriptures/${scriptureId}/chapters`);
      const chapters = response.data || [];
      
      return chapters.map(chapter => ({
        id: chapter.id,
        name: chapter.name,
        description: chapter.description
      }));
    } catch (error) {
      console.error('取得章節列表失敗:', error);
      return [];
    }
  }

  // 根據典籍ID和章節ID取得章節內容
  async getChapterContent(scriptureId, chapterId) {
    try {
      const response = await this.apiRequest(`/scriptures/${scriptureId}/chapters/${chapterId}`);
      return response.data || null;
    } catch (error) {
      console.error('取得章節內容失敗:', error);
      return null;
    }
  }

  // 搜尋經文內容
  async searchScriptures(keyword) {
    if (!keyword) return [];
    
    try {
      const response = await this.apiRequest(`/search?keyword=${encodeURIComponent(keyword)}&type=scriptures`);
      const results = response.data || [];
      
      return results.map(result => ({
        scriptureId: result.scripture_id,
        scriptureName: result.scripture_name,
        chapterId: result.chapter_id,
        chapterName: result.chapter_name,
        sectionId: result.section_id,
        sectionTitle: result.section_title,
        transcript: result.transcript || '',
        highlightedTranscript: result.highlighted_transcript || result.transcript || ''
      }));
    } catch (error) {
      console.error('搜尋經文失敗:', error);
      return [];
    }
  }

  // 取得問答分類
  async getQACategories() {
    try {
      const response = await this.apiRequest('/qa/categories');
      return response.data || [];
    } catch (error) {
      console.error('取得問答分類失敗:', error);
      return [];
    }
  }

  // 根據分類篩選問答
  async getQAByCategory(category) {
    try {
      return await this.getQAData(category);
    } catch (error) {
      console.error('根據分類篩選問答失敗:', error);
      return [];
    }
  }

  // 搜尋問答內容
  async searchQA(keyword) {
    if (!keyword) {
      return await this.getQAData();
    }
    
    try {
      return await this.getQAData(null, keyword);
    } catch (error) {
      console.error('搜尋問答失敗:', error);
      return [];
    }
  }

  // 清除所有快取
  clearCache() {
    this.scripturesCache = null;
    this.qaCache = null;
  }

  // 重設為預設資料
  async resetToDefault() {
    try {
      await this.apiRequest('/data/reset', {
        method: 'POST'
      });
      this.clearCache();
      this.notify();
      return true;
    } catch (error) {
      console.error('重設資料失敗:', error);
      throw error;
    }
  }



  // 檢查載入狀態
  isDataLoading() {
    return this.isLoading;
  }
}

// 創建單例
const dataManager = new DataManager();

// 初始化資料
dataManager.initializeData();

export default dataManager; 