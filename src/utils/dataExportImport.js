// 資料匯出匯入工具
import { message } from 'antd';

/**
 * 匯出資料到JSON檔案
 */
export const exportToJSON = (data, filename = 'buddhism_data') => {
  try {
    // 準備匯出的資料結構
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      scriptures: data.scriptures || [],
      qa: data.qa || [],
      metadata: {
        totalScriptures: data.scriptures?.length || 0,
        totalQA: data.qa?.length || 0,
        description: '佛法教學網站資料備份'
      }
    };

    // 轉換為JSON字串
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // 創建Blob物件
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 創建下載連結
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    
    // 觸發下載
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 清理URL物件
    URL.revokeObjectURL(url);
    
    message.success('資料匯出成功！檔案已下載');
    return true;
  } catch (error) {
    console.error('匯出失敗:', error);
    message.error('資料匯出失敗，請稍後再試');
    return false;
  }
};

/**
 * 從JSON檔案匯入資料
 */
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      message.error('請選擇一個JSON檔案');
      reject(new Error('沒有選擇檔案'));
      return;
    }

    // 檢查檔案類型
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      message.error('請選擇JSON格式的檔案');
      reject(new Error('檔案格式不正確'));
      return;
    }

    // 檢查檔案大小 (限制10MB)
    if (file.size > 10 * 1024 * 1024) {
      message.error('檔案過大，請選擇小於10MB的檔案');
      reject(new Error('檔案過大'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        
        // 驗證資料結構
        if (!validateImportData(jsonData)) {
          message.error('JSON檔案格式不正確，請檢查檔案內容');
          reject(new Error('資料格式驗證失敗'));
          return;
        }

        message.success('資料匯入成功！');
        resolve(jsonData);
      } catch (error) {
        console.error('解析JSON失敗:', error);
        message.error('JSON檔案格式錯誤，無法解析');
        reject(error);
      }
    };

    reader.onerror = () => {
      message.error('讀取檔案失敗');
      reject(new Error('檔案讀取失敗'));
    };

    reader.readAsText(file, 'UTF-8');
  });
};

/**
 * 驗證匯入資料的結構
 */
const validateImportData = (data) => {
  try {
    // 基本結構檢查
    if (!data || typeof data !== 'object') {
      return false;
    }

    // 檢查必要欄位
    if (!data.hasOwnProperty('scriptures') || !data.hasOwnProperty('qa')) {
      return false;
    }

    // 檢查典籍資料結構
    if (data.scriptures && Array.isArray(data.scriptures)) {
      for (const scripture of data.scriptures) {
        if (!scripture.id || !scripture.name) {
          return false;
        }
      }
    }

    // 檢查問答資料結構
    if (data.qa && Array.isArray(data.qa)) {
      for (const qa of data.qa) {
        if (!qa.id || !qa.question || !qa.answer) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('資料驗證失敗:', error);
    return false;
  }
};

/**
 * 從localStorage匯出所有資料
 */
export const exportAllData = () => {
  try {
    const scriptures = localStorage.getItem('adminScriptures');
    const qa = localStorage.getItem('adminQA');

    const data = {
      scriptures: scriptures ? JSON.parse(scriptures) : [],
      qa: qa ? JSON.parse(qa) : []
    };

    return exportToJSON(data, 'buddhism_complete_data');
  } catch (error) {
    console.error('匯出所有資料失敗:', error);
    message.error('匯出資料失敗');
    return false;
  }
};

/**
 * 匯入資料到localStorage
 */
export const importAllData = async (file) => {
  try {
    const data = await importFromJSON(file);
    
    // 儲存典籍資料
    if (data.scriptures) {
      localStorage.setItem('adminScriptures', JSON.stringify(data.scriptures));
    }
    
    // 儲存問答資料
    if (data.qa) {
      localStorage.setItem('adminQA', JSON.stringify(data.qa));
    }

    return {
      success: true,
      data: data,
      message: `成功匯入 ${data.scriptures?.length || 0} 部典籍和 ${data.qa?.length || 0} 個問答`
    };
  } catch (error) {
    console.error('匯入所有資料失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '匯入資料失敗'
    };
  }
};

/**
 * 生成範例JSON檔案
 */
export const generateSampleJSON = () => {
  const sampleData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    scriptures: [
      {
        id: 'sample_scripture',
        name: '範例典籍',
        description: '這是一個範例典籍',
        chapters: [
          {
            id: 'sample_chapter',
            name: '範例章節',
            description: '這是一個範例章節',
            sections: [
              {
                id: 'sample_section',
                title: '範例小節',
                theme: '範例主題',
                outline: '範例綱要',
                keyPoints: '1. 第一個重點\n2. 第二個重點',
                transcript: '範例經文內容',
                youtubeId: 'dQw4w9WgXcQ',
                themes: [
                  {
                    id: 'sample_theme',
                    name: '範例主題內容',
                    outline: '詳細的範例綱要',
                    keyPoints: '1. 詳細重點一\n2. 詳細重點二',
                    transcript: '詳細的範例經文內容',
                    youtubeId: 'dQw4w9WgXcQ'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    qa: [
      {
        id: 'sample_qa',
        category: '範例分類',
        question: '這是範例問題？',
        answer: '這是範例答案，解釋了問題的內容。',
        tags: ['範例', '標籤']
      }
    ],
    metadata: {
      totalScriptures: 1,
      totalQA: 1,
      description: '佛法教學網站資料備份 - 範例檔案'
    }
  };

  return exportToJSON(sampleData, 'buddhism_sample_data');
}; 