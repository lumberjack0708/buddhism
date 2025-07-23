/* global Qs */
import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Row,
  Col,
  Space,
  Popconfirm,
  message,
  Select,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import Request from '../utils/Request';
import { getApiUrl } from '../config';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

/**
 * 簡化版問答管理器 - 完整展示如何使用 Request().post 和 Qs.stringify
 * 參考 example 專案的實現方式
 */
const SimpleQAManager = () => {
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQA, setEditingQA] = useState(null);
  const [form] = Form.useForm();

  // 載入問答資料
  const loadQAData = async () => {
    setLoading(true);
    try {
      const response = await Request().post(
        getApiUrl('qa_getAll'),
        Qs.stringify({})
      );
      
      console.log('載入問答回應:', response.data);
      
      if (response.data.status === 200) {
        setQaList(response.data.result || []);
        message.success('問答資料載入成功');
      } else {
        message.error(response.data.message || '載入問答失敗');
        setQaList([]);
      }
    } catch (error) {
      console.error('載入問答錯誤:', error);
      message.error('網路錯誤，載入問答失敗');
      setQaList([]);
    } finally {
      setLoading(false);
    }
  };

  // 新增問答
  const addQA = async (qaData) => {
    try {
      const response = await Request().post(
        getApiUrl('qa_create'),
        Qs.stringify(qaData)
      );
      
      console.log('新增問答回應:', response.data);
      
      if (response.data.status === 200) {
        message.success('問答新增成功！');
        return true;
      } else {
        message.error(response.data.message || '新增問答失敗');
        return false;
      }
    } catch (error) {
      console.error('新增問答錯誤:', error);
      message.error('網路錯誤，新增問答失敗');
      return false;
    }
  };

  // 更新問答
  const updateQA = async (id, qaData) => {
    try {
      const response = await Request().post(
        getApiUrl('qa_update'),
        Qs.stringify({ id, ...qaData })
      );
      
      console.log('更新問答回應:', response.data);
      
      if (response.data.status === 200) {
        message.success('問答更新成功！');
        return true;
      } else {
        message.error(response.data.message || '更新問答失敗');
        return false;
      }
    } catch (error) {
      console.error('更新問答錯誤:', error);
      message.error('網路錯誤，更新問答失敗');
      return false;
    }
  };

  // 刪除問答
  const deleteQA = async (id) => {
    try {
      const response = await Request().post(
        getApiUrl('qa_delete'),
        Qs.stringify({ id })
      );
      
      console.log('刪除問答回應:', response.data);
      
      if (response.data.status === 200) {
        message.success('問答刪除成功！');
        return true;
      } else {
        message.error(response.data.message || '刪除問答失敗');
        return false;
      }
    } catch (error) {
      console.error('刪除問答錯誤:', error);
      message.error('網路錯誤，刪除問答失敗');
      return false;
    }
  };

  // 搜尋問答（使用多個參數的範例）
  const searchQA = async (keyword, category = null) => {
    setLoading(true);
    try {
      const params = { search: keyword };
      if (category) params.category = category;

      const response = await Request().post(
        getApiUrl('qa_search'),
        Qs.stringify(params)
      );
      
      console.log('搜尋問答回應:', response.data);
      
      if (response.data.status === 200) {
        setQaList(response.data.result || []);
        message.success(`找到 ${response.data.result?.length || 0} 個結果`);
      } else {
        message.error(response.data.message || '搜尋問答失敗');
        setQaList([]);
      }
    } catch (error) {
      console.error('搜尋問答錯誤:', error);
      message.error('網路錯誤，搜尋問答失敗');
      setQaList([]);
    } finally {
      setLoading(false);
    }
  };

  // 批量刪除（陣列參數範例）
  const batchDeleteQA = async (ids) => {
    try {
      // 使用 arrayFormat: 'brackets' 來處理陣列參數
      const response = await Request().post(
        getApiUrl('batchDeleteQA'),
        Qs.stringify({ ids }, { arrayFormat: 'brackets' })
      );
      
      console.log('批量刪除回應:', response.data);
      
      if (response.data.status === 200) {
        message.success(`成功刪除 ${ids.length} 個問答！`);
        return true;
      } else {
        message.error(response.data.message || '批量刪除失敗');
        return false;
      }
    } catch (error) {
      console.error('批量刪除錯誤:', error);
      message.error('網路錯誤，批量刪除失敗');
      return false;
    }
  };

  // 元件載入時載入資料
  useEffect(() => {
    loadQAData();
  }, []);

  // 開啟新增/編輯模態框
  const showModal = (qa = null) => {
    setEditingQA(qa);
    setIsModalVisible(true);
    if (qa) {
      form.setFieldsValue(qa);
    } else {
      form.resetFields();
    }
  };

  // 關閉模態框
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingQA(null);
    form.resetFields();
  };

  // 提交表單
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingQA) {
        // 編輯模式
        const success = await updateQA(editingQA.id, values);
        if (success) {
          loadQAData(); // 重新載入資料
          handleCancel();
        }
      } else {
        // 新增模式
        const newQA = {
          id: `qa_${Date.now()}`,
          ...values
        };
        const success = await addQA(newQA);
        if (success) {
          loadQAData(); // 重新載入資料
          handleCancel();
        }
      }
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  // 刪除確認
  const handleDelete = async (id) => {
    const success = await deleteQA(id);
    if (success) {
      loadQAData(); // 重新載入資料
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>
          <QuestionCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          簡化版問答管理器
        </Title>
        <Paragraph>
          此頁面完整展示如何使用 <Typography.Text code>Request().post</Typography.Text> 
          和 <Typography.Text code>Qs.stringify</Typography.Text> 進行 CRUD 操作。
        </Paragraph>

        <Space style={{ marginBottom: '16px' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            新增問答
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={loadQAData}
            loading={loading}
          >
            重新載入
          </Button>
        </Space>

        <Spin spinning={loading}>
          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            dataSource={qaList}
            renderItem={item => (
              <List.Item>
                <Card
                  size="small"
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <QuestionCircleOutlined style={{ marginRight: '8px' }} />
                      {item.category || '一般問題'}
                    </div>
                  }
                  actions={[
                    <Button 
                      type="text" 
                      icon={<EditOutlined />}
                      onClick={() => showModal(item)}
                    >
                      編輯
                    </Button>,
                    <Popconfirm
                      title="確定要刪除此問答嗎？"
                      onConfirm={() => handleDelete(item.id)}
                      okText="確定"
                      cancelText="取消"
                    >
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />}
                        danger
                      >
                        刪除
                      </Button>
                    </Popconfirm>
                  ]}
                >
                  <Paragraph strong>{item.question}</Paragraph>
                  <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                    {item.answer}
                  </Paragraph>
                </Card>
              </List.Item>
            )}
            locale={{ emptyText: '暫無問答資料' }}
          />
        </Spin>

        {/* 新增/編輯模態框 */}
        <Modal
          title={editingQA ? '編輯問答' : '新增問答'}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="category"
              label="分類"
              rules={[{ required: true, message: '請輸入分類' }]}
            >
              <Select placeholder="選擇或輸入分類">
                <Option value="佛教基礎">佛教基礎</Option>
                <Option value="禪修指導">禪修指導</Option>
                <Option value="經典解說">經典解說</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="question"
              label="問題"
              rules={[{ required: true, message: '請輸入問題' }]}
            >
              <Input placeholder="請輸入問題" />
            </Form.Item>

            <Form.Item
              name="answer"
              label="答案"
              rules={[{ required: true, message: '請輸入答案' }]}
            >
              <TextArea 
                placeholder="請輸入答案"
                rows={6}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingQA ? '更新' : '新增'}
                </Button>
                <Button onClick={handleCancel}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default SimpleQAManager; 