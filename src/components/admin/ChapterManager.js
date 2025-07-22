import React, { useState, useEffect } from 'react';
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

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ChapterManager = ({ 
  visible, 
  onClose, 
  scripture, 
  isUsingExampleData 
}) => {
  const [chapters, setChapters] = useState([]);
  const [isChapterModalVisible, setIsChapterModalVisible] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [form] = Form.useForm();

  // 載入章節資料
  useEffect(() => {
    if (scripture && visible) {
      setChapters(scripture.chapters || []);
    }
  }, [scripture, visible]);

  // 儲存到 localStorage
  const saveScriptureData = (updatedChapters) => {
    const savedData = localStorage.getItem('adminScriptures');
    if (savedData) {
      try {
        const allScriptures = JSON.parse(savedData);
        const updatedScriptures = allScriptures.map(s => 
          s.id === scripture.id 
            ? { ...s, chapters: updatedChapters }
            : s
        );
        localStorage.setItem('adminScriptures', JSON.stringify(updatedScriptures));
      } catch (error) {
        console.error('儲存失敗:', error);
      }
    }
  };

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
      let updatedChapters;

      if (editingChapter) {
        // 編輯現有章節
        updatedChapters = chapters.map(c => 
          c.id === editingChapter.id 
            ? { ...c, ...values }
            : c
        );
        message.success('章節更新成功！');
      } else {
        // 新增章節
        const newId = `chapter_${Date.now()}`;
        const newChapter = {
          id: newId,
          ...values,
          sections: []
        };
        updatedChapters = [...chapters, newChapter];
        message.success('章節新增成功！');
      }

      setChapters(updatedChapters);
      saveScriptureData(updatedChapters);
      handleChapterModalCancel();
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  const handleChapterDelete = (id) => {
    const updatedChapters = chapters.filter(c => c.id !== id);
    setChapters(updatedChapters);
    saveScriptureData(updatedChapters);
    message.success('章節刪除成功！');
  };

  const showSectionManager = (chapter) => {
    setSelectedChapter(chapter);
    setShowSectionModal(true);
  };

  const handleSectionModalClose = () => {
    setShowSectionModal(false);
    setSelectedChapter(null);
    // 重新載入章節資料
    const savedData = localStorage.getItem('adminScriptures');
    if (savedData) {
      try {
        const allScriptures = JSON.parse(savedData);
        const currentScripture = allScriptures.find(s => s.id === scripture.id);
        if (currentScripture) {
          setChapters(currentScripture.chapters || []);
        }
      } catch (error) {
        console.error('重新載入資料失敗:', error);
      }
    }
  };

  return (
    <>
      <Modal
        title={`管理《${scripture?.name}》的章節`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={1000}
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
                disabled={isUsingExampleData}
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
                lg: 2,
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
                      !isUsingExampleData && (
                        <Space>
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => showChapterModal(chapter)}
                          />
                          <Popconfirm
                            title="確定要刪除這個章節嗎？"
                            onConfirm={() => handleChapterDelete(chapter.id)}
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
                      {chapter.description}
                    </Paragraph>
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <div>
                      <Title level={5} style={{ margin: '0 0 8px 0', color: '#52c41a' }}>
                        小節 ({chapter.sections?.length || 0})
                      </Title>
                      {chapter.sections?.length > 0 ? (
                        <Paragraph style={{ color: '#999', fontSize: '12px' }}>
                          已建立 {chapter.sections.length} 個小節
                        </Paragraph>
                      ) : (
                        <Paragraph style={{ color: '#999', fontSize: '12px' }}>
                          尚未新增小節
                        </Paragraph>
                      )}
                      
                      {!isUsingExampleData && (
                        <Button 
                          type="link" 
                          size="small"
                          icon={<SettingOutlined />}
                          onClick={() => showSectionManager(chapter)}
                          style={{ marginTop: '4px', padding: 0 }}
                        >
                          管理小節內容 →
                        </Button>
                      )}
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
        </Form>
      </Modal>

      {/* 小節管理彈窗 */}
      {selectedChapter && (
        <SectionManager
          visible={showSectionModal}
          onClose={handleSectionModalClose}
          scripture={scripture}
          chapter={selectedChapter}
          isUsingExampleData={isUsingExampleData}
        />
      )}
    </>
  );
};

export default ChapterManager; 