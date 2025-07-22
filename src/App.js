import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, FloatButton } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import HomePage from './components/HomePage';
import ChapterDetailPage from './components/ChapterDetailPage';
import ChapterPage from './components/ChapterPage';
import QAPage from './components/QAPage';
import SearchPage from './components/SearchPage';
import AdminPage from './components/AdminPage';
import dataManager from './data/dataManager';
import 'antd/dist/reset.css';
import './App.css';

const { Content } = Layout;

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedScripture, setSelectedScripture] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [isUsingExampleData, setIsUsingExampleData] = useState(true);

  // 訂閱資料管理器的變化
  useEffect(() => {
    setIsUsingExampleData(dataManager.getDataMode());
    const unsubscribe = dataManager.subscribe((newMode) => {
      setIsUsingExampleData(newMode);
    });
    return unsubscribe;
  }, []);

  const handleChapterSelect = (scriptureId, chapterId) => {
    const chapterContent = dataManager.getChapterContent(scriptureId, chapterId);
    setSelectedScripture(scriptureId);
    setSelectedChapter(chapterId);
    setChapterData(chapterContent);
    setCurrentView('chapterDetail');
  };

  const handleSectionSelect = (scriptureId, chapterId, sectionId) => {
    const chapterContent = dataManager.getChapterContent(scriptureId, chapterId);
    setSelectedScripture(scriptureId);
    setSelectedChapter(chapterId);
    setSelectedSection(sectionId);
    setChapterData(chapterContent);
    setCurrentView('section');
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
    setCurrentView('admin');
  };

  const handleDataModeToggle = () => {
    const newMode = dataManager.toggleDataMode();
    setIsUsingExampleData(newMode);
    // 重置選擇狀態
    setSelectedScripture(null);
    setSelectedChapter(null);
    setSelectedSection(null);
    setChapterData(null);
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
              scriptureName={dataManager.getScripturesData()[selectedScripture]?.name}
              onBackToHome={handleBackToHome}
              onSectionSelect={handleSectionSelect}
            />
          ) : currentView === 'section' ? (
            <ChapterPage
              scriptureId={selectedScripture}
              chapterId={selectedChapter}
              sectionId={selectedSection}
              chapterData={chapterData}
              scriptureName={dataManager.getScripturesData()[selectedScripture]?.name}
              onBackToHome={handleBackToHome}
              onBackToChapter={handleBackToChapter}
            />
          ) : currentView === 'qa' ? (
            <QAPage onBackToHome={handleBackToHome} />
          ) : currentView === 'search' ? (
            <SearchPage 
              onBackToHome={handleBackToHome}
              onChapterSelect={handleChapterSelect}
            />
          ) : currentView === 'admin' ? (
            <AdminPage
              onBackToHome={handleBackToHome}
              isUsingExampleData={isUsingExampleData}
              onDataModeToggle={handleDataModeToggle}
            />
          ) : null}
          
          {/* 管理員浮動按鈕 */}
          {currentView !== 'admin' && (
            <FloatButton
              icon={<SettingOutlined />}
              tooltip="管理員後台"
              onClick={handleAdminSelect}
              style={{
                right: 24,
                bottom: 24,
              }}
            />
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
