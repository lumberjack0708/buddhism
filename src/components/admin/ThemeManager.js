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
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  BulbOutlined,
  ReadOutlined
} from '@ant-design/icons';
/* global Qs */
import Request from '../../utils/Request';
import { getApiUrl } from '../../config';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ThemeManager = ({ 
  visible, 
  onClose, 
  scripture,
  chapter,
  section
}) => {
  const [themes, setThemes] = useState([]);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [form] = Form.useForm();

  // 載入主題資料
  useEffect(() => {
    if (section && visible) {
      setThemes(section.themes || []);
    }
  }, [section, visible]);

  // 儲存資料
  const saveSectionData = async (updatedThemes) => {
    try {
      const response = await Request().post(
        getApiUrl('themes_create'),
        Qs.stringify({ 
          sectionId: section.id,
          themes: JSON.stringify(updatedThemes)
        })
      );
      
      if (response.data.status === 200) {
        return true;
      } else {
        console.error('儲存主題失敗:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('儲存主題錯誤:', error);
      return false;
    }
  };

  const showThemeModal = (theme = null) => {
    setEditingTheme(theme);
    setIsThemeModalVisible(true);
    if (theme) {
      form.setFieldsValue(theme);
    } else {
      form.resetFields();
    }
  };

  const handleThemeModalCancel = () => {
    setIsThemeModalVisible(false);
    setEditingTheme(null);
    form.resetFields();
  };

  const handleThemeSubmit = async () => {
    try {
      const values = await form.validateFields();
      let updatedThemes;

      if (editingTheme) {
        // 編輯現有主題
        updatedThemes = themes.map(t => 
          t.id === editingTheme.id 
            ? { ...t, ...values }
            : t
        );
      } else {
        // 新增主題
        const newId = `theme_${Date.now()}`;
        const newTheme = {
          id: newId,
          ...values
        };
        updatedThemes = [...themes, newTheme];
      }

      const success = await saveSectionData(updatedThemes);
      if (success) {
        setThemes(updatedThemes);
        message.success(editingTheme ? '主題更新成功！' : '主題新增成功！');
        handleThemeModalCancel();
      } else {
        message.error('儲存失敗，請稍後再試');
      }
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  const handleThemeDelete = async (id) => {
    const updatedThemes = themes.filter(t => t.id !== id);
    const success = await saveSectionData(updatedThemes);
    if (success) {
      setThemes(updatedThemes);
      message.success('主題刪除成功！');
    } else {
      message.error('刪除失敗，請稍後再試');
    }
  };

  return (
    <>
      <Modal
        title={`管理《${section?.title}》的主題內容`}
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
                onClick={() => showThemeModal()}
              >
                新增主題內容
              </Button>
            </Space>
          </Col>

          {/* 主題列表 */}
          <Col span={24}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
              }}
              dataSource={themes}
              renderItem={(theme, index) => (
                <List.Item>
                  <Card
                    title={
                      <Space>
                        <Tag color="blue">第 {index + 1} 主題</Tag>
                        <BulbOutlined style={{ color: '#722ed1' }} />
                        {theme.name}
                      </Space>
                    }
                    extra={
                        <Space>
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => showThemeModal(theme)}
                          />
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
                        </Space>
                    }
                    style={{ height: '100%' }}
                  >
                    {/* 綱要 */}
                    {theme.outline && (
                      <div style={{ marginBottom: '12px' }}>
                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#722ed1' }}>
                          <FileTextOutlined style={{ marginRight: '4px' }} />
                          綱要
                        </Title>
                        <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#666', fontSize: '12px' }}>
                          {theme.outline}
                        </Paragraph>
                      </div>
                    )}

                    {/* 重點 */}
                    {theme.keyPoints && (
                      <div style={{ marginBottom: '12px' }}>
                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#52c41a' }}>
                          <BulbOutlined style={{ marginRight: '4px' }} />
                          重點
                        </Title>
                        <Paragraph ellipsis={{ rows: 3 }} style={{ color: '#666', fontSize: '12px' }}>
                          {theme.keyPoints}
                        </Paragraph>
                      </div>
                    )}

                    {/* 經文內容 */}
                    {theme.transcript && (
                      <div style={{ marginBottom: '12px' }}>
                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#52c41a' }}>
                          <ReadOutlined style={{ marginRight: '4px' }} />
                          經文內容
                        </Title>
                        <Paragraph 
                          ellipsis={{ rows: 3 }} 
                          style={{ 
                            color: '#666', 
                            fontSize: '12px',
                            fontFamily: 'serif',
                            background: '#fff9f0',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ffeaa7'
                          }}
                        >
                          {theme.transcript}
                        </Paragraph>
                      </div>
                    )}

                    {/* 逐字稿 */}
                    {theme.verbatimTranscript && (
                      <div style={{ marginBottom: '12px' }}>
                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#eb2f96' }}>
                          <FileTextOutlined style={{ marginRight: '4px' }} />
                          逐字稿
                        </Title>
                        <Paragraph 
                          ellipsis={{ rows: 3 }} 
                          style={{ 
                            color: '#666', 
                            fontSize: '12px',
                            background: '#fff0f6',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ffadd6'
                          }}
                        >
                          {theme.verbatimTranscript}
                        </Paragraph>
                      </div>
                    )}
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    {/* YouTube 影片 */}
                    <div>
                      <Title level={5} style={{ margin: '0 0 8px 0', color: '#f5222d' }}>
                        <VideoCameraOutlined style={{ marginRight: '4px' }} />
                        影片連結
                      </Title>
                      {theme.youtubeId ? (
                        <div>
                          <Tag color="red" style={{ marginBottom: '8px' }}>
                            YouTube ID: {theme.youtubeId}
                          </Tag>
                          <div style={{ 
                            background: '#f0f0f0', 
                            padding: '8px', 
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#666'
                          }}>
                            完整連結：https://www.youtube.com/watch?v={theme.youtubeId}
                          </div>
                        </div>
                      ) : (
                        <Paragraph style={{ color: '#999', fontSize: '12px' }}>
                          尚未設定影片連結
                        </Paragraph>
                      )}
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Col>

          {themes.length === 0 && (
            <Col span={24}>
              <Card style={{ textAlign: 'center', backgroundColor: '#fafafa' }}>
                <BulbOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#999' }}>
                  尚未新增任何主題內容
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  點擊「新增主題內容」開始為這個小節建立詳細的教學內容
                </Paragraph>
              </Card>
            </Col>
          )}
        </Row>
      </Modal>

      {/* 新增/編輯主題彈窗 */}
      <Modal
        title={editingTheme ? '編輯主題內容' : '新增主題內容'}
        open={isThemeModalVisible}
        onOk={handleThemeSubmit}
        onCancel={handleThemeModalCancel}
        width={900}
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
            label="主題名稱"
            rules={[{ required: true, message: '請輸入主題名稱' }]}
          >
            <Input placeholder="例如：佛法傳承的權威建立、德行深化的真義" />
          </Form.Item>

          <Form.Item
            name="youtubeId"
            label="YouTube 影片 ID (選填)"
            extra="從 YouTube 網址中取得的影片 ID，例如：dQw4w9WgXcQ。可以留空，不是必填欄位。"
          >
            <Input placeholder="例如：dQw4w9WgXcQ (選填)" />
          </Form.Item>

          <Form.Item
            name="outline"
            label="綱要 (選填)"
          >
            <TextArea 
              rows={3}
              placeholder="簡要說明這個主題的核心要點和架構 (選填)"
            />
          </Form.Item>

          <Form.Item
            name="keyPoints"
            label="重點說明 (選填)"
          >
            <TextArea 
              rows={5}
              placeholder="詳細的重點說明，建議用數字編號分隔多個重點 (選填)"
            />
          </Form.Item>

          <Form.Item
            name="transcript"
            label="經文內容 (選填)"
          >
            <TextArea 
              rows={6}
              placeholder="完整的經文內容，包含原文和解釋 (選填)"
            />
          </Form.Item>

          <Form.Item
            name="verbatimTranscript"
            label="逐字稿 (選填)"
            extra="詳細的逐字稿內容，包含完整的講解和對話記錄"
          >
            <TextArea 
              rows={8}
              placeholder="逐字稿內容，可包含詳細的講解、問答、補充說明等 (選填)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ThemeManager; 