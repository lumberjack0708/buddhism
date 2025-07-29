import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, SettingOutlined } from '@ant-design/icons';
import apiManager from '../utils/apiManager';

const { Title } = Typography;

const AdminLoginModal = ({ visible, onCancel, onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMessage(''); // 清除之前的錯誤訊息
    
    try {
      const { username, password } = values;
      
      const result = await apiManager.adminLogin(username, password);
      
      if (result.success) {
        message.success(result.message || '登入成功！');
        form.resetFields();
        setErrorMessage('');
        onLoginSuccess(result.data); // 傳遞用戶資料給父組件
      } else {
        // 檢查是否為密碼錯誤
        if (result.message && result.message.includes('密碼錯誤')) {
          setErrorMessage('密碼錯誤，請檢查帳號密碼');
        } else if (result.message && result.message.includes('用戶名或密碼錯誤')) {
          setErrorMessage('用戶名或密碼錯誤，請檢查帳號密碼');
        } else {
          setErrorMessage(result.message || '登入失敗，請檢查帳號密碼');
        }
      }
    } catch (error) {
      console.error('登入過程發生錯誤:', error);
      setErrorMessage('登入過程發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setErrorMessage(''); // 清除錯誤訊息
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <SettingOutlined style={{ color: '#722ed1', fontSize: '24px', marginRight: '8px' }} />
          <Title level={4} style={{ display: 'inline', margin: 0, color: '#722ed1' }}>
            管理員登入
          </Title>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={400}
      centered
      maskClosable={false}
    >
      <div style={{ padding: '20px 0' }}>
        <Form
          form={form}
          name="adminLogin"
          onFinish={handleLogin}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="管理員帳號"
            rules={[
              { required: true, message: '請輸入管理員帳號' },
              { min: 3, message: '帳號至少需要3個字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              placeholder="請輸入管理員帳號"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="管理員密碼"
            rules={[
              { required: true, message: '請輸入管理員密碼' },
              { min: 4, message: '密碼至少需要4個字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#722ed1' }} />}
              placeholder="請輸入管理員密碼"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? '登入中...' : '登入管理員後台'}
            </Button>
          </Form.Item>
        </Form>

        {/* 錯誤訊息顯示區域 */}
          {errorMessage && (
            <div style={{ 
              color: '#ff4d4f', 
              fontSize: '16px', 
              textAlign: 'center', 
              marginBottom: '0px',
              padding: '0px',
              fontWeight: 'bold',
              marginTop: '10px'
            }}>
              {errorMessage}
            </div>
          )}
      </div>
    </Modal>
  );
};

export default AdminLoginModal; 