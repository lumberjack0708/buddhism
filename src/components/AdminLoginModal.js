import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;

// 管理員帳密直接寫死哈哈
const ADMIN_CREDENTIALS = {
  username: 'ADM1',
  password: 'test123'
};

const AdminLoginModal = ({ visible, onCancel, onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    
    // 模擬登入處理時間
    setTimeout(() => {
      const { username, password } = values;
      
      // 驗證帳號密碼
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        message.success('登入成功！');
        form.resetFields();
        onLoginSuccess();
      } else {
        message.error('帳號或密碼錯誤，請重新輸入');
      }
      
      setLoading(false);
    }, 100);
  };

  const handleCancel = () => {
    form.resetFields();
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
              { min: 6, message: '密碼至少需要6個字符' }
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
      </div>
    </Modal>
  );
};

export default AdminLoginModal; 