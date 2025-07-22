import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Row,
  Col,
  Space,
  Popconfirm,
  message,
  Tag,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  TagsOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const QAManager = ({ isUsingExampleData }) => {
  const [qaList, setQaList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQA, setEditingQA] = useState(null);
  const [form] = Form.useForm();

  // 預設分類
  const defaultCategories = [
    '般若智慧',
    '修行方法',
    '經典理解',
    '日常應用',
    '經典背景',
    '修行疑問'
  ];

  // 模擬資料載入
  useEffect(() => {
    if (isUsingExampleData) {
      // 載入範例資料
      setQaList([
        {
          id: 'qa1',
          category: '般若智慧',
          question: '什麼是般若波羅蜜多？',
          answer: '般若波羅蜜多梵文為 Prajñāpāramitā，意思是「智慧到彼岸」。般若是指能夠洞察諸法實相的智慧，特別是空性智慧；波羅蜜多是「到彼岸」的意思，表示透過修習般若智慧，能夠從生死輪迴的此岸，到達涅槃解脫的彼岸。這是大乘佛教最重要的修行法門之一。',
          tags: ['般若', '智慧', '波羅蜜多']
        },
        {
          id: 'qa2',
          category: '修行方法',
          question: '如何理解「照見五蘊皆空」？',
          answer: '五蘊是指色、受、想、行、識，涵蓋了我們身心的全部現象。「照見五蘊皆空」不是說這些現象不存在，而是說它們沒有固定不變的自性。透過般若智慧的觀照，我們能夠看到：色身會變化衰老、感受會生滅無常、想法會此起彼落、行為會因緣而起、意識會剎那變遷。理解這種「空性」能幫助我們放下執著，度脫一切苦厄。',
          tags: ['五蘊', '空性', '觀照', '修行']
        },
        {
          id: 'qa3',
          category: '經典理解',
          question: '為什麼金剛經說「應無所住而生其心」？',
          answer: '「應無所住而生其心」是金剛經的核心教導。「無所住」是指心不要執著於任何現象，不要被外境所束縛；「生其心」是指要發起清淨的菩提心，慈悲利益眾生。這句話教導我們要在不執著的智慧中保持慈悲的行動，既要有出世的智慧（無住），也要有入世的慈悲（生心）。這是大乘菩薩道的精髓：空而不斷，有而不執。',
          tags: ['金剛經', '無所住', '菩提心', '慈悲']
        }
      ]);
    } else {
      // 載入管理員資料
      const savedData = localStorage.getItem('adminQA');
      setQaList(savedData ? JSON.parse(savedData) : []);
    }
  }, [isUsingExampleData]);

  // 儲存到 localStorage
  const saveToStorage = (data) => {
    if (!isUsingExampleData) {
      localStorage.setItem('adminQA', JSON.stringify(data));
    }
  };

  const showModal = (qa = null) => {
    setEditingQA(qa);
    setIsModalVisible(true);
    if (qa) {
      form.setFieldsValue({
        ...qa,
        tags: qa.tags.join(', ')
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
      
      // 處理標籤
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      let newQAList;

      if (editingQA) {
        // 編輯現有問答
        newQAList = qaList.map(qa => 
          qa.id === editingQA.id ? { ...qa, ...values, tags } : qa
        );
        message.success('問答更新成功！');
      } else {
        // 新增問答
        const newId = `qa_${Date.now()}`;
        const newQA = {
          id: newId,
          ...values,
          tags
        };
        newQAList = [...qaList, newQA];
        message.success('問答新增成功！');
      }

      setQaList(newQAList);
      saveToStorage(newQAList);
      handleCancel();
    } catch (error) {
      console.error('表單驗證失敗:', error);
    }
  };

  const handleDelete = (id) => {
    const newQAList = qaList.filter(qa => qa.id !== id);
    setQaList(newQAList);
    saveToStorage(newQAList);
    message.success('問答刪除成功！');
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
              新增問答
            </Button>
            {isUsingExampleData && (
              <Tag color="orange">範例模式：無法編輯</Tag>
            )}
          </Space>
        </Col>

        {/* 問答列表 */}
        <Col span={24}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 2,
              xl: 2,
            }}
            dataSource={qaList}
            renderItem={qa => (
              <List.Item>
                <Card
                  title={
                    <Space>
                      <QuestionCircleOutlined style={{ color: '#722ed1' }} />
                      <Tag color="blue">{qa.category}</Tag>
                    </Space>
                  }
                  extra={
                    !isUsingExampleData && (
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
                    )
                  }
                  style={{ height: '100%' }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <Title level={5} style={{ margin: '0 0 8px 0', color: '#722ed1' }}>
                      {qa.question}
                    </Title>
                  </div>
                  
                  <Paragraph 
                    ellipsis={{ rows: 3 }} 
                    style={{ color: '#666', marginBottom: '12px' }}
                  >
                    {qa.answer}
                  </Paragraph>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <div>
                    <Space wrap>
                      <TagsOutlined style={{ color: '#52c41a' }} />
                      {qa.tags.map(tag => (
                        <Tag key={tag} color="green" size="small">
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>

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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="問答分類"
                rules={[{ required: true, message: '請選擇問答分類' }]}
              >
                <Select placeholder="選擇分類">
                  {defaultCategories.map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="標籤 (用逗號分隔)"
                rules={[{ required: true, message: '請輸入至少一個標籤' }]}
              >
                <Input placeholder="例如：般若, 智慧, 修行" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="question"
            label="問題"
            rules={[{ required: true, message: '請輸入問題' }]}
          >
            <Input placeholder="輸入佛法相關問題" />
          </Form.Item>

          <Form.Item
            name="answer"
            label="答案"
            rules={[{ required: true, message: '請輸入答案' }]}
          >
            <TextArea 
              rows={6}
              placeholder="詳細回答問題，可以包含經典引用和實際應用"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QAManager; 