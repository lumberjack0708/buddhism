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
  Divider,
  Tabs,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  BulbOutlined
} from '@ant-design/icons';
/* global Qs */
import Request from '../../utils/Request';
import { getApiUrl } from '../../config';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const SectionManager = ({ 
  visible, 
  onClose, 
  scripture,
  chapter
}) => {
  const [sections, setSections] = useState([]);
  const [isSectionModalVisible, setIsSectionModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionThemes, setSectionThemes] = useState([]);
  const [isThemeFormVisible, setIsThemeFormVisible] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [form] = Form.useForm();
  const [themeForm] = Form.useForm();

  // 載入小節資料
  useEffect(() => {
    if (chapter && visible) {
      loadSections();
    }
  }, [chapter, visible]);

  // 載入小節列表
  const loadSections = async () => {
    try {
      const response = await Request().post(
        getApiUrl('sections_getByChapterId'),
        Qs.stringify({ chapter_id: chapter.id })
      );
      
      if (response.data.status === 200) {
        setSections(response.data.result || []);
      } else {
        message.error('載入小節失敗: ' + response.data.message);
        setSections([]);
      }
    } catch (error) {
      console.error('載入小節錯誤:', error);
      message.error('載入小節失敗');
      setSections([]);
    }
  };

  const showSectionModal = (section = null) => {
    setEditingSection(section);
    setIsSectionModalVisible(true);
    if (section) {
      form.setFieldsValue(section);
      loadThemesForSection(section.id);
    } else {
      form.resetFields();
      setSectionThemes([]);
    }
    setIsThemeFormVisible(false);
    setEditingTheme(null);
    themeForm.resetFields();
  };

  // 載入小節的主題列表
  const loadThemesForSection = async (sectionId) => {
    try {
      const response = await Request().post(
        getApiUrl('themes_getBySectionId'),
        Qs.stringify({ section_id: sectionId })
      );
      
      if (response.data.status === 200) {
        setSectionThemes(response.data.result || []);
      } else {
        console.error('載入主題失敗:', response.data.message);
        setSectionThemes([]);
      }
    } catch (error) {
      console.error('載入主題錯誤:', error);
      setSectionThemes([]);
    }
    
  };

  const handleSectionModalCancel = () => {
    setIsSectionModalVisible(false);
    setEditingSection(null);
    setSectionThemes([]);
    setIsThemeFormVisible(false);
    setEditingTheme(null);
    form.resetFields();
    themeForm.resetFields();
  };

  const handleSectionSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingSection) {
        // 編輯現有小節
        const response = await Request().post(
          getApiUrl('sections_update'),
          Qs.stringify({
            id: editingSection.id,
            chapter_id: chapter.id,
            title: values.title,
            theme: values.theme || '',
            outline: '',  // 基本資訊中不包含這些字段
            key_points: '',
            transcript: '',
            youtube_id: '',
            order_index: 0
          })
        );
        
        if (response.data.status === 200) {
          message.success('小節更新成功！');
          loadSections(); // 重新載入小節列表
          handleSectionModalCancel();
        } else {
          message.error('更新失敗: ' + response.data.message);
        }
      } else {
        // 新增小節
        const newId = `section_${Date.now()}`;
        const response = await Request().post(
          getApiUrl('sections_create'),
          Qs.stringify({
            id: newId,
            chapter_id: chapter.id,
            title: values.title,
            theme: values.theme || '',
            outline: '',  // 基本資訊中不包含這些字段
            key_points: '',
            transcript: '',
            youtube_id: '',
            order_index: 0
          })
        );
        
        if (response.data.status === 200) {
          message.success('小節新增成功！');
          loadSections(); // 重新載入小節列表
          handleSectionModalCancel();
        } else {
          message.error('新增失敗: ' + response.data.message);
        }
      }
    } catch (error) {
      console.error('提交小節錯誤:', error);
      message.error('操作失敗，請稍後再試');
    }
  };

  // 主題管理功能
  const showThemeForm = (theme = null) => {
    setEditingTheme(theme);
    setIsThemeFormVisible(true);
    if (theme) {
      // 映射數據庫字段到表單字段
      themeForm.setFieldsValue({
        name: theme.name,
        outline: theme.outline,
        keyPoints: theme.key_points,
        transcript: theme.transcript,
        youtubeId: theme.youtube_id,
        order_index: theme.order_index
      });
    } else {
      themeForm.resetFields();
    }
  };

  const handleThemeFormCancel = () => {
    setIsThemeFormVisible(false);
    setEditingTheme(null);
    themeForm.resetFields();
  };

  const handleThemeSubmit = async () => {
    try {
      const values = await themeForm.validateFields();
      
      if (editingTheme) {
        // 編輯現有主題
        const response = await Request().post(
          getApiUrl('themes_update'),
          Qs.stringify({
            id: editingTheme.id,
            section_id: editingSection.id,
            name: values.name,
            outline: values.outline || '',
            key_points: values.keyPoints || '',
            transcript: values.transcript || '',
            youtube_id: values.youtubeId || '',
            order_index: values.order_index ? parseInt(values.order_index) : 0
          })
        );
        
        if (response.data.status === 200) {
          message.success('主題更新成功！');
          loadThemesForSection(editingSection.id); // 重新載入主題列表
          handleThemeFormCancel();
        } else {
          message.error('更新主題失敗: ' + response.data.message);
        }
      } else {
        // 新增主題
        const newId = `theme_${Date.now()}`;
        const response = await Request().post(
          getApiUrl('themes_create'),
          Qs.stringify({
            id: newId,
            section_id: editingSection.id,
            name: values.name,
            outline: values.outline || '',
            key_points: values.keyPoints || '',
            transcript: values.transcript || '',
            youtube_id: values.youtubeId || '',
            order_index: values.order_index ? parseInt(values.order_index) : 0
          })
        );
        
        if (response.data.status === 200) {
          message.success('主題新增成功！');
          loadThemesForSection(editingSection.id); // 重新載入主題列表
          handleThemeFormCancel();
        } else {
          message.error('新增主題失敗: ' + response.data.message);
        }
      }
    } catch (error) {
      console.error('主題操作錯誤:', error);
      message.error('操作失敗，請稍後再試');
    }
  };

  const handleThemeDelete = async (theme) => {
    try {
      const response = await Request().post(
        getApiUrl('themes_delete'),
        Qs.stringify({ id: theme.id })
      );
      
      if (response.data.status === 200) {
        message.success('主題刪除成功！');
        loadThemesForSection(editingSection.id); // 重新載入主題列表
      } else {
        message.error('刪除主題失敗: ' + response.data.message);
      }
    } catch (error) {
      console.error('刪除主題錯誤:', error);
      message.error('刪除失敗，請稍後再試');
    }
  };

  const handleSectionDelete = async (section) => {
    try {
      const response = await Request().post(
        getApiUrl('sections_delete'),
        Qs.stringify({ id: section.id })
      );
      
      if (response.data.status === 200) {
        message.success('小節刪除成功！');
        loadSections(); // 重新載入小節列表
      } else {
        message.error('刪除失敗: ' + response.data.message);
      }
    } catch (error) {
      console.error('刪除小節錯誤:', error);
      message.error('刪除失敗，請稍後再試');
    }
  };

  return (
    <>
      <Modal
        title={`管理《${chapter?.name}》的小節`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        <Row gutter={[16, 16]}>
          {/* 操作按鈕 */}
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showSectionModal()}
              >
                新增小節
              </Button>
            </Space>
          </Col>

          {/* 小節列表 */}
          <Col span={24}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
              }}
              dataSource={sections}
              renderItem={section => (
                <List.Item>
                  <Card
                    title={
                      <Space>
                        <BookOutlined style={{ color: '#722ed1' }} />
                        {section.title}
                      </Space>
                    }
                    extra={
                        <Space>
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => showSectionModal(section)}
                          />
                          <Popconfirm
                            title="確定要刪除這個小節嗎？"
                            onConfirm={() => handleSectionDelete(section)}
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
                    {/* 小節簡介預覽 */}
                    {section.theme && (
                      <div style={{ marginBottom: '12px' }}>
                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#fa8c16' }}>
                          簡介
                        </Title>
                        <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#666', fontSize: '12px' }}>
                          {section.theme}
                        </Paragraph>
                      </div>
                    )}
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <div>
                      <Title level={5} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
                        主題內容管理
                      </Title>
                      <Paragraph style={{ color: '#999', fontSize: '12px' }}>
                        在編輯模式中可以管理此小節的主題內容
                      </Paragraph>
                      
                      <Paragraph style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>
                        💡 點擊編輯按鈕，切換到「主題內容」選項卡管理主題
                      </Paragraph>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Col>

          {sections.length === 0 && (
            <Col span={24}>
              <Card style={{ textAlign: 'center', backgroundColor: '#fafafa' }}>
                <BookOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#999' }}>
                  尚未新增任何小節
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  點擊「新增小節」開始為這個章節建立小節內容
                </Paragraph>
              </Card>
            </Col>
          )}
        </Row>
      </Modal>

            {/* 新增/編輯小節彈窗 */}
      <Modal
        title={editingSection ? '編輯小節' : '新增小節'}
        open={isSectionModalVisible}
        onCancel={handleSectionModalCancel}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        <Tabs
          defaultActiveKey="basic"
          items={[
            {
              key: 'basic',
              label: '基本資訊',
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  requiredMark={false}
                >
                  <Form.Item
                    name="title"
                    label="小節標題"
                    rules={[{ required: true, message: '請輸入小節標題' }]}
                  >
                    <Input placeholder="例如：如是我聞、菩薩摩訶薩眾" />
                  </Form.Item>

                  <Form.Item
                    name="theme"
                    label="小節簡介 (選填)"
                    extra="簡要描述這個小節的內容，詳細內容請在「主題內容」中編輯"
                  >
                    <TextArea 
                      rows={3}
                      placeholder="例如：本小節講述經典的開端部分，介紹說法的時空背景..."
                    />
                  </Form.Item>

                  <div style={{ 
                    background: '#e6f4ff', 
                    padding: '16px', 
                    borderRadius: '6px',
                    border: '1px solid #91caff',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#1677ff', marginBottom: '8px' }}>
                      💡 <strong>提示</strong>
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      詳細的綱要、重點說明、經文內容和影片連結<br/>
                      請切換到「主題內容」選項卡進行編輯
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Space>
                      <Button onClick={handleSectionModalCancel}>
                        取消
                      </Button>
                      <Button type="primary" onClick={handleSectionSubmit}>
                        {editingSection ? '更新小節' : '新增小節'}
                      </Button>
                    </Space>
                  </div>
                </Form>
              )
            },
            {
              key: 'themes',
              label: `主題內容 (${sectionThemes.length})`,
              children: (
                <div>
                  <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => showThemeForm()}
                      >
                        新增主題
                      </Button>
                    </Col>
                  </Row>

                  {sectionThemes.length > 0 ? (
                    <List
                      dataSource={sectionThemes}
                      renderItem={(theme, index) => (
                        <List.Item
                          actions={[
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => showThemeForm(theme)}
                            />,
                            <Popconfirm
                              title="確定要刪除這個主題嗎？"
                              onConfirm={() => handleThemeDelete(theme)}
                              okText="確定"
                              cancelText="取消"
                            >
                              <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                              />
                            </Popconfirm>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Tag color="blue">主題 {index + 1}</Tag>}
                            title={theme.name}
                            description={
                              <div>
                                <div style={{ marginBottom: '4px' }}>
                                  <strong>綱要：</strong>{theme.outline}
                                </div>
                                {theme.youtube_id && (
                                  <div style={{ marginBottom: '4px' }}>
                                    <strong>影片：</strong>
                                    <Tag color="red" size="small">
                                      {theme.youtube_id}
                                    </Tag>
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      <BulbOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                      <div>尚未新增任何主題內容</div>
                      <div style={{ fontSize: '12px', marginTop: '8px' }}>
                        點擊「新增主題」開始建立詳細的教學內容
                      </div>
                    </div>
                  )}
                </div>
              )
            }
          ]}
        />
      </Modal>

      {/* 主題編輯彈窗 */}
      <Modal
        title={editingTheme ? '編輯主題' : '新增主題'}
        open={isThemeFormVisible}
        onOk={handleThemeSubmit}
        onCancel={handleThemeFormCancel}
        width={800}
        okText="確定"
        cancelText="取消"
      >
        <Form
          form={themeForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="主題名稱"
            rules={[{ required: true, message: '請輸入主題名稱' }]}
          >
            <Input placeholder="例如：佛法傳承的權威建立" />
          </Form.Item>

          <Form.Item
            name="youtubeId"
            label="YouTube 影片 ID (選填)"
            extra="可以留空，不是必填欄位"
          >
            <Input placeholder="例如：dQw4w9WgXcQ (選填)" />
          </Form.Item>

          <Form.Item
            name="outline"
            label="綱要"
            rules={[{ required: true, message: '請輸入綱要' }]}
          >
            <TextArea 
              rows={3}
              placeholder="簡要說明這個主題的核心要點"
            />
          </Form.Item>

          <Form.Item
            name="keyPoints"
            label="重點說明"
            rules={[{ required: true, message: '請輸入重點說明' }]}
          >
            <TextArea 
              rows={4}
              placeholder="詳細的重點說明，建議用數字編號分隔"
            />
          </Form.Item>

          <Form.Item
            name="transcript"
            label="經文內容"
            rules={[{ required: true, message: '請輸入經文內容' }]}
          >
            <TextArea 
              rows={6}
              placeholder="完整的經文內容"
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
    </>
  );
};

export default SectionManager; 