import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./subhistory.css"
import { ConfigProvider, Button, Space, Table, Tag, Modal, Spin, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    LeftOutlined,
    HomeOutlined,
    EyeOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import Navbar from '../../../components/navbar';
import { GetUserPackageInfo, GetUserBill } from '../../../service/pool';
import { Subscription } from '../../../interface/pool';

function SubHistory() {
    const [imageData, setImageData] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const [subscriptionData, setSubscriptionData] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        fetchUserPackageInfo();
    }, [token, navigate]); // Empty dependency array to run the effect once after the initial render

    const fetchUserPackageInfo = async () => {
        try {
            setLoading(true);

            const userId = localStorage.getItem('UserID');
            if (!userId) {
                // Handle the case where UserID is not available
                return;
            }

            let userBill = await GetUserBill(userId);

            // console.log('userBill:', userBill);

            userBill.forEach((subscription: { createdAtTimestamp: number; Created: string | number | Date; }) => {
                subscription.createdAtTimestamp = new Date(subscription.Created).getTime();
            });
            
            userBill.sort((a: Subscription, b: Subscription) =>
                new Date(b.Created).getTime() - new Date(a.Created).getTime()
            );

            setSubscriptionData(userBill);
        } catch (error) {
            console.error('Error fetching user package information:', error);
        } finally {
            setLoading(false);
        }
    };


    const ModalContent = () => {
        return (
          <>
            <div style={{ textAlign: 'center' }}>
              {imageData ? (
                <Image style={{ maxWidth: '100%', height: 'auto' }} src={imageData} alt="Bill" />
              ) : (
                <p>No image available</p>
              )}
            </div>
          </>
        );
      };

    const columns: ColumnsType<Subscription> = [
        {
            title: 'Name',
            dataIndex: 'PackageName',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'Price',
            key: 'price',
        },
        {
            title: 'Date',
            dataIndex: 'Created',
            key: 'createdAt',
            render: (createdAt: string) => {
                const date = new Date(createdAt);
                return date.toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' })
            },
        },
        {
            title: 'Bill',
            key: 'bill',
            render: (_, record) => (
                <Button type='primary' onClick={() => handleViewImage(record)}>
                    <EyeOutlined /> ดูสลิป
                </Button>
            ),
        },
    ];

    const handleViewImage = (record: Subscription) => {
        // console.log('Clicked Record:', record);
        if (record.Bill) {
            setImageData(record.Bill);
            setIsModalVisible(true);

        }
    };

    const handleToHome = () => {
        setTimeout(() => {
            navigate("/homepage");
        }, 500);
    };

    if (loading) {
        return (
            <div className='web-user'>
                <div className='loading-screen'>
                    <Space size="middle" >
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: '#F5CE00', fontFamily: 'Mitr' }} spin />} />
                        Loading...
                    </Space>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header style={{ backgroundColor: 'black' }}>
                <Navbar />
            </header>
            <div className='web-subhistory'>

                <ConfigProvider theme={{
                    components: {
                        Button: {
                            colorPrimary: '#F5CE00',
                            algorithm: true,
                            primaryColor: '#000000',
                        },
                    },
                }}>

                    <div className='web-subhistory-boxmain'>
                        <Button
                            className='back-button'
                            type='primary'
                            style={{ fontSize: 15, fontFamily: 'Mitr' }}
                            onClick={handleToHome}
                        >
                            <HomeOutlined /> กลับไป Home
                        </Button>
                        <div className='web-subhistory-box' style={{ marginTop: 0 }}>
                            <div className='subhistory-text-header'>Subscription History</div>
                            <div className='subhistory-line' />
                            <Table
                                style={{ paddingRight: '40px', paddingLeft: '40px', marginTop: '10px' }}
                                dataSource={subscriptionData}
                                columns={columns}
                                pagination={{ pageSize: 6 }}
                                rowKey="ID"
                                loading={loading}
                            />
                        </div>
                        <Modal
                            title="รูปสลิป"
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={null}
                        >
                            <ModalContent />
                        </Modal>
                    </div>
                </ConfigProvider>
            </div>
        </div>
    )
}

export default SubHistory;

