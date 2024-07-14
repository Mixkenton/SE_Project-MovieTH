import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './report.css'
import { ConfigProvider, Button, Space, Table, Tag, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    LeftOutlined,
    HomeOutlined,
    EyeOutlined,
    QuestionCircleFilled ,
} from '@ant-design/icons';
import Navbar from '../../../components/navbar';
import { GetReport } from '../../../service/mix';
import Cookies from 'js-cookie'; //npm install js-cookie


function Report() {
    const navigate = useNavigate();

    interface topics {
       ID: number,
       Topic: string,
      }
      const [topics, setTopic] = useState<topics[]>([]);

      const GetTopics = async () => {
        let res = await GetReport();
        console.log(res);
        if (res) {
          setTopic(res.data);
          
        }
      };
      useEffect(() => {
        GetTopics();
      }, []);

      const token = localStorage.getItem('token');
      useEffect(() => {
        if (!token) {
          navigate('/register');
        }
      }, [token, navigate]);

      
    const handleTopicClick = (index:number) => {
        console.log(`คลิกที่ ${index}`);
        Cookies.set('IDTopic', String(index), { expires: 7 }); //setCookie(name, value, {วันหมดอายุ})
        navigate('/report/create');
        
      };


    return (
        <div><header style={{ backgroundColor: 'black' }}><Navbar /></header>
            <div className='report-page'>
                <div className='block-report'>
                    <div className='block-report-head-text'>
                        <div>
                            เราช่วยอะไรได้บ้าง
                        </div>
                    </div>
                    <div className='block-report-text-content'>
                        ปัญหาที่พบ
                    </div>
                    <div className='block-report-text-content-topic'>
                        {topics.map((topic) => (
                            <div key={topic.ID} onClick={() => handleTopicClick(topic.ID)}>
                              <div className='report-text-content-topic-box1'>
                                <div className='report-text-content-topic-box1-in'>
                                  <div style={{marginRight:10,color:'black'}}>
                                    <QuestionCircleFilled />
                                  </div>
                                  
                                {topic.Topic}
                                </div>
                              </div>
                            
                            </div>
                        ))}
                        
                    </div>
                </div>



            </div>
        </div>
    )
}

export default Report;

