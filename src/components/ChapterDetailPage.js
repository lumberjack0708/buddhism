import React from 'react';
import { Card, List, Typography, Row, Col, Button, Tag } from 'antd';
import { 
  ArrowLeftOutlined, 
  PlayCircleOutlined, 
  VideoCameraOutlined,
  FileTextOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ChapterDetailPage = ({ 
  scriptureId, 
  chapterId, 
  chapterData, 
  scriptureName,
  onBackToHome, 
  onSectionSelect 
}) => {
  if (!chapterData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>章節資料載入中...</Title>
      </div>
    );
  }

  const handleSectionClick = (sectionId) => {
    onSectionSelect(scriptureId, chapterId, sectionId);
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
            <div style={{ marginBottom: '12px' }}>
              <Tag color="purple" style={{ fontSize: '12px' }}>
                {scriptureName}
              </Tag>
            </div>
            <Title level={2} style={{ margin: 0, color: '#722ed1' }}>
              {chapterData.name}
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              {chapterData.description}
            </Paragraph>
          </Card>
        </Col>

        {/* 小節列表 */}
        <Col span={24}>
          <Card 
            className="no-hover-effect"
            title={
              <span>
                <FileTextOutlined style={{ marginRight: '8px' }} />
                選擇小節
              </span>
            }
            extra={
              <span style={{ color: '#666', fontWeight: 'normal' }}>
                共 {chapterData.sections.length} 個小節
              </span>
            }
          >
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 3,
              }}
              dataSource={chapterData.sections}
              renderItem={(section, index) => (
                <List.Item>
                  <Card
                    hoverable
                    size="default"
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Tag color="blue" style={{ marginRight: '8px', marginBottom: '4px' }}>
                          第 {index + 1} 節
                        </Tag>
                        <span style={{ marginBottom: '4px' }}>{section.title}</span>
                      </div>
                    }
                    extra={<VideoCameraOutlined style={{ color: '#722ed1' }} />}
                    onClick={() => handleSectionClick(section.id)}
                    style={{ 
                      cursor: 'pointer',
                      border: '1px solid #d9d9d9',
                      transition: 'all 0.3s'
                    }}
                    bodyStyle={{ padding: '16px' }}
                  >
                    {/* 小節主題 */}
                    {(section.themes?.length > 0 || section.theme) && (
                      <div style={{ marginBottom: '12px' }}>
                        <Title level={5} style={{ color: '#fa8c16', margin: '0 0 8px 0' }}>
                            主題 {section.themes?.length > 0 ? `(${section.themes.length}個)` : '(1個)'}
                        </Title>
                        {section.themes?.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {section.themes.slice(0, 2).map((theme, index) => (
                              <div key={theme.id} style={{ 
                                backgroundColor: "#FFEEB8",
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: '1px solid #ffd591',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#d46b08'
                              }}>
                                {index + 1}. {theme.name}
                              </div>
                            ))}
                            {section.themes.length > 2 && (
                              <div style={{ 
                                fontSize: '11px', 
                                color: '#999',
                                textAlign: 'center',
                                padding: '4px'
                              }}>
                                +{section.themes.length - 2} 個更多主題...
                              </div>
                            )}
                          </div>
                        ) : section.theme && (
                          <div style={{ 
                            backgroundColor: "#FFEEB8",
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #ffd591',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#d46b08'
                          }}>
                            {section.theme}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 小節綱要預覽 */}
                    <div style={{ marginBottom: '12px' }}>
                      <Title level={5} style={{ color: '#722ed1', margin: '0 0 8px 0' }}>
                          綱要
                      </Title>
                      <Paragraph 
                        ellipsis={{ rows: 2 }}
                        style={{ margin: 0, color: '#666', fontSize: '14px' }}
                      >
                        {section.themes?.length > 0 ? section.themes[0]?.outline : section.outline}
                      </Paragraph>
                    </div>

                    {/* 重點預覽 */}
                    {section.keyPoints && (
                      <div style={{ marginBottom: '12px' }}>
                        <Title level={5} style={{ color: '#fa8c16', margin: '0 0 8px 0' }}>
                          重點
                        </Title>
                        <Paragraph 
                          ellipsis={{ rows: 2 }}
                          style={{ margin: 0, color: '#666', fontSize: '14px' }}
                        >
                          {section.keyPoints.split('\n')[0]}
                          {section.keyPoints.split('\n').length > 1 && '...'}
                        </Paragraph>
                      </div>
                    )}

                    {/* 經文預覽 */}
                    <div style={{ marginBottom: '16px' }}>
                      <Title level={5} style={{ color: '#52c41a', margin: '0 0 8px 0' }}>
                        經文
                      </Title>
                      <Paragraph 
                        ellipsis={{ rows: 2 }}
                        style={{ 
                          margin: 0, 
                          color: '#666', 
                          fontSize: '14px',
                          fontFamily: 'serif'
                        }}
                      >
                        {section.themes?.length > 0 ? section.themes[0]?.transcript : section.transcript}
                      </Paragraph>
                    </div>

                    <Button 
                      type="primary" 
                      size="small" 
                      icon={<PlayCircleOutlined />}
                      block
                      style={{ 
                        background: 'linear-gradient(90deg, #722ed1, #9254de)',
                        border: 'none'
                      }}
                    >
                      開始學習此節
                    </Button>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 學習提示 */}
        <Col span={24}>
          <Card className="no-hover-effect" style={{ backgroundColor: '#e6f4ff', border: '1px solid #91caff' }}>
            <Title level={5} style={{ color: '#0958d9', margin: '0 0 8px 0' }}>
              學習建議
            </Title>
            <Paragraph style={{ margin: 0, color: '#1677ff' }}>
              • 建議依序學習各個小節，每節都包含完整的影片、綱要、重點和經文<br/>
              • 每個小節都有獨立的YouTube教學影片和詳細解說<br/>
              • 可以根據個人需求選擇特定小節深入學習<br/>
              • 點擊任一小節卡片即可進入完整的學習內容
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChapterDetailPage; 