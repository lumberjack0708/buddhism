/* global Qs */
import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, Input, List, Tag, Empty, Spin, message } from 'antd';
import { 
  ArrowLeftOutlined, 
  SearchOutlined,
  BookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import Request from '../utils/Request';
import { getApiUrl } from '../config';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const SearchPage = ({ onBackToHome, onChapterSelect, onSectionSelect }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // 大於100字元就截斷文字內容，保留高亮區域
  const truncateTextWithHighlight = (text, keyword, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    
    // 移除已存在的HTML標記來計算純文字長度
    const plainText = text.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return text;
    
    // 找到第一個關鍵字的位置
    const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const match = plainText.match(keywordRegex);
    
    if (!match) {
      const truncated = plainText.substring(0, maxLength);
      return truncated + '...';
    }
    
    const keywordIndex = plainText.search(keywordRegex);
    const keywordLength = match[0].length;
    
    // 計算截斷的開始和結束位置，確保關鍵字在中心附近
    const contextLength = Math.floor((maxLength - keywordLength) / 2);
    let startIndex = Math.max(0, keywordIndex - contextLength);
    let endIndex = Math.min(plainText.length, keywordIndex + keywordLength + contextLength);
    
    if (startIndex > 0) {
      while (startIndex > 0 && !/[\s，。！？；：、]/.test(plainText[startIndex - 1])) {
        startIndex--;
      }
    }
    
    if (endIndex < plainText.length) {
      while (endIndex < plainText.length && !/[\s，。！？；：、]/.test(plainText[endIndex])) {
        endIndex++;
      }
    }
    
    // 截取文字片段
    let truncatedText = plainText.substring(startIndex, endIndex);
    
    truncatedText = truncatedText.replace(
      keywordRegex,
      '<mark style="background-color: #fff2e6; color: #d46b08; padding: 2px 4px; border-radius: 3px; font-weight: 500;">$&</mark>'
    );
    
    const prefix = startIndex > 0 ? '...' : '';
    const suffix = endIndex < plainText.length ? '...' : '';
    
    return prefix + truncatedText + suffix;
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      setIsSearched(false);
      return;
    }
    
    try {
      setLoading(true);
      setSearchKeyword(value);
      
      const response = await Request().post(
        getApiUrl('sections_search'),
        Qs.stringify({ keyword: value.trim() })
      );
      
      if (response.data.status === 200) {
        const results = response.data.result || [];
        console.log('搜尋結果:', results); // 日誌
        const formattedResults = results.map(result => ({
          scriptureId: result.scripture_id,
          scriptureName: result.scripture_name,
          chapterId: result.chapter_id,
          chapterName: result.chapter_name,
          sectionId: result.id,
          sectionTitle: result.title,
          sectionTheme: result.theme,
          outline: result.outline || '',
          transcript: result.transcript || '',
          verbatimTranscript: result.verbatim_transcript || '', // 添加逐字稿欄位
          sourceType: result.source_type || 'section', // 添加來源類型
          // 對文稿內容進行智能截斷和高亮
          highlightedTranscript: truncateTextWithHighlight(
            result.transcript || '',
            value.trim(),
            200
          ),
          // 對逐字稿內容進行智能截斷和高亮
          highlightedVerbatimTranscript: truncateTextWithHighlight(
            result.verbatim_transcript || '',
            value.trim(),
            200
          )
        }));
        setSearchResults(formattedResults);
        setIsSearched(true);
        message.success(`找到 ${formattedResults.length} 個相關結果`);
      } else {
        console.log('搜尋失敗:', response.data); // 日誌
        message.error(response.data.message || '搜尋失敗');
        setSearchResults([]);
        setIsSearched(true);
      }
    } catch (error) {
      console.log('搜尋錯誤:', error); // 日誌
      message.error('搜尋失敗，請稍後再試');
      console.error('搜尋錯誤:', error);
      setSearchResults([]);
      setIsSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (result) => {
    // 直接導航到小節學習頁面，無論是小節內容還是主題內容
    if (onSectionSelect) {
      onSectionSelect(result.scriptureId, result.chapterId, result.sectionId);
    } else {
      // 如果沒有 onSectionSelect，則退回到章節頁面
      onChapterSelect(result.scriptureId, result.chapterId);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* 返回按鈕和標題 */}
        <Col span={24}>
          <Card className="no-hover-effect">
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
              提示：搜尋功能會在<b>經文原文</b>、<b>小節標題</b>、<b>章節綱要</b>和<b>逐字稿</b>中尋找相關內容
            </div>
          </Card>
        </Col>

        {/* 搜尋結果 */}
        <Col span={24}>
          <Card 
            className="no-hover-effect"
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
            <Spin spinning={loading}>
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
                      <Tag color="green" style={{ marginRight: '8px' }}>
                        {result.sectionTitle}
                      </Tag>
                      <Tag color={result.sourceType === 'theme' ? 'orange' : 'cyan'} style={{ fontSize: '11px' }}>
                        {result.sourceType === 'theme' ? '主題內容' : '小節內容'}
                      </Tag>
                    </div>
                    
                    <Title level={5} style={{ margin: '8px 0', color: '#722ed1' }}>
                      <BookOutlined style={{ marginRight: '6px' }} />
                      {result.sectionTitle}
                    </Title>
                    
                    {result.sectionTheme && (
                      <div style={{ marginBottom: '12px' }}>
                        <Text strong style={{ color: '#fa8c16', fontSize: '14px' }}>
                          主題：{result.sectionTheme}
                        </Text>
                      </div>
                    )}
                    
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
                        __html: (() => {
                          const keyword = searchKeyword.trim();
                          const keywordRegex = new RegExp(keyword, 'gi');
                          
                          // 檢查逐字稿是否包含關鍵字且有內容
                          if (result.verbatimTranscript && result.verbatimTranscript.trim() && keywordRegex.test(result.verbatimTranscript)) {
                            return result.highlightedVerbatimTranscript;
                          }
                          // 檢查文稿是否包含關鍵字且有內容
                          else if (result.transcript && result.transcript.trim() && keywordRegex.test(result.transcript)) {
                            return result.highlightedTranscript;
                          }
                          // 如果都沒有關鍵字，則優先顯示逐字稿（如果有）
                          else if (result.verbatimTranscript && result.verbatimTranscript.trim()) {
                            return result.highlightedVerbatimTranscript;
                          }
                          else {
                            return result.highlightedTranscript || '暫無內容';
                          }
                        })()
                      }}
                    />
                    
                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                      <Button type="link" style={{ padding: 0 }}>
                        直接進入學習 →
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
            </Spin>
          </Card>
        </Col>

        {/* 搜尋提示 */}
        <Col span={24}>
          <Card className="no-hover-effect" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Title level={5} style={{ color: '#389e0d', margin: '0 0 8px 0' }}>
              搜尋技巧
            </Title>
            <Paragraph style={{ margin: 0, color: '#52c41a' }}>
              • <strong>精確搜尋：</strong>使用完整的詞語或句子可獲得更準確的結果<br/>
              • <strong>關鍵字組合：</strong>可以搜尋「般若波羅蜜多」、「五蘊皆空」等佛法術語<br/>
              • <strong>經典名詞：</strong>搜尋「如是我聞」、「舍利子」、「觀自在菩薩」等<br/>
              • <strong>多重搜尋：</strong>系統會搜尋經文原文、章節綱要、主題內容和逐字稿<br/>
              • <strong>直接學習：</strong>點擊任一搜尋結果可直接進入該小節的完整學習內容
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage; 