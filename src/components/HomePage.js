/* global Qs */
import React, { useState, useEffect } from 'react';
import { Card, Select, List, Typography, Row, Col, Button, Spin, message } from 'antd';
import { BookOutlined, VideoCameraOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Request from '../utils/Request';
import { getApiUrl } from '../config';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const HomePage = ({ onChapterSelect, onQASelect, onSearchSelect }) => {
  const [selectedScripture, setSelectedScripture] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [scripturesList, setScripturesList] = useState([]);
  const [loadingScriptures, setLoadingScriptures] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);

  // 載入典籍列表
  useEffect(() => {
    loadScriptures();
  }, []);

  const loadScriptures = async () => {
    try {
      setLoadingScriptures(true);
      
      const response = await Request().post(
        getApiUrl('scriptures_getAll'),
        Qs.stringify({})
      );
      
      console.log('典籍列表回應:', response.data);
      
      if (response.data.status === 200) {
        const scriptures = response.data.result || [];
        const formattedScriptures = scriptures.map(scripture => ({
          value: scripture.id,
          label: scripture.name,
          description: scripture.description
        }));
        setScripturesList(formattedScriptures);
        message.success(`成功載入 ${formattedScriptures.length} 部典籍`);
      } else {
        message.error(response.data.message || '載入典籍列表失敗');
        setScripturesList([]);
      }
    } catch (error) {
      message.error('載入典籍列表失敗，請檢查網路連線');
      console.error('載入典籍列表錯誤:', error);
      setScripturesList([]);
    } finally {
      setLoadingScriptures(false);
    }
  };

  const handleScriptureChange = async (scriptureId) => {
    try {
      setLoadingChapters(true);
      setSelectedScripture(scriptureId);
      
      const response = await Request().post(
        getApiUrl('chapters_getByScriptureId'),
        Qs.stringify({ scripture_id: scriptureId })
      );
      
      console.log('章節列表回應:', response.data);
      
      if (response.data.status === 200) {
        const chapters = response.data.result || [];
        const formattedChapters = chapters.map(chapter => ({
          id: chapter.id,
          name: chapter.name,
          description: chapter.description
        }));
        setChapters(formattedChapters);
        message.success(`成功載入 ${formattedChapters.length} 個章節`);
      } else {
        message.error(response.data.message || '載入章節列表失敗');
        setChapters([]);
      }
    } catch (error) {
      message.error('載入章節列表失敗，請檢查網路連線');
      console.error('載入章節列表錯誤:', error);
      setChapters([]);
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleChapterClick = (chapterId) => {
    onChapterSelect(selectedScripture, chapterId);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
            hoverable={false} 
            style={{ 
              boxShadow: 'none',
              transition: 'none',
              transform: 'none'
            }}
            className="no-hover-effect"
          >
            <Title level={1} style={{ textAlign: 'center', color: '#722ed1', cursor: 'default', userSelect: 'none' }}>
              <BookOutlined /> 佛法教學影片網站
            </Title>
            <Paragraph style={{ textAlign: 'center', fontSize: '16px' }}>
              探索佛法經典，透過影片學習佛陀的智慧教導
            </Paragraph>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="選擇典籍" extra={<BookOutlined />} className="scripture-selector-card">
            <Spin spinning={loadingScriptures}>
              <Select
                placeholder="請選擇要學習的佛法典籍"
                style={{ width: '100%', marginBottom: '16px' }}
                size="large"
                onChange={handleScriptureChange}
                value={selectedScripture}
                optionLabelProp="label"
                disabled={loadingScriptures}
              >
                {scripturesList.map(scripture => (
                  <Option 
                    key={scripture.value} 
                    value={scripture.value}
                    label={scripture.label}
                  >
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {scripture.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        {scripture.description}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Spin>
          </Card>
        </Col>

        {selectedScripture && (
          <Col span={24}>
            <Card 
              title={`章節列表 - ${scripturesList.find(s => s.value === selectedScripture)?.label}`}
              extra={<VideoCameraOutlined />}
              className="scripture-selector-card"
            >
              <Spin spinning={loadingChapters}>
                {chapters.length > 0 ? (
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 1,
                      md: 2,
                      lg: 2,
                      xl: 3,
                      xxl: 3,
                    }}
                    dataSource={chapters}
                    renderItem={chapter => (
                      <List.Item>
                        <Card
                          hoverable
                          size="small"
                          title={chapter.name}
                          extra={<VideoCameraOutlined style={{ color: '#722ed1' }} />}
                          onClick={() => handleChapterClick(chapter.id)}
                          style={{ 
                            cursor: 'pointer',
                            border: '1px solid #d9d9d9',
                            transition: 'all 0.3s'
                          }}
                          bodyStyle={{ padding: '12px' }}
                        >
                          <Paragraph 
                            ellipsis={{ rows: 2 }}
                            style={{ margin: 0, color: '#666' }}
                          >
                            {chapter.description}
                          </Paragraph>
                          <Button 
                            type="link" 
                            size="small" 
                            style={{ padding: 0, marginTop: '8px' }}
                          >
                            前往{chapter.name} →
                          </Button>
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : !loadingChapters && (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <VideoCameraOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <Title level={4} style={{ color: '#999' }}>
                      此典籍暫無章節內容
                    </Title>
                    <Paragraph style={{ color: '#666' }}>
                      請聯繫管理員添加章節內容，或嘗試選擇其他典籍
                    </Paragraph>
                  </div>
                )}
              </Spin>
            </Card>
          </Col>
        )}

        {!selectedScripture && (
          <Col span={24}>
            <Card style={{ textAlign: 'center', background: '#fafafa' }}>
              <BookOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Title level={4} style={{ color: '#999' }}>
                請先選擇一部典籍開始學習
              </Title>
              <Paragraph style={{ color: '#666' }}>
                我們提供多部重要的佛法經典，每部經典都有詳細的章節劃分和專業的影片講解
              </Paragraph>
            </Card>
          </Col>
        )}

        {/* 次要功能按鈕 - 移到底部 */}
        <Col span={24}>
          <Card 
            style={{ backgroundColor: '#fafafa', border: '1px solid #e8e8e8' }}
            className="scripture-selector-card"
          >
            <Title level={5} style={{ textAlign: 'center', color: '#666', marginBottom: '16px' }}>
              其他功能
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Button 
                  type="default"
                  size="middle"
                  block
                  icon={<QuestionCircleOutlined />}
                  onClick={onQASelect}
                  className="secondary-function-button"
                  style={{ 
                    height: '50px', 
                    fontSize: '14px',
                    color: '#666',
                    borderColor: '#d9d9d9',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                    e.target.style.borderColor = '#722ed1';
                    e.target.style.color = '#722ed1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '';
                    e.target.style.borderColor = '#d9d9d9';
                    e.target.style.color = '#666';
                  }}
                >
                  佛法問答集
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    常見疑問解答
                  </div>
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button 
                  type="default"
                  size="middle"
                  block
                  icon={<SearchOutlined />}
                  onClick={onSearchSelect}
                  className="secondary-function-button"
                  style={{ 
                    height: '50px', 
                    fontSize: '14px',
                    color: '#666',
                    borderColor: '#d9d9d9',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                    e.target.style.borderColor = '#722ed1';
                    e.target.style.color = '#722ed1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '';
                    e.target.style.borderColor = '#d9d9d9';
                    e.target.style.color = '#666';
                  }}
                >
                  經文搜尋
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    快速查找內容
                  </div>
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage; 