import { scripturesData } from './scriptures';
import { qaData as qaOriginalData } from './qa';

// 資料管理器
class DataManager {
  constructor() {
    this.isUsingExampleData = true;
    this.listeners = [];
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
    this.listeners.forEach(callback => callback(this.isUsingExampleData));
  }

  // 切換資料模式
  toggleDataMode() {
    this.isUsingExampleData = !this.isUsingExampleData;
    this.notify();
    return this.isUsingExampleData;
  }

  // 設置資料模式
  setDataMode(useExampleData) {
    this.isUsingExampleData = useExampleData;
    this.notify();
  }

  // 取得當前資料模式
  getDataMode() {
    return this.isUsingExampleData;
  }

  // 取得典籍資料
  getScripturesData() {
    if (this.isUsingExampleData) {
      return scripturesData;
    } else {
      const savedData = localStorage.getItem('adminScriptures');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // 轉換格式以符合原始結構
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
          return formattedData;
        } catch (error) {
          console.error('解析管理員典籍資料失敗:', error);
          return {};
        }
      }
      return {};
    }
  }

  // 取得問答資料
  getQAData() {
    if (this.isUsingExampleData) {
      return qaOriginalData;
    } else {
      const savedData = localStorage.getItem('adminQA');
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (error) {
          console.error('解析管理員問答資料失敗:', error);
          return [];
        }
      }
      return [];
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
}

// 創建單例
const dataManager = new DataManager();

export default dataManager; 