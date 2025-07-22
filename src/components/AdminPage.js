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
  Divider,
  Upload,
  Space,
  message 
} from 'antd';
import { 
  ArrowLeftOutlined,
  BookOutlined, 
  QuestionCircleOutlined,
  DatabaseOutlined,
  SettingOutlined,
  DownloadOutlined,
  UploadOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import ScriptureManager from './admin/ScriptureManager';
import QAManager from './admin/QAManager';
import { exportAllData, importAllData, generateSampleJSON } from '../utils/dataExportImport';

const { Title, Paragraph } = Typography;

const AdminPage = ({ onBackToHome, isUsingExampleData, onDataModeToggle }) => {
  const [activeTab, setActiveTab] = useState('scriptures');

  // 處理資料匯出
  const handleExport = () => {
    exportAllData();
  };

  // 處理資料匯入
  const handleImport = async (file) => {
    const result = await importAllData(file);
    if (result.success) {
      message.success(result.message);
      // 重新整理頁面以反映新資料
      window.location.reload();
    } else {
      message.error(result.message);
    }
    return false; // 阻止Upload組件的默認上傳行為
  };

  // 生成範例檔案
  const handleGenerateSample = () => {
    generateSampleJSON();
  };

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

        {/* JSON 資料管理 */}
        <Col span={24}>
          <Card className="no-hover-effect" style={{ backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
            <Title level={5} style={{ margin: '0 0 12px 0', color: '#d46b08' }}>
              <FileTextOutlined style={{ marginRight: '8px' }} />
              JSON 資料管理
            </Title>
            <Paragraph style={{ margin: '0 0 16px 0', color: '#fa8c16' }}>
              匯出資料為JSON檔案進行永久保存，或匯入之前備份的JSON檔案
            </Paragraph>
            
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Button 
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  block
                  disabled={isUsingExampleData}
                  style={{ marginBottom: '8px' }}
                >
                  匯出資料
                </Button>
                {isUsingExampleData && (
                  <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
                    範例模式無法匯出
                  </div>
                )}
              </Col>
              
              <Col xs={24} sm={8}>
                <Upload
                  accept=".json"
                  beforeUpload={handleImport}
                  showUploadList={false}
                  disabled={isUsingExampleData}
                >
                  <Button 
                    icon={<UploadOutlined />}
                    block
                    disabled={isUsingExampleData}
                    style={{ marginBottom: '8px' }}
                  >
                    匯入資料
                  </Button>
                </Upload>
                {isUsingExampleData && (
                  <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
                    範例模式無法匯入
                  </div>
                )}
              </Col>
              
              <Col xs={24} sm={8}>
                <Button 
                  icon={<FileTextOutlined />}
                  onClick={handleGenerateSample}
                  block
                  style={{ marginBottom: '8px' }}
                >
                  下載範例檔案
                </Button>
                <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
                  查看JSON格式
                </div>
              </Col>
            </Row>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Alert
              message="重要提醒"
              description={
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px' }}>
                  <li>匯出的JSON檔案可在任何電腦上使用</li>
                  <li>定期備份資料可防止意外遺失</li>
                  <li>匯入新資料會覆蓋現有的管理員資料</li>
                  <li>建議在匯入前先匯出當前資料做備份</li>
                </ul>
              }
              type="warning"
              showIcon
              style={{ fontSize: '12px' }}
            />
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
              <Col xs={24} md={8}>
                <Paragraph style={{ margin: 0, color: '#1677ff' }}>
                  <strong>典籍管理：</strong><br/>
                  • 新增、編輯、刪除佛法典籍<br/>
                  • 管理章節和小節內容<br/>
                  • 設定YouTube影片連結<br/>
                  • 編輯經文、綱要、重點說明
                </Paragraph>
              </Col>
              <Col xs={24} md={8}>
                <Paragraph style={{ margin: 0, color: '#1677ff' }}>
                  <strong>問答管理：</strong><br/>
                  • 新增、編輯佛法相關問答<br/>
                  • 設定問答分類和標籤<br/>
                  • 管理問答內容和答案<br/>
                  • 支援搜尋和篩選功能
                </Paragraph>
              </Col>
              <Col xs={24} md={8}>
                <Paragraph style={{ margin: 0, color: '#1677ff' }}>
                  <strong>JSON檔案管理：</strong><br/>
                  • 匯出資料為JSON檔案<br/>
                  • 匯入之前備份的資料<br/>
                  • 跨裝置資料同步<br/>
                  • 永久保存和備份資料
                </Paragraph>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Paragraph style={{ margin: 0, color: '#1677ff', fontSize: '12px' }}>
              💡 提示：定期匯出JSON檔案可確保資料永久保存，建議先在範例模式下熟悉操作流程
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPage; 