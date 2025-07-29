/* global Qs */
import Request from './Request';
import { getApiUrl } from '../config';

class ApiManager {
  constructor() {
    this.listeners = [];
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

  // 清除所有快取
  clearCache() {
    this.scripturesCache = null;
    this.qaCache = null;
  }

  // 取得典籍資料
  async getScripturesData() {
    if (this.scripturesCache) {
      return this.scripturesCache;
    }

    try {
      const response = await Request().post(
        getApiUrl('getScriptures'),
        Qs.stringify({})
      );
      
      if (response.data.status === 200) {
        const scriptures = response.data.result || [];
        
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
      } else {
        console.error('取得典籍資料失敗:', response.data.message);
        return {};
      }
    } catch (error) {
      console.error('取得典籍資料失敗:', error);
      return {};
    }
  }

  // 取得原始典籍陣列格式（供管理員使用）
  async getScripturesArray() {
    try {
      const response = await Request().post(
        getApiUrl('getScriptures'),
        Qs.stringify({})
      );
      
      if (response.data.status === 200) {
        return response.data.result || [];
      } else {
        console.error('取得典籍陣列失敗:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('取得典籍陣列失敗:', error);
      return [];
    }
  }

  // 儲存典籍資料（新增）
  async saveScriptureData(scripture) {
    try {
      const response = await Request().post(
        getApiUrl('saveScripture'),
        Qs.stringify(scripture)
      );
      
      if (response.data.status === 200) {
        this.clearCache();
        this.notify();
        return true;
      } else {
        throw new Error(response.data.message || '儲存典籍資料失敗');
      }
    } catch (error) {
      console.error('儲存典籍資料失敗:', error);
      throw error;
    }
  }

  // 更新典籍資料
  async updateScriptureData(id, scripture) {
    try {
      const response = await Request().post(
        getApiUrl('updateScripture'),
        Qs.stringify({ id, ...scripture })
      );
      
      if (response.data.status === 200) {
        this.clearCache();
        this.notify();
        return true;
      } else {
        throw new Error(response.data.message || '更新典籍資料失敗');
      }
    } catch (error) {
      console.error('更新典籍資料失敗:', error);
      throw error;
    }
  }

  // 刪除典籍資料
  async deleteScriptureData(id) {
    try {
      const response = await Request().post(
        getApiUrl('deleteScripture'),
        Qs.stringify({ id })
      );
      
      if (response.data.status === 200) {
        this.clearCache();
        this.notify();
        return true;
      } else {
        throw new Error(response.data.message || '刪除典籍資料失敗');
      }
    } catch (error) {
      console.error('刪除典籍資料失敗:', error);
      throw error;
    }
  }

  // 取得問答資料
  async getQAData(category = null, search = null) {
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await Request().post(
        getApiUrl('getQA'),
        Qs.stringify(params)
      );
      
      if (response.data.status === 200) {
        return response.data.result || [];
      } else {
        console.error('取得問答資料失敗:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('取得問答資料失敗:', error);
      return [];
    }
  }

  // 儲存問答資料（新增）
  async saveQAData(qa) {
    try {
      const response = await Request().post(
        getApiUrl('saveQA'),
        Qs.stringify(qa)
      );
      
      if (response.data.status === 200) {
        this.clearCache();
        this.notify();
        return true;
      } else {
        throw new Error(response.data.message || '儲存問答資料失敗');
      }
    } catch (error) {
      console.error('儲存問答資料失敗:', error);
      throw error;
    }
  }

  // 更新問答資料
  async updateQAData(id, qa) {
    try {
      const response = await Request().post(
        getApiUrl('updateQA'),
        Qs.stringify({ id, ...qa })
      );
      
      if (response.data.status === 200) {
        this.clearCache();
        this.notify();
        return true;
      } else {
        throw new Error(response.data.message || '更新問答資料失敗');
      }
    } catch (error) {
      console.error('更新問答資料失敗:', error);
      throw error;
    }
  }

  // 刪除問答資料
  async deleteQAData(id) {
    try {
      const response = await Request().post(
        getApiUrl('deleteQA'),
        Qs.stringify({ id })
      );
      
      if (response.data.status === 200) {
        this.clearCache();
        this.notify();
        return true;
      } else {
        throw new Error(response.data.message || '刪除問答資料失敗');
      }
    } catch (error) {
      console.error('刪除問答資料失敗:', error);
      throw error;
    }
  }

  // 取得典籍列表
  async getScripturesList() {
    try {
      const response = await Request().post(
        getApiUrl('getScripturesList'),
        Qs.stringify({})
      );
      
      if (response.data.status === 200) {
        const scriptures = response.data.result || [];
        return scriptures.map(scripture => ({
          value: scripture.id,
          label: scripture.name,
          description: scripture.description
        }));
      } else {
        console.error('取得典籍列表失敗:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('取得典籍列表失敗:', error);
      return [];
    }
  }

  // 根據典籍ID取得章節列表
  async getChaptersList(scriptureId) {
    try {
      const response = await Request().post(
        getApiUrl('getChapters'),
        Qs.stringify({ scriptureId })
      );
      
      if (response.data.status === 200) {
        const chapters = response.data.result || [];
        return chapters.map(chapter => ({
          id: chapter.id,
          name: chapter.name,
          description: chapter.description
        }));
      } else {
        console.error('取得章節列表失敗:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('取得章節列表失敗:', error);
      return [];
    }
  }

  // 根據典籍ID和章節ID取得章節內容
  async getChapterContent(scriptureId, chapterId) {
    try {
      const response = await Request().post(
        getApiUrl('getChapterContent'),
        Qs.stringify({ scriptureId, chapterId })
      );
      
      if (response.data.status === 200) {
        return response.data.result || null;
      } else {
        console.error('取得章節內容失敗:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('取得章節內容失敗:', error);
      return null;
    }
  }

  // 搜尋經文內容
  async searchScriptures(keyword) {
    if (!keyword) return [];
    
    try {
      const response = await Request().post(
        getApiUrl('searchScriptures'),
        Qs.stringify({ keyword })
      );
      
      if (response.data.status === 200) {
        const results = response.data.result || [];
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
      } else {
        console.error('搜尋經文失敗:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('搜尋經文失敗:', error);
      return [];
    }
  }

  // 取得問答分類
  async getQACategories() {
    try {
      const response = await Request().post(
        getApiUrl('getQACategories'),
        Qs.stringify({})
      );
      
      if (response.data.status === 200) {
        return response.data.result || [];
      } else {
        console.error('取得問答分類失敗:', response.data.message);
        return [];
      }
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



  // 檢查載入狀態
  isDataLoading() {
    return this.isLoading;
  }

  // 管理員登入
  async adminLogin(username, password) {
    try {
      const response = await Request().post(
        getApiUrl('login'),
        Qs.stringify({ username, password })
      );
      
      if (response.data.status === 200) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || '登入失敗'
        };
      }
    } catch (error) {
      console.error('登入請求失敗:', error);
      return {
        success: false,
        message: '網路連線錯誤，請稍後再試'
      };
    }
  }
}

// 創建單例
const apiManager = new ApiManager();

export default apiManager; 