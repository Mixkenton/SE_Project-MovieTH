import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './report.css'
import { ConfigProvider, Button, Space, Table, Tag, Modal, Form, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  LeftOutlined,
  HomeOutlined,
  EyeOutlined
} from '@ant-design/icons';
import Navbar from '../../../components/navbar';
import './reporttopic.css'
import { CreateReport, GetReport, GetTopicByID, GetReportTopicByID, DeleteReportByUserID ,UpdateReport} from '../../../service/mix';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined ,QuestionCircleFilled} from '@ant-design/icons';


import Cookies from 'js-cookie'; //npm install js-cookie
const { TextArea } = Input;
const { confirm } = Modal;



function Report() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [editedReport, setEditedReport] = useState<Report | null>(null);


  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  interface Topic {
    ID: number,
    Topic: string,
    UserID: number,
    TopicID: number,
  }
  interface Report {
    ID: number,
    Description: string,
    UserID: number,
    TopicID: number,
  }
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [reports, setReport] = useState<Report[]>([]);
  const IDTopic = Number(Cookies.get('IDTopic'));
  const UserID = Number(Cookies.get('UserID'));

  const showDeleteConfirm = (ID: number) => {
    confirm({
      title: 'Are you sure you want to delete this report?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
    

      onOk() {
        DeleteReportByUserID(ID)
        console.log('Topic deleted');
        setTimeout(() => {
          // Reload the page after the delay
          window.location.reload();
        }, 500);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const handleEditClick = (report: Report) => {
    setEditedReport(report);
    setEditMode(true);
    setModalVisible(true); // Show the modal when entering edit mode
    // Populate the form with existing data
    
    form.setFieldsValue({ Description: report.Description });
  };
  const handleOkEdit = () => {
    setModalVisible(false);
  };
 
  const handleCancelEdit = () => {
    setEditedReport(null);
    setEditMode(false);
    setModalVisible(false); // Hide the modal when canceling edit
    // Reset the form if needed
    form.resetFields();
  };
  const handleSaveEdit = async (values: Topic) => {
    values.UserID = UserID;
    values.TopicID = IDTopic;
    console.log(values);
    let res = await CreateReport(values);
    if (res.status) {
      messageApi.open({
        type: "success",
        content: "สำเร็จ",
      });

      setTimeout(() => {
        // Reload the page after the delay
        window.location.reload();
      }, 700);
    }
    else {
      // Check if the message property exists and show the message
      if (res.message) {
        messageApi.open({
          type: "error",
          content: res.message,
        });
      } else {
        // If no specific message is available, show a generic error message
        messageApi.open({
          type: "error",
          content: "ขออภัย เกิดข้อผิดพลาดในการรีวิว",
        });
      }
    }
    form.resetFields();
    setEditMode(false);
  };
  const handleSaveEdit1 = async (values: Report) => {
    console.log(values)
    let res = await UpdateReport(values);
    console.log(res);
    if (res.status == true) {
      messageApi.open({
        type: "success",
        content: "สำเร็จ",
      });

      setTimeout(() => {
        // Reload the page after the delay
        window.location.reload();
      }, 700);
    }
    else {
      // Check if the message property exists and show the message
      if (res.message) {
        messageApi.open({
          type: "error",
          content: res.message,
        });
      } else {
        // If no specific message is available, show a generic error message
        messageApi.open({
          type: "error",
          content: "ขออภัย เกิดข้อผิดพลาดในการรีวิว",
        });
      }
    }
  }


  const GetTopics = async (IDTopic: number) => {

    let res = await GetTopicByID(IDTopic);
    console.log(res.data)
    if (res.data) {
      setFilteredTopics([res.data]);
    }
  };
  const GetReportTopic = async (UserID: number, IDTopic: number) => {
    let res = await GetReportTopicByID(UserID, IDTopic);
    console.log(res.data)
    if (res.data) {
      setReport(res.data);
    }

  }
  useEffect(() => {
    GetTopics(IDTopic);
  }, [IDTopic]);
  useEffect(() => {
    GetReportTopic(UserID, IDTopic);
  }, [UserID, IDTopic]);

  useEffect(() => {
    console.log(reports)
  }, [reports])
  
  const token = localStorage.getItem('token');
      useEffect(() => {
        if (!token) {
          navigate('/register');
        }
      }, [token, navigate]);






  return (
    <div><header style={{ backgroundColor: 'black' }}><Navbar /></header>
      <div className='report-page'>
        <div className='block-report'>
          <div className='block-report-head-text' style={{ justifyContent: 'center' }}>
            {filteredTopics.map((topic, index) => (
              <div style={{display:'flex',flexDirection:'row'}}>
                <div
                style={{marginRight:6}}><QuestionCircleFilled/></div>
                <div key={index}>{topic.Topic}</div>
              </div>
            ))}
            <div style={{ marginTop: '4%' }}>


              <Form form={form} onFinish={handleSaveEdit}>
                <Form.Item name="Description">
                  <TextArea rows={4} placeholder="maxLength is 500" maxLength={500} />
                </Form.Item>
                <Button type='primary' htmlType='submit' style={{backgroundColor:'#F5CE00'}}>
                  Save
                </Button>
                <Button onClick={handleCancelEdit} htmlType="reset" style={{ marginLeft: '8px' }}>
                  Cancel
                </Button>
              </Form>

            </div>
            <div className='report-mention'>
              {reports.map((r) => (
                <div className='report-mention-box' key={r.ID}>
                  <div className='report-mention-text'>
                    {r.Description}
                  </div>

                  <div className='report-mention-right'>
                    <div className='report-mention-edit' onClick={() => handleEditClick(r)}>
                      <EditOutlined style={{ marginRight: '5px' }}   />
                    </div>
                    <div className='report-mention-delete' onClick={() => showDeleteConfirm(r.ID)}>
                      <DeleteOutlined style={{ marginRight: '5px' }} />
                    </div>
                  </div>

                </div>


              ))}

            </div>
            {contextHolder}
            <Modal
              visible={modalVisible}
              title="แก้ไข "
              onOk={handleOkEdit}
              onCancel={handleCancelEdit}
              footer={[]}
            >
              <Form  form={form} onFinish={(values) => handleSaveEdit1({ ...editedReport, ...values })} initialValues={{ Description: editedReport?.Description }}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                  <Form.Item name="Description">
                    <TextArea rows={4} placeholder="maxLength is 500" maxLength={500} minLength={1}/>
                  </Form.Item>
                  
                  <button className='edit-ok-payment' type='submit' style={{
                    width: '20%', backgroundColor: '#F5CE00', cursor: 'pointer'
                  }}>ยืนยัน</button>
                </div>
              </Form>
            </Modal>
          </div>



        </div>
      </div>
    </div>
  )
}

export default Report;

