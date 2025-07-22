import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, Input, List, Tag, Empty } from 'antd';
import { 
  ArrowLeftOutlined, 
  SearchOutlined,
  BookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dataManager from '../data/dataManager';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const SearchPage = ({ onBackToHome, onChapterSelect }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      setIsSearched(false);
      return;
    }
    
    setSearchKeyword(value);
    const results = dataManager.searchScriptures(value.trim());
    setSearchResults(results);
    setIsSearched(true);
  };

  const handleSectionClick = (result) => {
    // 跳轉到對應的章節
    onChapterSelect(result.scriptureId, result.chapterId);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* 返回按鈕和標題 */}
        <Col span={24}>
          <Card>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={onBackToHome}
              style={{ marginBottom: '16px' }}
            >
              返回首頁
            </Button>
            <Title level={2} style={{ margin: 0, color: '#722ed1' }}>
              <SearchOutlined style={{ marginRight: '8px' }} />
              經文搜尋
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              搜尋佛法經典中的文字內容，快速找到相關章節
            </Paragraph>
          </Card>
        </Col>

        {/* 搜尋框 */}
        <Col span={24}>
          <Card title="搜尋經文內容" className="scripture-selector-card">
            <Search
              placeholder="輸入關鍵字搜尋經文內容（如：如是我聞、般若、五蘊等）"
              size="large"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton={
                <Button type="primary" icon={<SearchOutlined />}>
                  搜尋
                </Button>
              }
              style={{ marginBottom: '16px' }}
            />
            <div style={{ color: '#666', fontSize: '14px' }}>
              💡 提示：搜尋功能會在經文原文、小節標題和章節綱要中尋找相關內容
            </div>
          </Card>
        </Col>

        {/* 搜尋結果 */}
        <Col span={24}>
          <Card 
            title={
              <span>
                <FileTextOutlined style={{ marginRight: '8px' }} />
                搜尋結果
                {isSearched && (
                  <Text style={{ fontWeight: 'normal', marginLeft: '12px', color: '#666' }}>
                    找到 {searchResults.length} 個相關結果
                  </Text>
                )}
              </span>
            }
          >
            {!isSearched ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <SearchOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#999' }}>
                  請輸入關鍵字開始搜尋
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  您可以搜尋任何佛法經典中的文字內容
                </Paragraph>
              </div>
            ) : searchResults.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={searchResults}
                renderItem={(result, index) => (
                  <List.Item
                    key={`${result.scriptureId}-${result.chapterId}-${result.sectionId}`}
                    style={{
                      padding: '20px',
                      marginBottom: '16px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleSectionClick(result)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#722ed1';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(114, 46, 209, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <Tag color="purple" style={{ marginRight: '8px' }}>
                        {result.scriptureName}
                      </Tag>
                      <Tag color="blue" style={{ marginRight: '8px' }}>
                        {result.chapterName}
                      </Tag>
                      <Tag color="green">
                        {result.sectionTitle}
                      </Tag>
                    </div>
                    
                    <Title level={5} style={{ margin: '8px 0', color: '#722ed1' }}>
                      <BookOutlined style={{ marginRight: '6px' }} />
                      {result.sectionTitle}
                    </Title>
                    
                    <div 
                      style={{ 
                        fontSize: '16px', 
                        lineHeight: '1.8',
                        color: '#333',
                        backgroundColor: '#fafafa',
                        padding: '16px',
                        borderRadius: '6px',
                        border: '1px solid #f0f0f0'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: result.highlightedTranscript 
                      }}
                    />
                    
                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                      <Button type="link" style={{ padding: 0 }}>
                        查看完整章節 →
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Title level={4} style={{ color: '#999' }}>
                      沒有找到相關內容
                    </Title>
                    <Paragraph style={{ color: '#666' }}>
                      請嘗試其他關鍵字，或檢查拼字是否正確
                    </Paragraph>
                  </div>
                }
              />
            )}
          </Card>
        </Col>

        {/* 搜尋提示 */}
        <Col span={24}>
          <Card style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Title level={5} style={{ color: '#389e0d', margin: '0 0 8px 0' }}>
              🔍 搜尋技巧
            </Title>
            <Paragraph style={{ margin: 0, color: '#52c41a' }}>
              • <strong>精確搜尋：</strong>使用完整的詞語或句子可獲得更準確的結果<br/>
              • <strong>關鍵字組合：</strong>可以搜尋「般若波羅蜜多」、「五蘊皆空」等佛法術語<br/>
              • <strong>經典名詞：</strong>搜尋「如是我聞」、「舍利子」、「觀自在菩薩」等<br/>
              • <strong>點擊結果：</strong>點擊任一搜尋結果可直接跳轉到該章節的完整內容
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage; 