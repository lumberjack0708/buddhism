import React, { useState } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Typography,
  Row,
  Col,
  Space,
  message,
  Alert
} from 'antd';
import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import apiManager from '../../utils/apiManager';
import { useNotification } from '../../contexts/NotificationContext';

const { Title, Text } = Typography;

const UserManager = ({ currentUser }) => {
  const [updatePasswordForm] = Form.useForm();
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const { showSuccess, showError } = useNotification();




  // 修改密碼（只能修改自己的密碼）
  const handleUpdatePassword = async (values) => {
    setUpdatePasswordLoading(true);
    try {
      const { newPassword } = values;
      
      // 使用當前登入用戶的用戶名
      const username = currentUser?.username;
      
      if (!username) {
        showError('錯誤', '無法取得當前用戶資訊');
        return;
      }
      
      const result = await apiManager.updatePassword(username, newPassword);
      
      if (result.success) {
        // 使用 context 通知系統
        showSuccess(
          '密碼修改成功', 
          `用戶 ${username} 的密碼已成功修改，新密碼為：${newPassword}`,
          true, // 顯示 Modal
          newPassword // 傳遞新密碼給 Modal
        );
        
        // 備用通知
        message.success('密碼修改成功！');
        
        updatePasswordForm.resetFields();
      } else {
        showError('修改密碼失敗', result.message || '修改密碼過程中發生錯誤');
        message.error(result.message || '修改密碼失敗');
      }
    } catch (error) {
      console.error('修改密碼過程發生錯誤:', error);
      
      showError('系統錯誤', '修改密碼過程發生錯誤，請稍後再試');
      message.error('修改密碼過程發生錯誤，請稍後再試');
    } finally {
      setUpdatePasswordLoading(false);
    }
  };



  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>
        <UserOutlined style={{ marginRight: '8px' }} />
        用戶管理
      </Title>
      


      <Row gutter={[24, 24]} justify="center">
        {/* 修改密碼 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LockOutlined />
                <span>修改密碼</span>
              </Space>
            }
            bordered={false}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Alert
                message={
                  <span>
                    正在修改用戶 <Text strong>{currentUser?.username || '未知用戶'}</Text> 的密碼
                  </span>
                }
                type="info"
                showIcon
              />
              
              <Form
                form={updatePasswordForm}
                name="updatePassword"
                onFinish={handleUpdatePassword}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item
                  name="newPassword"
                  label="新密碼"
                  rules={[
                    { required: true, message: '請輸入新密碼' },
                    { min: 4, message: '新密碼至少需要4個字符' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#722ed1' }} />}
                    placeholder="請輸入新密碼"
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updatePasswordLoading}
                    disabled={!currentUser?.username}
                    block
                    size="large"
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    {updatePasswordLoading ? '修改中...' : '修改我的密碼'}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Card>
        </Col>
      </Row>




    </div>
  );
};

export default UserManager;
