import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Button, 
  Switch, 
  Typography, 
  Row, 
  Col, 
  Alert,
  Divider 
} from 'antd';
import { 
  ArrowLeftOutlined,
  BookOutlined, 
  QuestionCircleOutlined,
  DatabaseOutlined,
  SettingOutlined
} from '@ant-design/icons';
import ScriptureManager from './admin/ScriptureManager';
import QAManager from './admin/QAManager';

const { Title, Paragraph } = Typography;

const AdminPage = ({ onBackToHome, isUsingExampleData, onDataModeToggle }) => {
  const [activeTab, setActiveTab] = useState('scriptures');

  const tabItems = [
    {
      key: 'scriptures',
      label: (
        <span>
          <BookOutlined />
          典籍管理
        </span>
      ),
      children: (
        <ScriptureManager isUsingExampleData={isUsingExampleData} />
      ),
    },
    {
      key: 'qa',
      label: (
        <span>
          <QuestionCircleOutlined />
          問答管理
        </span>
      ),
      children: (
        <QAManager isUsingExampleData={isUsingExampleData} />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
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
              <SettingOutlined style={{ marginRight: '8px' }} />
              管理員後台
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              管理網站內容：典籍資料、問答集、影片連結等
            </Paragraph>
          </Card>
        </Col>

        {/* 資料模式切換 */}
        <Col span={24}>
          <Card className="no-hover-effect" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={5} style={{ margin: '0 0 8px 0', color: '#389e0d' }}>
                  <DatabaseOutlined style={{ marginRight: '8px' }} />
                  資料模式
                </Title>
                <Paragraph style={{ margin: 0, color: '#52c41a' }}>
                  {isUsingExampleData ? '目前使用範例資料' : '目前使用管理員資料'}
                </Paragraph>
              </Col>
              <Col>
                <Switch
                  checked={isUsingExampleData}
                  onChange={onDataModeToggle}
                  checkedChildren="範例"
                  unCheckedChildren="管理"
                  size="large"
                />
              </Col>
            </Row>
            {isUsingExampleData && (
              <Alert
                style={{ marginTop: '12px' }}
                message="範例模式"
                description="目前顯示的是預設範例資料，您可以切換到管理模式來使用自己的資料"
                type="info"
                showIcon
              />
            )}
          </Card>
        </Col>

        {/* 管理功能選項卡 */}
        <Col span={24}>
          <Card className="no-hover-effect">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
              tabBarStyle={{ marginBottom: '24px' }}
            />
          </Card>
        </Col>

        {/* 使用說明 */}
        <Col span={24}>
          <Card className="no-hover-effect" style={{ backgroundColor: '#e6f4ff', border: '1px solid #91caff' }}>
            <Title level={5} style={{ color: '#0958d9', margin: '0 0 12px 0' }}>
              使用說明
            </Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Paragraph style={{ margin: 0, color: '#1677ff' }}>
                  <strong>典籍管理：</strong><br/>
                  • 新增、編輯、刪除佛法典籍<br/>
                  • 管理章節和小節內容<br/>
                  • 設定YouTube影片連結<br/>
                  • 編輯經文、綱要、重點說明
                </Paragraph>
              </Col>
              <Col xs={24} md={12}>
                <Paragraph style={{ margin: 0, color: '#1677ff' }}>
                  <strong>問答管理：</strong><br/>
                  • 新增、編輯佛法相關問答<br/>
                  • 設定問答分類和標籤<br/>
                  • 管理問答內容和答案<br/>
                  • 支援搜尋和篩選功能
                </Paragraph>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Paragraph style={{ margin: 0, color: '#1677ff', fontSize: '12px' }}>
              💡 提示：修改後的內容會立即生效，建議先在範例模式下熟悉操作流程
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPage; 