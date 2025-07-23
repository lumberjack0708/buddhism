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
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import dataManager from '../../data/dataManager';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const QAManager = () => {
  const [qaList, setQaList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQA, setEditingQA] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [form] = Form.useForm();

  // 載入資料
  useEffect(() => {
    loadData();
    
    // 訂閱資料變化
    const unsubscribe = dataManager.subscribe(() => {
      loadData();
    });
    
    return unsubscribe;
  }, []);

  const loadData = () => {
    const data = dataManager.getQAData();
    setQaList(data);
  };

  // 儲存資料
  const saveData = (data) => {
    dataManager.saveQAData(data);
  };

  const showModal = (qa = null) => {
    setEditingQA(qa);
    setIsModalVisible(true);
    if (qa) {
      form.setFieldsValue({
        ...qa,
        tags: qa.tags || []
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingQA(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let newQAList;

      if (editingQA) {
        // 編輯現有問答
        newQAList = qaList.map(qa => 
          qa.id === editingQA.id 
            ? { ...qa, ...values, tags: values.tags || [] }
            : qa
        );
        message.success('問答更新成功！');
      } else {
        // 新增問答
        const newId = `qa_${Date.now()}`;
        const newQA = {
          id: newId,
          ...values,
          tags: values.tags || []
        };
        newQAList = [...qaList, newQA];
        message.success('問答新增成功！');
      }

      setQaList(newQAList);
      saveData(newQAList);
      handleCancel();
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  const handleDelete = (id) => {
    const newQAList = qaList.filter(qa => qa.id !== id);
    setQaList(newQAList);
    saveData(newQAList);
    message.success('問答刪除成功！');
  };

  const getCategories = () => {
    const categories = [...new Set(qaList.map(qa => qa.category))];
    return categories;
  };

  const getFilteredQAList = () => {
    if (!filteredCategory) return qaList;
    return qaList.filter(qa => qa.category === filteredCategory);
  };

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          {/* 操作按鈕 */}
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                新增問答
              </Button>
              <Select
                placeholder="按類別篩選"
                style={{ width: 200 }}
                allowClear
                value={filteredCategory}
                onChange={setFilteredCategory}
              >
                {getCategories().map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>

          {/* 問答列表 */}
          <Col span={24}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '16px',
              '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr'
              }
            }}>
              {getFilteredQAList().map(qa => (
                <Card
                  key={qa.id}
                  className="no-hover-effect"
                  title={
                    <Space>
                      <QuestionCircleOutlined style={{ color: '#1890ff' }} />
                      <Tag color="blue">{qa.category}</Tag>
                    </Space>
                  }
                  extra={
                    <Space>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(qa)}
                      />
                      <Popconfirm
                        title="確定要刪除這個問答嗎？"
                        onConfirm={() => handleDelete(qa.id)}
                        okText="確定"
                        cancelText="取消"
                      >
                        <Button
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Space>
                  }
                  style={{ height: '100%', minHeight: '300px' }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <Title level={5} style={{ color: '#722ed1', margin: '0 0 8px 0' }}>
                        問題
                      </Title>
                      <Paragraph style={{ color: '#333', fontSize: '14px' }}>
                        {qa.question}
                      </Paragraph>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <Title level={5} style={{ color: '#52c41a', margin: '0 0 8px 0' }}>
                        答案
                      </Title>
                      <Paragraph 
                        ellipsis={{ rows: 3 }} 
                        style={{ color: '#666', fontSize: '12px' }}
                      >
                        {qa.answer}
                      </Paragraph>
                    </div>

                    {qa.tags && qa.tags.length > 0 && (
                      <div>
                        <Title level={5} style={{ color: '#fa8c16', margin: '0 0 8px 0' }}>
                          標籤
                        </Title>
                        <div>
                          {qa.tags.map(tag => (
                            <Tag key={tag} color="orange" size="small">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Col>

          {getFilteredQAList().length === 0 && (
            <Col span={24}>
              <Card className="no-hover-effect" style={{ textAlign: 'center', backgroundColor: '#fafafa' }}>
                <MessageOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#999' }}>
                  {filteredCategory ? `「${filteredCategory}」類別下沒有問答` : '尚未新增任何問答'}
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  {filteredCategory ? '切換到其他類別或清除篩選' : '點擊「新增問答」開始建立佛法相關的問答內容'}
                </Paragraph>
              </Card>
            </Col>
          )}
        </Row>
      </div>

      {/* 新增/編輯問答彈窗 */}
      <Modal
        title={editingQA ? '編輯問答' : '新增問答'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
        okText="確定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="category"
            label="分類"
            rules={[{ required: true, message: '請輸入分類' }]}
          >
            <Input placeholder="例如：般若智慧、修行方法、經典理解" />
          </Form.Item>

          <Form.Item
            name="question"
            label="問題"
            rules={[{ required: true, message: '請輸入問題' }]}
          >
            <TextArea 
              rows={2}
              placeholder="請輸入佛法相關的問題"
            />
          </Form.Item>

          <Form.Item
            name="answer"
            label="答案"
            rules={[{ required: true, message: '請輸入答案' }]}
          >
            <TextArea 
              rows={6}
              placeholder="請輸入詳細的答案說明"
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="標籤 (選填)"
            extra="輸入相關標籤，按 Enter 新增"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="輸入標籤後按 Enter"
              tokenSeparators={[',', '，']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QAManager; 