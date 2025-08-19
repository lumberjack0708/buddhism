import React, { createContext, useContext, useState } from 'react';
import { notification, Modal, Button, Input, Space, Typography } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CopyOutlined } from '@ant-design/icons';

const { Text } = Typography;

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
    duration: 4.5,
  });

  const showSuccess = (title, description, showModal = true, newPassword = null) => {
    // 1. 顯示 notification
    api.success({
      message: title,
      description: description,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    });

    // 2. 如果需要，顯示 Modal 確認
    if (showModal) {
      const PasswordDisplay = () => {
        const [copied, setCopied] = useState(false);

        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(newPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('複製失敗:', err);
          }
        };

        return (
          <div>
            <p>✅ {description}</p>
            {newPassword && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>新密碼：</Text>
                <Space.Compact style={{ width: '100%', marginTop: '8px' }}>
                  <Input
                    value={newPassword}
                    readOnly
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1890ff',
                      backgroundColor: '#f6f8fa'
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                    style={{ flexShrink: 0 }}
                  >
                    {copied ? '已複製' : '複製'}
                  </Button>
                </Space.Compact>
                <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                  點擊複製按鈕將新密碼複製到剪貼板
                </p>
              </div>
            )}
            <p style={{ marginTop: '16px', color: '#666' }}>
              請妥善保管您的新密碼，建議將其儲存在安全的地方
            </p>
          </div>
        );
      };

      Modal.success({
        title: title,
        content: <PasswordDisplay />,
        okText: '知道了',
        centered: true,
        width: 500,
      });
    }

  };

  const showError = (title, description) => {
    // 1. 顯示 notification
    api.error({
      message: title,
      description: description,
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
    });


  };

  const showWarning = (title, description) => {
    api.warning({
      message: title,
      description: description,
    });
  };

  const showInfo = (title, description) => {
    api.info({
      message: title,
      description: description,
    });
  };

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
