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
  Collapse,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import ChapterManager from './ChapterManager';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const ScriptureManager = ({ isUsingExampleData }) => {
  const [scriptures, setScriptures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingScripture, setEditingScripture] = useState(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState(null);
  const [form] = Form.useForm();

  // 模擬資料載入
  useEffect(() => {
    if (isUsingExampleData) {
      // 載入範例資料
      setScriptures([
        {
          id: 'mahaPrajnaparamita',
          name: '大般若波羅蜜多經',
          description: '般若部重要經典',
          chapters: [
            { id: 'chapter1', name: '第一章', description: '經文開始，敘述說法因緣' },
            { id: 'chapter2', name: '第二章', description: '講述觀照般若的修學方法' }
          ]
        },
        {
          id: 'diamondSutra',
          name: '金剛般若波羅蜜經',
          description: '般若系經典中最著名的經典之一',
          chapters: [
            { id: 'chapter1', name: '法會因由分第一', description: '敘述法會的因緣' },
            { id: 'chapter2', name: '善現啟請分第二', description: '須菩提向佛請法' }
          ]
        },
        {
          id: 'heartSutra',
          name: '般若波羅蜜多心經',
          description: '般若經典的精髓濃縮',
          chapters: [
            { id: 'chapter1', name: '觀自在菩薩', description: '心經全文' }
          ]
        }
      ]);
    } else {
      // 載入管理員資料 (可以從 localStorage 或 API)
      const savedData = localStorage.getItem('adminScriptures');
      setScriptures(savedData ? JSON.parse(savedData) : []);
    }
  }, [isUsingExampleData]);

  // 儲存到 localStorage
  const saveToStorage = (data) => {
    if (!isUsingExampleData) {
      localStorage.setItem('adminScriptures', JSON.stringify(data));
    }
  };

  const showModal = (scripture = null) => {
    setEditingScripture(scripture);
    setIsModalVisible(true);
    if (scripture) {
      form.setFieldsValue(scripture);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingScripture(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let newScriptures;

      if (editingScripture) {
        // 編輯現有典籍
        newScriptures = scriptures.map(s => 
          s.id === editingScripture.id ? { ...s, ...values } : s
        );
        message.success('典籍更新成功！');
      } else {
        // 新增典籍
        const newId = `scripture_${Date.now()}`;
        const newScripture = {
          id: newId,
          ...values,
          chapters: []
        };
        newScriptures = [...scriptures, newScripture];
        message.success('典籍新增成功！');
      }

      setScriptures(newScriptures);
      saveToStorage(newScriptures);
      handleCancel();
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  const handleDelete = (id) => {
    const newScriptures = scriptures.filter(s => s.id !== id);
    setScriptures(newScriptures);
    saveToStorage(newScriptures);
    message.success('典籍刪除成功！');
  };

  const showChapterManager = (scripture) => {
    setSelectedScripture(scripture);
    setShowChapterModal(true);
  };

  const handleChapterModalClose = () => {
    setShowChapterModal(false);
    setSelectedScripture(null);
    // 重新載入資料以反映變更
    const savedData = localStorage.getItem('adminScriptures');
    if (savedData) {
      try {
        setScriptures(JSON.parse(savedData));
      } catch (error) {
        console.error('重新載入資料失敗:', error);
      }
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 操作按鈕 */}
        <Col span={24}>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              disabled={isUsingExampleData}
            >
              新增典籍
            </Button>
            {isUsingExampleData && (
              <Tag color="orange">範例模式：無法編輯</Tag>
            )}
          </Space>
        </Col>

        {/* 典籍列表 */}
        <Col span={24}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
            }}
            dataSource={scriptures}
            renderItem={scripture => (
              <List.Item>
                <Card
                  title={
                    <Space>
                      <BookOutlined style={{ color: '#722ed1' }} />
                      {scripture.name}
                    </Space>
                  }
                  extra={
                    !isUsingExampleData && (
                      <Space>
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => showModal(scripture)}
                        />
                        <Popconfirm
                          title="確定要刪除這部典籍嗎？"
                          onConfirm={() => handleDelete(scripture.id)}
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
                    )
                  }
                  style={{ height: '100%' }}
                >
                  <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#666' }}>
                    {scripture.description}
                  </Paragraph>
                  
                  <div style={{ marginTop: '12px' }}>
                    <Title level={5} style={{ margin: '0 0 8px 0', color: '#722ed1' }}>
                      章節 ({scripture.chapters?.length || 0})
                    </Title>
                    {scripture.chapters?.length > 0 ? (
                      <div>
                        <Collapse size="small" ghost>
                          <Panel 
                            header={`查看 ${scripture.chapters.length} 個章節`} 
                            key="chapters"
                          >
                            {scripture.chapters.map(chapter => (
                              <div key={chapter.id} style={{ 
                                padding: '4px 0', 
                                borderBottom: '1px solid #f0f0f0',
                                fontSize: '12px'
                              }}>
                                <Space>
                                  <FileTextOutlined style={{ color: '#52c41a' }} />
                                  {chapter.name}
                                </Space>
                              </div>
                            ))}
                          </Panel>
                        </Collapse>
                        {!isUsingExampleData && (
                          <Button 
                            type="link" 
                            size="small"
                            onClick={() => showChapterManager(scripture)}
                            style={{ marginTop: '8px', padding: 0 }}
                          >
                            管理章節內容 →
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Paragraph style={{ color: '#999', fontSize: '12px' }}>
                          尚未新增章節
                        </Paragraph>
                        {!isUsingExampleData && (
                          <Button 
                            type="link" 
                            size="small"
                            onClick={() => showChapterManager(scripture)}
                            style={{ marginTop: '4px', padding: 0 }}
                          >
                            新增章節 →
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>

      {/* 新增/編輯典籍彈窗 */}
      <Modal
        title={editingScripture ? '編輯典籍' : '新增典籍'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
        okText="確定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="典籍名稱"
            rules={[{ required: true, message: '請輸入典籍名稱' }]}
          >
            <Input placeholder="例如：金剛般若波羅蜜經" />
          </Form.Item>

          <Form.Item
            name="description"
            label="典籍描述"
            rules={[{ required: true, message: '請輸入典籍描述' }]}
          >
            <TextArea 
              rows={3}
              placeholder="簡要說明這部典籍的內容和特色"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 章節管理彈窗 */}
      {selectedScripture && (
        <ChapterManager
          visible={showChapterModal}
          onClose={handleChapterModalClose}
          scripture={selectedScripture}
          isUsingExampleData={isUsingExampleData}
        />
      )}
    </div>
  );
};

export default ScriptureManager; 