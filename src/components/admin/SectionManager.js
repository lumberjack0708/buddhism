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
  SettingOutlined,
  BulbOutlined
} from '@ant-design/icons';
import ThemeManager from './ThemeManager';

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
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionThemes, setSectionThemes] = useState([]);
  const [isThemeFormVisible, setIsThemeFormVisible] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [form] = Form.useForm();
  const [themeForm] = Form.useForm();

  // 載入小節資料
  useEffect(() => {
    if (chapter && visible) {
      setSections(chapter.sections || []);
    }
  }, [chapter, visible]);

  // 儲存到 localStorage
  const saveChapterData = (updatedSections) => {
    const savedData = localStorage.getItem('adminScriptures');
    if (savedData) {
      try {
        const allScriptures = JSON.parse(savedData);
        const updatedScriptures = allScriptures.map(script => {
          if (script.id === scripture.id) {
            const updatedChapters = script.chapters.map(chap => 
              chap.id === chapter.id 
                ? { ...chap, sections: updatedSections }
                : chap
            );
            return { ...script, chapters: updatedChapters };
          }
          return script;
        });
        localStorage.setItem('adminScriptures', JSON.stringify(updatedScriptures));
      } catch (error) {
        console.error('儲存失敗:', error);
      }
    }
  };

  const showSectionModal = (section = null) => {
    setEditingSection(section);
    setIsSectionModalVisible(true);
    if (section) {
      form.setFieldsValue(section);
      setSectionThemes(section.themes || []);
    } else {
      form.resetFields();
      setSectionThemes([]);
    }
    setIsThemeFormVisible(false);
    setEditingTheme(null);
    themeForm.resetFields();
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
      let updatedSections;

      // 將主題加入到小節資料中
      const sectionData = {
        ...values,
        themes: sectionThemes
      };

      if (editingSection) {
        // 編輯現有小節
        updatedSections = sections.map(s => 
          s.id === editingSection.id 
            ? { ...s, ...sectionData }
            : s
        );
        message.success('小節更新成功！');
      } else {
        // 新增小節
        const newId = `section_${Date.now()}`;
        const newSection = {
          id: newId,
          ...sectionData
        };
        updatedSections = [...sections, newSection];
        message.success('小節新增成功！');
      }

      setSections(updatedSections);
      saveChapterData(updatedSections);
      handleSectionModalCancel();
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  // 主題管理功能
  const showThemeForm = (theme = null) => {
    setEditingTheme(theme);
    setIsThemeFormVisible(true);
    if (theme) {
      themeForm.setFieldsValue(theme);
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
      let updatedThemes;

      if (editingTheme) {
        // 編輯現有主題
        updatedThemes = sectionThemes.map(t => 
          t.id === editingTheme.id 
            ? { ...t, ...values }
            : t
        );
        message.success('主題更新成功！');
      } else {
        // 新增主題
        const newId = `theme_${Date.now()}`;
        const newTheme = {
          id: newId,
          ...values
        };
        updatedThemes = [...sectionThemes, newTheme];
        message.success('主題新增成功！');
      }

      setSectionThemes(updatedThemes);
      handleThemeFormCancel();
    } catch (error) {
      console.error('主題表單驗證失敗:', error);
    }
  };

  const handleThemeDelete = (themeId) => {
    const updatedThemes = sectionThemes.filter(t => t.id !== themeId);
    setSectionThemes(updatedThemes);
    message.success('主題刪除成功！');
  };

  const handleSectionDelete = (id) => {
    const updatedSections = sections.filter(s => s.id !== id);
    setSections(updatedSections);
    saveChapterData(updatedSections);
    message.success('小節刪除成功！');
  };

  const showThemeManager = (section) => {
    setSelectedSection(section);
    setShowThemeModal(true);
  };

  const handleThemeModalClose = () => {
    setShowThemeModal(false);
    setSelectedSection(null);
    // 重新載入小節資料
    const savedData = localStorage.getItem('adminScriptures');
    if (savedData) {
      try {
        const allScriptures = JSON.parse(savedData);
        const currentScripture = allScriptures.find(s => s.id === scripture.id);
        if (currentScripture) {
          const currentChapter = currentScripture.chapters.find(c => c.id === chapter.id);
          if (currentChapter) {
            setSections(currentChapter.sections || []);
          }
        }
      } catch (error) {
        console.error('重新載入資料失敗:', error);
      }
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
                            onConfirm={() => handleSectionDelete(section.id)}
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
                        主題內容 ({section.themes?.length || 0})
                      </Title>
                      {section.themes?.length > 0 ? (
                        <div>
                          <Paragraph style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
                            已建立 {section.themes.length} 個主題
                          </Paragraph>
                          {section.themes.slice(0, 2).map((theme, index) => (
                            <div key={theme.id || index} style={{ 
                              background: '#f0f8ff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #91caff',
                              fontSize: '10px',
                              marginBottom: '4px',
                              color: '#1890ff'
                            }}>
                              {index + 1}. {theme.name}
                            </div>
                          ))}
                          {section.themes.length > 2 && (
                            <div style={{ 
                              fontSize: '10px', 
                              color: '#999',
                              textAlign: 'center',
                              padding: '2px'
                            }}>
                              +{section.themes.length - 2} 個更多主題...
                            </div>
                          )}
                        </div>
                      ) : (
                        <Paragraph style={{ color: '#999', fontSize: '12px' }}>
                          尚未新增主題內容
                        </Paragraph>
                      )}
                      
                      <Button 
                        type="link" 
                        size="small"
                        icon={<SettingOutlined />}
                        onClick={() => showThemeManager(section)}
                        style={{ marginTop: '4px', padding: 0 }}
                      >
                        管理主題內容 →
                      </Button>
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
        onOk={handleSectionSubmit}
        onCancel={handleSectionModalCancel}
        width={1200}
        okText="確定"
        cancelText="取消"
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
                              onConfirm={() => handleThemeDelete(theme.id)}
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
                                {theme.youtubeId && (
                                  <div style={{ marginBottom: '4px' }}>
                                    <strong>影片：</strong>
                                    <Tag color="red" size="small">
                                      {theme.youtubeId}
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
        </Form>
      </Modal>

      {/* 主題管理彈窗 */}
      {selectedSection && (
        <ThemeManager
          visible={showThemeModal}
          onClose={handleThemeModalClose}
          scripture={scripture}
          chapter={chapter}
          section={selectedSection}
        />
      )}
    </>
  );
};

export default SectionManager; 