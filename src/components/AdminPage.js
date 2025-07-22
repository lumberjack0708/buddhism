import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Alert,
  Divider,
  Upload,
  message 
} from 'antd';
import { 
  ArrowLeftOutlined,
  BookOutlined, 
  QuestionCircleOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  UploadOutlined,
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import ScriptureManager from './admin/ScriptureManager';
import QAManager from './admin/QAManager';
import { exportAllData, importAllData, generateSampleJSON } from '../utils/dataExportImport';
import dataManager from '../data/dataManager';

const { Title, Paragraph } = Typography;

const AdminPage = ({ onBackToHome }) => {
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
      // 清除 dataManager 快取並重新載入
      dataManager.clearCache();
      dataManager.notify();
    } else {
      message.error(result.message);
    }
    return false; // 阻止Upload組件的默認上傳行為
  };

  // 生成範例檔案
  const handleGenerateSample = () => {
    generateSampleJSON();
  };

  // 重設為預設資料
  const handleResetToDefault = async () => {
    const success = await dataManager.resetToDefault();
    if (success) {
      message.success('已重設為預設資料！');
    } else {
      message.error('重設失敗，請稍後再試');
    }
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
        <ScriptureManager />
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
        <QAManager />
      ),
    },
    {
      key: 'data',
      label: (
        <span>
          <DatabaseOutlined />
          資料管理
        </span>
      ),
      children: (
        <div style={{ padding: '24px' }}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Alert
                message="資料管理說明"
                description="在這裡您可以匯出、匯入、重設網站的所有資料。資料以 JSON 格式儲存在瀏覽器的 localStorage 中。"
                type="info"
                showIcon
                style={{ marginBottom: '24px' }}
              />
            </Col>

            <Col md={12} xs={24}>
              <Card 
                title={
                  <span>
                    <DownloadOutlined style={{ marginRight: '8px' }} />
                    匯出資料
                  </span>
                }
              >
                <Paragraph>
                  將目前所有的典籍和問答資料匯出為 JSON 檔案，可用於備份或轉移到其他環境。
                </Paragraph>
                <Button 
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  block
                >
                  匯出所有資料
                </Button>
              </Card>
            </Col>

            <Col md={12} xs={24}>
              <Card 
                title={
                  <span>
                    <UploadOutlined style={{ marginRight: '8px' }} />
                    匯入資料
                  </span>
                }
              >
                <Paragraph>
                  從 JSON 檔案匯入資料，將會覆蓋目前的所有資料。請確保檔案格式正確。
                </Paragraph>
                <Upload
                  accept=".json"
                  beforeUpload={handleImport}
                  showUploadList={false}
                >
                  <Button 
                    icon={<UploadOutlined />}
                    block
                  >
                    選擇JSON檔案匯入
                  </Button>
                </Upload>
              </Card>
            </Col>

            <Col md={12} xs={24}>
              <Card 
                title={
                  <span>
                    <FileTextOutlined style={{ marginRight: '8px' }} />
                    範例檔案
                  </span>
                }
              >
                <Paragraph>
                  下載包含範例資料結構的JSON檔案，可作為匯入格式的參考。
                </Paragraph>
                <Button 
                  type="default"
                  icon={<FileTextOutlined />}
                  onClick={handleGenerateSample}
                  block
                >
                  下載範例JSON
                </Button>
              </Card>
            </Col>

            <Col md={12} xs={24}>
              <Card 
                title={
                  <span>
                    <ReloadOutlined style={{ marginRight: '8px' }} />
                    重設資料
                  </span>
                }
              >
                <Paragraph>
                  將所有資料重設為預設的範例內容。此操作無法復原，請謹慎使用。
                </Paragraph>
                <Button 
                  type="default"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={handleResetToDefault}
                  block
                >
                  重設為預設資料
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={onBackToHome}
          style={{ marginBottom: '16px' }}
        >
          返回首頁
        </Button>
        <Title level={2} style={{ margin: 0, color: '#722ed1' }}>
          <DatabaseOutlined style={{ marginRight: '8px' }} />
          管理員後台
        </Title>
        <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
          管理佛法典籍內容、問答集，以及資料的匯出入操作
        </Paragraph>
      </Card>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>
    </div>
  );
};

export default AdminPage; 