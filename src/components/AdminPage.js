import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Button, 
  Typography
} from 'antd';
import { 
  ArrowLeftOutlined,
  BookOutlined, 
  QuestionCircleOutlined,
  UserOutlined,
  DatabaseOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import ScriptureManager from './admin/ScriptureManager';
import QAManager from './admin/QAManager';
import UserManager from './admin/UserManager';

const { Title, Paragraph } = Typography;

const AdminPage = ({ onBackToHome, onLogout, isLoggedIn, currentUser }) => {
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
        <ScriptureManager />
      ),
    },
    {
      key: 'qa',
      label: (
        <span>
          <QuestionCircleOutlined />
          答問管理
        </span>
      ),
      children: (
        <QAManager />
      ),
    },
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined />
          用戶管理
        </span>
      ),
      children: (
        <UserManager currentUser={currentUser} />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Card className="no-hover-effect" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={onBackToHome}
          >
            返回首頁
          </Button>
          <Button 
            type="default"
            danger
            icon={<LogoutOutlined />} 
            onClick={onLogout}
          >
            登出
          </Button>
        </div>
        <Title level={2} style={{ margin: 0, color: '#722ed1' }}>
          <DatabaseOutlined style={{ marginRight: '8px' }} />
          管理員後台
        </Title>
        <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
          管理佛法典籍內容和問答集
        </Paragraph>
      </Card>

      <Card className="no-hover-effect">
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