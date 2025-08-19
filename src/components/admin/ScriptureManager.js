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
  Collapse
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import ChapterManager from './ChapterManager';
import Request from '../../utils/Request';
import { getApiUrl } from '../../config';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const ScriptureManager = () => {
  const [scriptures, setScriptures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingScripture, setEditingScripture] = useState(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState(null);
  const [form] = Form.useForm();

  // 載入資料
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await Request().post(
        getApiUrl('scriptures_getAll'),
        Qs.stringify({})
      );
      
      if (response.data.status === 200) {
        const scripturesData = response.data.result || [];
        
        // 為每個典籍載入章節數量
        const scripturesWithChapters = await Promise.all(
          scripturesData.map(async (scripture) => {
            try {
              const chaptersResponse = await Request().post(
                getApiUrl('chapters_getByScriptureId'),
                Qs.stringify({ scripture_id: scripture.id })
              );
              
              if (chaptersResponse.data.status === 200) {
                return {
                  ...scripture,
                  chapters: chaptersResponse.data.result || []
                };
              } else {
                return {
                  ...scripture,
                  chapters: []
                };
              }
            } catch (error) {
              console.warn(`載入典籍 ${scripture.name} 的章節失敗:`, error);
              return {
                ...scripture,
                chapters: []
              };
            }
          })
        );
        
        setScriptures(scripturesWithChapters);
      } else {
        console.error('載入典籍失敗:', response.data.message);
        message.error('載入典籍失敗');
      }
    } catch (error) {
      console.error('載入典籍錯誤:', error);
      message.error('載入典籍失敗');
    }
  };

  // 儲存典籍資料
  const saveScripture = async (scripture) => {
    try {
      const response = await Request().post(
        getApiUrl('scriptures_create'),
        Qs.stringify(scripture)
      );
      
      if (response.data.status === 200) {
        return true;
      } else {
        message.error(response.data.message || '儲存失敗');
        return false;
      }
    } catch (error) {
      console.error('儲存典籍錯誤:', error);
      message.error('儲存典籍失敗');
      return false;
    }
  };

  // 更新典籍資料
  const updateScripture = async (id, scripture) => {
    try {
      const response = await Request().post(
        getApiUrl('scriptures_update'),
        Qs.stringify({ id, ...scripture })
      );
      
      if (response.data.status === 200) {
        return true;
      } else {
        message.error(response.data.message || '更新失敗');
        return false;
      }
    } catch (error) {
      console.error('更新典籍錯誤:', error);
      message.error('更新典籍失敗');
      return false;
    }
  };

  // 刪除典籍資料
  const deleteScripture = async (id) => {
    try {
      const response = await Request().post(
        getApiUrl('scriptures_delete'),
        Qs.stringify({ id })
      );
      
      if (response.data.status === 200) {
        return true;
      } else {
        message.error(response.data.message || '刪除失敗');
        return false;
      }
    } catch (error) {
      console.error('刪除典籍錯誤:', error);
      message.error('刪除典籍失敗');
      return false;
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

      if (editingScripture) {
        // 編輯現有典籍
        const success = await updateScripture(editingScripture.id, values);
        if (success) {
          message.success('典籍更新成功！');
          loadData(); // 重新載入資料
          handleCancel();
        }
      } else {
        // 新增典籍
        const newScripture = {
          id: `scripture_${Date.now()}`,
          ...values,
          chapters: []
        };
        const success = await saveScripture(newScripture);
        if (success) {
          message.success('典籍新增成功！');
          loadData(); // 重新載入資料
          handleCancel();
        }
      }
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteScripture(id);
    if (success) {
      message.success('典籍刪除成功！');
      loadData(); // 重新載入資料
    }
  };

  const showChapterManager = (scripture) => {
    setSelectedScripture(scripture);
    setShowChapterModal(true);
  };

  const handleChapterModalClose = () => {
    setShowChapterModal(false);
    setSelectedScripture(null);
    // 重新載入資料以反映變更
    loadData();
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 操作按鈕 */}
        <Col span={24}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            新增典籍
          </Button>
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
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => showChapterManager(scripture)}
                          style={{ marginTop: '8px', padding: 0 }}
                        >
                          管理章節內容 →
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Paragraph style={{ color: '#999', fontSize: '12px' }}>
                          尚未新增章節
                        </Paragraph>
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => showChapterManager(scripture)}
                          style={{ marginTop: '4px', padding: 0 }}
                        >
                          新增章節 →
                        </Button>
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
            // rules={[{ required: true, message: '請輸入典籍描述' }]}
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
        />
      )}
    </div>
  );
};

export default ScriptureManager; 