/* global Qs */
import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, FloatButton } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import HomePage from './components/HomePage';
import ChapterDetailPage from './components/ChapterDetailPage';
import ChapterPage from './components/ChapterPage';
import QAPage from './components/QAPage';
import SearchPage from './components/SearchPage';
import AdminPage from './components/AdminPage';
import AdminLoginModal from './components/AdminLoginModal';
import dataManager from './data/dataManager';
import 'antd/dist/reset.css';
import './App.css';
import Request from './utils/Request';
import { getApiUrl } from './config';

const { Content } = Layout;

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedScripture, setSelectedScripture] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [isAdminLoginVisible, setIsAdminLoginVisible] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 訂閱資料管理器的變化
  useEffect(() => {
    const unsubscribe = dataManager.subscribe(() => {
      // 資料變化時重新載入當前章節（如果有的話）
      if (selectedScripture && selectedChapter) {
        loadChapterContent(selectedScripture, selectedChapter);
      }
    });
    return unsubscribe;
  }, [selectedScripture, selectedChapter]);

  const loadChapterContent = async (scriptureId, chapterId) => {
    try {
      const response = await Request().post(
        getApiUrl('chapters_getStructure'),
        Qs.stringify({ id: chapterId })
      );
      

      
      if (response.data.status === 200) {
        const structureData = response.data.result || [];
        
        if (structureData.length === 0) {
          setChapterData(null);
          return;
        }
        
        // 重組章節數據結構
        const chapterInfo = structureData[0];
        const chapterData = {
          id: chapterInfo.chapter_id,
          name: chapterInfo.chapter_name,
          description: chapterInfo.chapter_description,
          scripture_id: chapterInfo.scripture_id,
          scripture_name: chapterInfo.scripture_name,
          sections: []
        };
        
        // 將小節和主題數據分組
        const sectionsMap = new Map();
        structureData.forEach(row => {
          if (row.section_id) {
            if (!sectionsMap.has(row.section_id)) {
              sectionsMap.set(row.section_id, {
                id: row.section_id,
                title: row.section_title,
                theme: row.section_theme,
                outline: row.section_outline || '',
                keyPoints: row.section_key_points || '',
                transcript: row.section_transcript || '',
                youtubeId: row.section_youtube_id || '',
                order_index: row.section_order || 0,
                themes: []
              });
            }
            
            // 如果有主題數據，添加到主題數組中
            if (row.theme_id) {
              const section = sectionsMap.get(row.section_id);
              // 檢查主題是否已經存在（避免重複）
              const existingTheme = section.themes.find(t => t.id === row.theme_id);
              if (!existingTheme) {
                section.themes.push({
                  id: row.theme_id,
                  name: row.theme_name,
                  outline: row.theme_outline || '',
                  keyPoints: row.theme_key_points || '',
                  transcript: row.theme_transcript || '',
                  verbatimTranscript: row.theme_verbatim_transcript || '',
                  youtubeId: row.theme_youtube_id || '',
                  order_index: row.theme_order || 0
                });
                // 排序主題
                section.themes.sort((a, b) => a.order_index - b.order_index);
              }
            }
          }
        });
        
        chapterData.sections = Array.from(sectionsMap.values()).sort((a, b) => a.order_index - b.order_index);
        setChapterData(chapterData);
      } else {
        console.error('載入章節結構失敗:', response.data.message);
        setChapterData(null);
      }
    } catch (error) {
      console.error('載入章節內容錯誤:', error);
      setChapterData(null);
    }
  };

  const handleChapterSelect = async (scriptureId, chapterId) => {
    setSelectedScripture(scriptureId);
    setSelectedChapter(chapterId);
    setCurrentView('chapterDetail');
    await loadChapterContent(scriptureId, chapterId);
  };

  const handleSectionSelect = async (scriptureId, chapterId, sectionId) => {
    setSelectedScripture(scriptureId);
    setSelectedChapter(chapterId);
    setSelectedSection(sectionId);
    setCurrentView('section');
    await loadChapterContent(scriptureId, chapterId);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedScripture(null);
    setSelectedChapter(null);
    setSelectedSection(null);
    setChapterData(null);
  };

  const handleBackToChapter = () => {
    setCurrentView('chapterDetail');
    setSelectedSection(null);
  };

  const handleQASelect = () => {
    setCurrentView('qa');
  };

  const handleSearchSelect = () => {
    setCurrentView('search');
  };

  const handleAdminSelect = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginVisible(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginVisible(false);
    setCurrentView('admin');
  };

  const handleAdminLoginCancel = () => {
    setIsAdminLoginVisible(false);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('home');
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#722ed1',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        <Content>
          {currentView === 'home' ? (
            <HomePage 
              onChapterSelect={handleChapterSelect}
              onQASelect={handleQASelect}
              onSearchSelect={handleSearchSelect}
            />
          ) : currentView === 'chapterDetail' ? (
            <ChapterDetailPage
              scriptureId={selectedScripture}
              chapterId={selectedChapter}
              chapterData={chapterData}
              scriptureName={chapterData?.scripture_name || '載入中...'}
              onBackToHome={handleBackToHome}
              onSectionSelect={handleSectionSelect}
            />
          ) : currentView === 'section' ? (
            <ChapterPage
              scriptureId={selectedScripture}
              chapterId={selectedChapter}
              sectionId={selectedSection}
              chapterData={chapterData}
              scriptureName={chapterData?.scripture_name || '載入中...'}
              onBackToHome={handleBackToHome}
              onBackToChapter={handleBackToChapter}
            />
          ) : currentView === 'qa' ? (
            <QAPage onBackToHome={handleBackToHome} />
          ) : currentView === 'search' ? (
            <SearchPage 
              onBackToHome={handleBackToHome}
              onChapterSelect={handleChapterSelect}
              onSectionSelect={handleSectionSelect}
            />
          ) : currentView === 'admin' ? (
            <AdminPage
              onBackToHome={handleBackToHome}
              onLogout={handleAdminLogout}
              isLoggedIn={isAdminLoggedIn}
            />
          ) : null}
          
          {/* 管理員浮動按鈕 */}
          {currentView !== 'admin' && (
            <FloatButton
              icon={<SettingOutlined />}
              tooltip={isAdminLoggedIn ? "管理員後台" : "管理員登入"}
              onClick={handleAdminSelect}
              style={{
                right: 24,
                bottom: 24,
              }}
            />
          )}

          {/* 管理員登入模態視窗 */}
          <AdminLoginModal
            visible={isAdminLoginVisible}
            onCancel={handleAdminLoginCancel}
            onLoginSuccess={handleAdminLoginSuccess}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
