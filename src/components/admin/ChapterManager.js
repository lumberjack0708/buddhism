import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Card,
  List,
  Button,
  Form,
  Input,
  Typography,
  Row,
  Col,
  Space,
  Popconfirm,
  message,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';
import SectionManager from './SectionManager';
/* global Qs */
import Request from '../../utils/Request';
import { getApiUrl } from '../../config';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ChapterManager = ({ 
  visible, 
  onClose, 
  scripture
}) => {
  const [chapters, setChapters] = useState([]);
  const [isChapterModalVisible, setIsChapterModalVisible] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [form] = Form.useForm();

  // 載入章節列表
  const loadChapters = useCallback(async () => {
    try {
      const response = await Request().post(
        getApiUrl('chapters_getByScriptureId'),
        Qs.stringify({ scripture_id: scripture.id })
      );
      
      if (response.data.status === 200) {
        setChapters(response.data.result || []);
      } else {
        message.error('載入章節失敗: ' + response.data.message);
        setChapters([]);
      }
    } catch (error) {
      console.error('載入章節錯誤:', error);
      message.error('載入章節失敗');
      setChapters([]);
    }
  }, [scripture]);

  // 載入章節資料
  useEffect(() => {
    if (scripture && visible) {
      loadChapters();
    }
  }, [scripture, visible, loadChapters]);

  const showChapterModal = (chapter = null) => {
    setEditingChapter(chapter);
    setIsChapterModalVisible(true);
    if (chapter) {
      form.setFieldsValue(chapter);
    } else {
      form.resetFields();
    }
  };

  const handleChapterModalCancel = () => {
    setIsChapterModalVisible(false);
    setEditingChapter(null);
    form.resetFields();
  };

  const handleChapterSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingChapter) {
        // 編輯現有章節
        const response = await Request().post(
          getApiUrl('chapters_update'),
          Qs.stringify({
            id: editingChapter.id,
            scripture_id: scripture.id,
            name: values.name,
            description: values.description,
            order_index: values.order_index ? parseInt(values.order_index) : 0
          })
        );
        
        if (response.data.status === 200) {
          message.success('章節更新成功！');
          loadChapters(); // 重新載入章節列表
          handleChapterModalCancel();
        } else {
          message.error('更新失敗: ' + response.data.message);
        }
      } else {
        // 新增章節
        const newId = `chapter_${Date.now()}`;
        const response = await Request().post(
          getApiUrl('chapters_create'),
          Qs.stringify({
            id: newId,
            scripture_id: scripture.id,
            name: values.name,
            description: values.description,
            order_index: values.order_index ? parseInt(values.order_index) : 0
          })
        );
        
        if (response.data.status === 200) {
          message.success('章節新增成功！');
          loadChapters(); // 重新載入章節列表
          handleChapterModalCancel();
        } else {
          message.error('新增失敗: ' + response.data.message);
        }
      }
    } catch (error) {
      console.error('提交章節錯誤:', error);
      message.error('操作失敗，請稍後再試');
    }
  };

  const handleChapterDelete = async (chapter) => {
    try {
      const response = await Request().post(
        getApiUrl('chapters_delete'),
        Qs.stringify({ id: chapter.id })
      );
      
      if (response.data.status === 200) {
        message.success('章節刪除成功！');
        loadChapters(); // 重新載入章節列表
      } else {
        message.error('刪除失敗: ' + response.data.message);
      }
    } catch (error) {
      console.error('刪除章節錯誤:', error);
      message.error('刪除失敗，請稍後再試');
    }
  };

  const showSectionManager = (chapter) => {
    setSelectedChapter(chapter);
    setShowSectionModal(true);
  };

  const handleSectionModalClose = async () => {
    setShowSectionModal(false);
    setSelectedChapter(null);
    // 重新載入章節資料
    loadChapters();
  };

  return (
    <>
      <Modal
        title={`管理《${scripture?.name}》的章節`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={1400}
        style={{ top: 20 }}
      >
        <Row gutter={[16, 16]}>
          {/* 操作按鈕 */}
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showChapterModal()}
              >
                新增章節
              </Button>
            </Space>
          </Col>

          {/* 章節列表 */}
          <Col span={24}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 4,
              }}
              dataSource={chapters}
              renderItem={chapter => (
                <List.Item>
                  <Card
                    title={
                      <Space>
                        <FileTextOutlined style={{ color: '#722ed1' }} />
                        {chapter.name}
                      </Space>
                    }
                    extra={
                        <Space>
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => showChapterModal(chapter)}
                          />
                          <Popconfirm
                            title="確定要刪除這個章節嗎？"
                            onConfirm={() => handleChapterDelete(chapter)}
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
                      {chapter.description}
                    </Paragraph>
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <div>
                      <Title level={5} style={{ margin: '0 0 8px 0', color: '#52c41a' }}>
                        小節管理
                      </Title>
                      <Paragraph style={{ color: '#999', fontSize: '12px' }}>
                        點擊管理按鈕來編輯這個章節的小節內容
                      </Paragraph>
                      
                      <Button 
                        type="link" 
                        size="small"
                        icon={<SettingOutlined />}
                        onClick={() => showSectionManager(chapter)}
                        style={{ marginTop: '4px', padding: 0 }}
                      >
                        管理小節內容 →
                      </Button>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Col>

          {chapters.length === 0 && (
            <Col span={24}>
              <Card style={{ textAlign: 'center', backgroundColor: '#fafafa' }}>
                <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#999' }}>
                  尚未新增任何章節
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  點擊「新增章節」開始為這部典籍建立章節結構
                </Paragraph>
              </Card>
            </Col>
          )}
        </Row>
      </Modal>

      {/* 新增/編輯章節彈窗 */}
      <Modal
        title={editingChapter ? '編輯章節' : '新增章節'}
        open={isChapterModalVisible}
        onOk={handleChapterSubmit}
        onCancel={handleChapterModalCancel}
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
            label="章節名稱"
            rules={[{ required: true, message: '請輸入章節名稱' }]}
          >
            <Input placeholder="例如：第一章、法會因由分第一" />
          </Form.Item>

          <Form.Item
            name="description"
            label="章節描述"
            rules={[{ required: true, message: '請輸入章節描述' }]}
          >
            <TextArea 
              rows={3}
              placeholder="簡要說明這個章節的主要內容"
            />
          </Form.Item>

          <Form.Item
            name="order_index"
            label="排序編號"
            tooltip="數字越小排序越前面，留空則自動排序"
          >
            <Input 
              type="number"
              placeholder="例如：1, 2, 3..."
              min="0"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 小節管理彈窗 */}
      {selectedChapter && (
        <SectionManager
          visible={showSectionModal}
          onClose={handleSectionModalClose}
          scripture={scripture}
          chapter={selectedChapter}
        />
      )}
    </>
  );
};

export default ChapterManager; 