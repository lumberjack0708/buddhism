import React from 'react';
import { Card, Collapse, Typography, Row, Col, Button, Tag } from 'antd';
import { 
  ArrowLeftOutlined, 
  VideoCameraOutlined, 
  FileTextOutlined, 
  ReadOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const YouTubeEmbed = ({ videoId }) => {
  if (!videoId) {
    return (
      <div style={{ 
        height: '315px', 
        backgroundColor: '#f5f5f5', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '2px dashed #d9d9d9',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <VideoCameraOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <div>YouTube 影片嵌入區域</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            請在此處嵌入對應的教學影片
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="佛法教學影片"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const ChapterPage = ({ 
  scriptureId, 
  chapterId, 
  sectionId, 
  chapterData, 
  scriptureName,
  onBackToHome,
  onBackToChapter 
}) => {
  if (!chapterData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>章節資料載入中...</Title>
      </div>
    );
  }

  // 根據sectionId找到對應的小節
  const currentSection = chapterData.sections.find(section => section.id === sectionId);
  const sectionIndex = chapterData.sections.findIndex(section => section.id === sectionId);
  
  if (!currentSection) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>找不到指定的小節</Title>
        <Button onClick={onBackToHome}>返回首頁</Button>
      </div>
    );
  }

  // 檢查是否使用新的themes結構，如果沒有則使用舊的單一主題結構
  const hasThemes = currentSection.themes && currentSection.themes.length > 0;
  const themes = hasThemes ? currentSection.themes : [{
    id: "legacy",
    name: currentSection.theme || currentSection.title,
    outline: currentSection.outline,
    keyPoints: currentSection.keyPoints,
    transcript: currentSection.transcript,
    youtubeId: currentSection.youtubeId
  }];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* 返回按鈕和標題 */}
        <Col span={24}>
          <Card className="no-hover-effect">
            <div style={{ marginBottom: '16px' }}>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={onBackToHome}
                style={{ marginRight: '8px' }}
              >
                返回首頁
              </Button>
              <Button 
                onClick={onBackToChapter}
                type="default"
              >
                返回章節選擇
              </Button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <Tag color="purple" style={{ marginRight: '8px' }}>
                {scriptureName}
              </Tag>
              <Tag color="blue" style={{ marginRight: '8px' }}>
                {chapterData.name}
              </Tag>
              <Tag color="green">
                第 {sectionIndex + 1} 節
              </Tag>
            </div>
            
            <Title level={2} style={{ margin: 0, color: '#722ed1' }}>
              {currentSection.title}
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              本小節包含 {themes.length} 個學習主題，請依序展開學習
            </Paragraph>
          </Card>
        </Col>

        {/* 小節內容 */}
        <Col span={24}>
          <Card className="no-hover-effect" title={
            <span>
              <ReadOutlined style={{ marginRight: '8px' }} />
              學習主題
            </span>
          }>
            <Collapse 
              defaultActiveKey={[themes[0]?.id]}
              size="large"
              expandIconPosition="right"
            >
              {themes.map((theme, index) => (
                <Panel
                  header={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <VideoCameraOutlined style={{ marginRight: '8px', color: '#FFFAE2' }} />
                      <span style={{ fontWeight: 'bold' }}>{theme.name}</span>
                    </div>
                  }
                  key={theme.id}
                  style={{ marginBottom: '16px' }}
                >
                  <div style={{ padding: '8px 0' }}>
                    {/* 1. YouTube 影片 */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ color: '#722ed1', marginBottom: '16px' }}>
                        <VideoCameraOutlined style={{ marginRight: '8px' }} />
                        教學影片
                      </Title>
                      <YouTubeEmbed videoId={theme.youtubeId} />
                    </div>

                    {/* 分隔線 */}
                    <div style={{ 
                      height: '1px', 
                      backgroundColor: '#e8e8e8',
                      margin: '24px 0' 
                    }} />

                    {/* 2. 主題綱要 */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ color: '#722ed1', marginBottom: '16px' }}>
                        <FileTextOutlined style={{ marginRight: '8px' }} />
                        主題綱要
                      </Title>
                      <Card className="no-hover-effect" size="small" style={{ backgroundColor: '#f9f9f9' }}>
                        <div style={{ margin: 0, fontSize: '16px', lineHeight: '1.8' }}>
                          {(theme.outline || '').split('\n').map((line, index, array) => (
                            <div key={index} style={{ marginBottom: index === array.length - 1 ? 0 : '8px' }}>
                              {line || '\u00A0'}
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    {/* 分隔線 */}
                    <div style={{ 
                      height: '1px', 
                      backgroundColor: '#e8e8e8',
                      margin: '24px 0' 
                    }} />

                    {/* 3. 重點 */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ color: '#fa8c16', marginBottom: '16px' }}>
                        <BulbOutlined style={{ marginRight: '8px' }} />
                        重點
                      </Title>
                      <Card className="no-hover-effect" size="small" style={{ backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
                        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                          {theme.keyPoints?.split('\n').map((point, pointIndex) => (
                            <div key={pointIndex} style={{ marginBottom: '8px' }}>
                              <Text style={{ fontWeight: '500' }}>{point}</Text>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    {/* 分隔線 */}
                    <div style={{ 
                      height: '1px', 
                      backgroundColor: '#e8e8e8',
                      margin: '24px 0' 
                    }} />

                    {/* 4. 經文內容 */}
                    <div>
                      <Title level={4} style={{ color: '#52c41a', marginBottom: '16px' }}>
                        <ReadOutlined style={{ marginRight: '8px' }} />
                        經文內容
                      </Title>
                      <Card className="no-hover-effect" size="small" style={{ backgroundColor: '#fff9f0' }}>
                        <div style={{ 
                          fontSize: '16px', 
                          lineHeight: '2', 
                          fontFamily: 'serif',
                          color: '#333'
                        }}>
                          {(theme.transcript || '').split('\n').map((line, index, array) => (
                            <div key={index} style={{ marginBottom: index === array.length - 1 ? 0 : '8px' }}>
                              {line || '\u00A0'}
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Col>

        {/* 學習提示 */}
        <Col span={24}>
          <Card className="no-hover-effect" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Title level={5} style={{ color: '#389e0d', margin: '0 0 8px 0' }}>
              <BulbOutlined style={{ marginRight: '6px' }} />
              學習小貼士
            </Title>
            <Paragraph style={{ margin: 0, color: '#52c41a' }}>
              建議先觀看教學影片，再參考章節綱要理解重點，最後對照經文內容深入學習。
              每個主題都可以獨立折疊，方便您按需學習。
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChapterPage; 