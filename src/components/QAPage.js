/* global Qs */
import React, { useState, useEffect } from 'react';
import { Card, Collapse, Typography, Row, Col, Select, Tag, Button, Input, Spin, message } from 'antd';
import { 
  ArrowLeftOutlined, 
  QuestionCircleOutlined,
  MessageOutlined,
  TagOutlined,
  SearchOutlined
} from '@ant-design/icons';
import Request from '../utils/Request';
import { getApiUrl } from '../config';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { Search } = Input;

const QAPage = ({ onBackToHome }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [displayedQA, setDisplayedQA] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始載入資料
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // 同時載入問答資料和分類
      const [qaResponse, categoriesResponse] = await Promise.all([
        Request().post(getApiUrl('qa_getAll'), Qs.stringify({})),
        Request().post(getApiUrl('qa_getCategories'), Qs.stringify({}))
      ]);
      

      
      if (qaResponse.data.status === 200) {
        const qaData = qaResponse.data.result || [];
        // 處理 tags JSON 字符串
        const processedQAData = qaData.map(qa => ({
          ...qa,
          tags: qa.tags ? JSON.parse(qa.tags) : []
        }));
        setDisplayedQA(processedQAData);
        message.success(`成功載入 ${processedQAData.length} 個問答`);
      } else {
        message.error(qaResponse.data.message || '載入問答資料失敗');
        setDisplayedQA([]);
      }
      
      if (categoriesResponse.data.status === 200) {
        const categoriesData = categoriesResponse.data.result || [];
        // 提取分類字符串數組
        const categoryNames = categoriesData.map(item => item.category);
        setCategories(categoryNames);
      } else {
        console.error('載入分類失敗:', categoriesResponse.data.message);
        setCategories([]);
      }
    } catch (error) {
      message.error('載入問答資料失敗，請檢查網路連線');
      console.error('載入問答資料錯誤:', error);
      setDisplayedQA([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      setSearchKeyword('');
      
      const response = await Request().post(
        getApiUrl('qa_getByCategory'),
        Qs.stringify({ category })
      );
      

      
      if (response.data.status === 200) {
        const filteredQA = response.data.result || [];
        // 處理 tags JSON 字符串
        const processedQA = filteredQA.map(qa => ({
          ...qa,
          tags: qa.tags ? JSON.parse(qa.tags) : []
        }));
        setDisplayedQA(processedQA);
        message.success(`找到 ${processedQA.length} 個相關問答`);
      } else {
        message.error(response.data.message || '篩選問答失敗');
        setDisplayedQA([]);
      }
    } catch (error) {
      message.error('篩選問答失敗，請檢查網路連線');
      console.error('篩選問答錯誤:', error);
      setDisplayedQA([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    try {
      setLoading(true);
      setSearchKeyword(value);
      setSelectedCategory(null);
      
      const response = await Request().post(
        getApiUrl('qa_search'),
        Qs.stringify({ keyword: value })
      );
      

      
      if (response.data.status === 200) {
        const searchResults = response.data.result || [];
        // 處理 tags JSON 字符串
        const processedResults = searchResults.map(qa => ({
          ...qa,
          tags: qa.tags ? JSON.parse(qa.tags) : []
        }));
        setDisplayedQA(processedResults);
        message.success(`找到 ${processedResults.length} 個搜尋結果`);
      } else {
        message.error(response.data.message || '搜尋問答失敗');
        setDisplayedQA([]);
      }
    } catch (error) {
      message.error('搜尋問答失敗，請檢查網路連線');
      console.error('搜尋問答錯誤:', error);
      setDisplayedQA([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      setSelectedCategory(null);
      setSearchKeyword('');
      
      const response = await Request().post(
        getApiUrl('qa_getAll'),
        Qs.stringify({})
      );
      
      if (response.data.status === 200) {
        const qaData = response.data.result || [];
        // 處理 tags JSON 字符串
        const processedQAData = qaData.map(qa => ({
          ...qa,
          tags: qa.tags ? JSON.parse(qa.tags) : []
        }));
        setDisplayedQA(processedQAData);
        message.success(`重置成功，顯示全部 ${processedQAData.length} 個問答`);
      } else {
        message.error(response.data.message || '重置失敗');
        setDisplayedQA([]);
      }
    } catch (error) {
      message.error('重置篩選失敗');
      console.error('重置篩選錯誤:', error);
      setDisplayedQA([]);
    } finally {
      setLoading(false);
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
              <QuestionCircleOutlined style={{ marginRight: '8px' }} />
              佛法答問集
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              常見的佛法疑問與詳細解答，幫助您深入理解佛法精義
            </Paragraph>
          </Card>
        </Col>

        {/* 篩選和搜尋 */}
        <Col span={24}>
          <Card title="篩選與搜尋" className="scripture-selector-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Text strong>按類別篩選：</Text>
                <Select
                  placeholder="選擇問答類別"
                  style={{ width: '100%', marginTop: '8px' }}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  allowClear
                >
                  {categories.map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Text strong>關鍵字搜尋：</Text>
                <Search
                  placeholder="搜尋問題或答案內容"
                  style={{ marginTop: '8px' }}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onSearch={handleSearch}
                  enterButton={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Text strong>操作：</Text>
                <div style={{ marginTop: '8px' }}>
                  <Button onClick={handleReset}>
                    重置篩選
                  </Button>
                  <Text style={{ marginLeft: '12px', color: '#666' }}>
                    共 {displayedQA.length} 個問答
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 問答內容 */}
        <Col span={24}>
          <Card 
            className="no-hover-effect"
            title={
              <span>
                <MessageOutlined style={{ marginRight: '8px' }} />
                問答內容
              </span>
            }
          >
            <Spin spinning={loading}>
              {displayedQA.length > 0 ? (
              <Collapse 
                size="large"
                expandIconPosition="right"
                ghost
              >
                {displayedQA.map((qa, index) => (
                  <Panel
                    header={
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <Tag color="purple" style={{ marginRight: '8px' }}>
                            {qa.category}
                          </Tag>
                          <Text strong style={{ fontSize: '16px' }}>
                            {qa.question}
                          </Text>
                        </div>
                        <div>
                          {qa.tags.map(tag => (
                            <Tag key={tag} color="blue" size="small" style={{ margin: '2px' }}>
                              <TagOutlined style={{ marginRight: '4px' }} />
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    }
                    key={qa.id}
                    style={{ 
                      marginBottom: '16px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ 
                      padding: '20px',
                      backgroundColor: '#fafafa',
                      borderRadius: '0 0 8px 8px'
                    }}>
                      <Title level={5} style={{ color: '#722ed1', marginBottom: '12px' }}>
                        📝 詳細解答：
                      </Title>
                      <div style={{ 
                        fontSize: '16px', 
                        lineHeight: '1.8',
                        color: '#333'
                      }}>
                        {qa.answer.split('\n').map((paragraph, pIndex) => (
                          <Paragraph key={pIndex} style={{ marginBottom: '12px' }}>
                            {paragraph}
                          </Paragraph>
                        ))}
                      </div>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            ) : !loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <QuestionCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#999' }}>
                  沒有找到相關問答
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  請嘗試其他關鍵字或選擇不同的類別
                </Paragraph>
              </div>
            )}
            </Spin>
          </Card>
        </Col>

        {/* 提示資訊 */}
        <Col span={24}>
          <Card className="no-hover-effect" style={{ backgroundColor: '#e6f4ff', border: '1px solid #91caff' }}>
            <Title level={5} style={{ color: '#0958d9', margin: '0 0 8px 0' }}>
              使用說明
            </Title>
            <Paragraph style={{ margin: 0, color: '#1677ff' }}>
              • 您可以透過類別篩選來查看特定主題的問答<br/>
              • 使用關鍵字搜尋功能尋找特定內容<br/>
              • 點擊問題即可展開查看詳細解答<br/>
              • 所有問答由網站管理員精心整理，內容僅供參考學習
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QAPage; 