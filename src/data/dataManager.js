// 資料管理器 - 統一使用 JSON 格式
class DataManager {
  constructor() {
    this.listeners = [];
    this.scripturesCache = null;
    this.qaCache = null;
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

  // 載入預設資料
  async loadDefaultData() {
    try {
      // 載入預設典籍資料
      const scripturesResponse = await fetch('/data/default-scriptures.json');
      const defaultScriptures = await scripturesResponse.json();
      
      // 載入預設問答資料
      const qaResponse = await fetch('/data/default-qa.json');
      const defaultQA = await qaResponse.json();

      return {
        scriptures: defaultScriptures,
        qa: defaultQA
      };
    } catch (error) {
      console.error('載入預設資料失敗:', error);
      return {
        scriptures: [],
        qa: []
      };
    }
  }

  // 初始化資料（如果 localStorage 沒有資料則載入預設資料）
  async initializeData() {
    const savedScriptures = localStorage.getItem('adminScriptures');
    const savedQA = localStorage.getItem('adminQA');

    if (!savedScriptures || !savedQA) {
      const defaultData = await this.loadDefaultData();
      
      if (!savedScriptures && defaultData.scriptures.length > 0) {
        localStorage.setItem('adminScriptures', JSON.stringify(defaultData.scriptures));
        this.scripturesCache = null; // 清除快取
      }
      
      if (!savedQA && defaultData.qa.length > 0) {
        localStorage.setItem('adminQA', JSON.stringify(defaultData.qa));
        this.qaCache = null; // 清除快取
      }
      
      this.notify();
    }
  }

  // 取得典籍資料
  getScripturesData() {
    if (this.scripturesCache) {
      return this.scripturesCache;
    }

    const savedData = localStorage.getItem('adminScriptures');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // 轉換為原有的物件格式以保持相容性
        const formattedData = {};
        parsedData.forEach(scripture => {
          formattedData[scripture.id] = {
            id: scripture.id,
            name: scripture.name,
            description: scripture.description,
            chapters: {}
          };
          
          if (scripture.chapters && scripture.chapters.length > 0) {
            scripture.chapters.forEach(chapter => {
              formattedData[scripture.id].chapters[chapter.id] = chapter;
            });
          }
        });
        
        this.scripturesCache = formattedData;
        return formattedData;
      } catch (error) {
        console.error('解析典籍資料失敗:', error);
        return {};
      }
    }
    return {};
  }

  // 取得原始典籍陣列格式（供管理員使用）
  getScripturesArray() {
    const savedData = localStorage.getItem('adminScriptures');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('解析典籍資料失敗:', error);
        return [];
      }
    }
    return [];
  }

  // 儲存典籍資料
  saveScripturesData(scripturesArray) {
    try {
      localStorage.setItem('adminScriptures', JSON.stringify(scripturesArray));
      this.scripturesCache = null; // 清除快取
      this.notify();
      return true;
    } catch (error) {
      console.error('儲存典籍資料失敗:', error);
      return false;
    }
  }

  // 取得問答資料
  getQAData() {
    if (this.qaCache) {
      return this.qaCache;
    }

    const savedData = localStorage.getItem('adminQA');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        this.qaCache = parsedData;
        return parsedData;
      } catch (error) {
        console.error('解析問答資料失敗:', error);
        return [];
      }
    }
    return [];
  }

  // 儲存問答資料
  saveQAData(qaArray) {
    try {
      localStorage.setItem('adminQA', JSON.stringify(qaArray));
      this.qaCache = null; // 清除快取
      this.notify();
      return true;
    } catch (error) {
      console.error('儲存問答資料失敗:', error);
      return false;
    }
  }

  // 取得典籍列表
  getScripturesList() {
    const scripturesData = this.getScripturesData();
    return Object.values(scripturesData).map(scripture => ({
      value: scripture.id,
      label: scripture.name,
      description: scripture.description
    }));
  }

  // 根據典籍ID取得章節列表
  getChaptersList(scriptureId) {
    const scripturesData = this.getScripturesData();
    const scripture = scripturesData[scriptureId];
    if (!scripture) return [];
    
    return Object.values(scripture.chapters || {}).map(chapter => ({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description
    }));
  }

  // 根據典籍ID和章節ID取得章節內容
  getChapterContent(scriptureId, chapterId) {
    const scripturesData = this.getScripturesData();
    const scripture = scripturesData[scriptureId];
    if (!scripture || !scripture.chapters[chapterId]) return null;
    
    return scripture.chapters[chapterId];
  }

  // 搜尋經文內容
  searchScriptures(keyword) {
    if (!keyword) return [];
    
    const results = [];
    const lowerKeyword = keyword.toLowerCase();
    const scripturesData = this.getScripturesData();
    
    Object.values(scripturesData).forEach(scripture => {
      Object.values(scripture.chapters || {}).forEach(chapter => {
        (chapter.sections || []).forEach(section => {
          // 搜尋 transcript 內容
          const transcript = section.themes ? 
            section.themes[0]?.transcript || section.transcript : 
            section.transcript;
          
          if (transcript && transcript.toLowerCase().includes(lowerKeyword)) {
            results.push({
              scriptureId: scripture.id,
              scriptureName: scripture.name,
              chapterId: chapter.id,
              chapterName: chapter.name,
              sectionId: section.id,
              sectionTitle: section.title,
              transcript: transcript,
              highlightedTranscript: transcript.replace(
                new RegExp(`(${keyword})`, 'gi'),
                '<mark>$1</mark>'
              )
            });
          }
          
          // 也搜尋小節標題和綱要
          const outline = section.themes ? 
            section.themes[0]?.outline || section.outline : 
            section.outline;
          
          if (section.title.toLowerCase().includes(lowerKeyword) || 
              (outline && outline.toLowerCase().includes(lowerKeyword))) {
            const exists = results.some(r => 
              r.scriptureId === scripture.id && 
              r.chapterId === chapter.id && 
              r.sectionId === section.id
            );
            
            if (!exists) {
              results.push({
                scriptureId: scripture.id,
                scriptureName: scripture.name,
                chapterId: chapter.id,
                chapterName: chapter.name,
                sectionId: section.id,
                sectionTitle: section.title,
                transcript: transcript || '',
                highlightedTranscript: transcript || ''
              });
            }
          }
        });
      });
    });
    
    return results;
  }

  // 取得問答分類
  getQACategories() {
    const qaData = this.getQAData();
    const categories = [...new Set(qaData.map(item => item.category))];
    return categories;
  }

  // 根據分類篩選問答
  getQAByCategory(category) {
    const qaData = this.getQAData();
    if (!category) return qaData;
    return qaData.filter(item => item.category === category);
  }

  // 搜尋問答內容
  searchQA(keyword) {
    const qaData = this.getQAData();
    if (!keyword) return qaData;
    const lowerKeyword = keyword.toLowerCase();
    return qaData.filter(item => 
      item.question.toLowerCase().includes(lowerKeyword) ||
      item.answer.toLowerCase().includes(lowerKeyword) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  // 清除所有快取
  clearCache() {
    this.scripturesCache = null;
    this.qaCache = null;
  }

  // 重設為預設資料
  async resetToDefault() {
    const defaultData = await this.loadDefaultData();
    
    localStorage.setItem('adminScriptures', JSON.stringify(defaultData.scriptures));
    localStorage.setItem('adminQA', JSON.stringify(defaultData.qa));
    
    this.clearCache();
    this.notify();
    
    return true;
  }
}

// 創建單例
const dataManager = new DataManager();

// 初始化資料
dataManager.initializeData();

export default dataManager; 