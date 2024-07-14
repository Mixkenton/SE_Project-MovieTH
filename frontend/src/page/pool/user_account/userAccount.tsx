import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./user.css"
import { ConfigProvider, Button, Spin, Space, Modal, message } from 'antd';
import UserChangeName from './userChangeName';
import UserChangePass from './userChangePass';
import UserChangeDetial from './userChangedetail';
import {
    LoadingOutlined,
    LeftOutlined,
    HomeOutlined
} from '@ant-design/icons';
import Navbar from '../../../components/navbar';
import { GetUserInfo, GetUserPackageInfo, CancelSubscription } from '../../../service/pool';
import { UserInterface, PackageInterface } from '../../../interface/pool';
import Cookies from 'js-cookie';

function UserAccount() {
    const [messageApi, contextHolder] = message.useMessage();
    const [changeNameVisible, setChangeNameVisible] = useState(false);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [changeDetialVisible, setChangeDetialVisible] = useState(false);
    const [userData, setUserData] = useState<UserInterface | null>(null);
    const [userPackageInfo, setUserPackageInfo] = useState<PackageInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('UserID');


    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        fetchData();
    }, [token, navigate]);;

    const fetchData = async () => {
        try {
            // console.log(localStorage);
            const id = localStorage.getItem('UserID');
            // Fetch user data
            let userData = await GetUserInfo(Number(id));
            // console.log('User data:', userData);
            setUserData(userData);

            // Fetch user package info
            let packageInfo = await GetUserPackageInfo(id);
            // console.log('User Package Info:', packageInfo);
            setUserPackageInfo(packageInfo);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            const id = localStorage.getItem('UserID');

            Modal.confirm({
                title: (
                    <span style={{ fontSize: '1.6em', padding: '20px', fontFamily: 'Mitr', color: 'red' }}>
                        ต้องการยกเลิก Subscribtion ใช่ไหม
                    </span>
                ),
                content: (
                    <span style={{ fontSize: '1.2em', padding: '20px', fontFamily: 'Mitr' }}>
                        เมื่อยกเลิกแล้วจะไม่สามารถใช้งานเว็ปต่อได้
                    </span>
                ),
                onOk: async () => {
                    await CancelSubscription(id);

                    fetchData();
                    messageApi.open({
                        type: "success",
                        content: "ยกเลิกสำเร็จ",
                        onClose: () => {
                            setTimeout(() => {
                                Cookies.remove('UserID');
                                localStorage.removeItem('UserID');
                                localStorage.removeItem('token');
                                navigate("/");
                              }, 3000);
                        },
                    });
                },
                onCancel: () => {

                },
                width: 550,
                centered: true,

            });
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        }
    };

    const handleChangeSub = async () => {
        try {
            Modal.confirm({
                title: (
                    <span style={{ fontSize: '1.6em', padding: '20px', fontFamily: 'Mitr', color: 'red' }}>
                        ต้องการเปลี่ยน Package ใช่ไหม
                    </span>
                ),
                content: (
                    <span style={{ fontSize: '1.2em', padding: '20px', fontFamily: 'Mitr' }}>
                        เมื่อเปลี่ยนแล้วจะต้องจ่ายค่าสมัครใหม่อีกครั้ง
                    </span>
                ),
                onOk: async () => {
                    setTimeout(() => {
                        navigate("/package");
                    }, 500);
                },
                onCancel: () => {

                },
                width: 550,
                centered: true,

            });
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        }
    };

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

        return date.toLocaleDateString('th-TH', options);
    };

    const toggleChangeNamePop = () => {
        setChangeNameVisible(!changeNameVisible);
    };

    const toggleChangePasswordPop = () => {
        setChangePasswordVisible(!changePasswordVisible);
    };

    const toggleChangeDetialPop = () => {
        setChangeDetialVisible(!changeDetialVisible);
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

    const handleViewDownloadClick = (userID: number) => {
        console.log('View all movies clicked for Watchlist ID:', userID);
        localStorage.setItem('WatchlistId',String(userID))
    };


    return (
        <div>
            <header style={{ backgroundColor: 'black' }}>
                <Navbar />
            </header>
            <ConfigProvider theme={{
                components: {
                    Button: {
                        colorPrimary: '#F5CE00',
                        algorithm: true,
                        primaryColor: '#000000',
                    },
                },
            }}>
                {contextHolder}
                <div className='web-user'>
                    <div className='web-user-boxmain' style={{ marginTop: 40 }}>
                        <Button
                            className='back-button'
                            type='primary'
                            style={{ fontSize: 15, fontFamily: 'Mitr', marginTop: 0 }}
                            onClick={handleToHome}
                        ><HomeOutlined />กลับไป Home</Button>
                        {Array.isArray(userData) && userData.map((user, index) => (
                            <div key={user.ID} className='web-user-box' style={{ marginTop: 0 }}>
                                {/* ============================================My Account=================================================================== */}
                                <div className='user-text-header'>My Account</div>
                                <div className='user-line' />
                                <div className='user-text'>Email: {user.Email}
                                    <div className='user-button'>
                                        <Button
                                            style={{ fontSize: 20, width: 120, height: 40, fontFamily: 'Mitr' }}
                                            type="primary"
                                            onClick={toggleChangePasswordPop}
                                        >เปลี่ยนรหัส</Button>
                                    </div>
                                    <UserChangePass visible={changePasswordVisible} onCancel={toggleChangePasswordPop} />
                                </div>

                                <div className='user-text'>Username: {user.Username}

                                    <div className='user-button'>
                                        <Button
                                            style={{ fontSize: 20, width: 120, height: 40, fontFamily: 'Mitr' }}
                                            type='primary'
                                            onClick={toggleChangeNamePop}
                                        >แก้ไขชื่อ</Button>
                                    </div>
                                    <UserChangeName visible={changeNameVisible} onCancel={toggleChangeNamePop} />
                                </div>



                                <div className='user-text'>Full Name: {user.Prefix?.Prefix} {user.Firstname} {user.Lastname}
                                    <div className='user-button'>
                                        <Button
                                            style={{ fontSize: 20, width: 120, height: 40, fontFamily: 'Mitr' }}
                                            type='primary'
                                            onClick={toggleChangeDetialPop}
                                        >แก้ไขข้อมูล</Button>
                                    </div>
                                    <UserChangeDetial visible={changeDetialVisible} onCancel={toggleChangeDetialPop} />
                                </div>
                                <div className='user-text'>Gender: {user.Gender?.Gender}

                                </div>

                                <div className='user-text'>Date of Birth: {formatDate(user.Dob)}

                                </div>
                                <div className='user-text'>Address: {user.Address}

                                </div>
                            </div>
                        ))}
                        {/* ===============================================Subscription================================================================ */}
                        {Array.isArray(userPackageInfo) && userPackageInfo.length > 0 && (
                            <div className='web-user-box'>
                                <div className='user-text-header'>Subscription</div>
                                <div className='user-line' />
                                <div className='user-text'>Package: {userPackageInfo[userPackageInfo.length - 1].PackageName}
                                    <div className='user-button'>
                                        <Button onClick={handleChangeSub} style={{ fontSize: 20, width: 150, height: 40, fontFamily: 'Mitr' }} type='primary'>เปลี่ยนแพ็คเกจ</Button>
                                    </div>
                                </div>
                                <div className='user-text'>Price: {userPackageInfo[userPackageInfo.length - 1].Price} บาท
                                    <div className='user-button'>
                                        <Link to="/subhistory">
                                            <Button style={{ fontSize: 20, width: 150, height: 40, fontFamily: 'Mitr' }} type='primary'>ประวัติ</Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className='user-text'>Download Status: {userPackageInfo[userPackageInfo.length - 1].DownloadStatus ? 'ได้' : 'ไม่'}
                                    <div className='user-button'>
                                        <Button onClick={handleCancelSubscription} style={{ fontSize: 20, width: 150, height: 40, fontFamily: 'Mitr' }}>ยกเลิก</Button>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* =========================================Other====================================================================== */}
                        <div className='web-user-box'>
                            <div className='user-text-header'>Other</div>
                            <div className='user-line' />
                            <div className='user-text'>ประวัติการรับชม
                                <div className='user-button'>
                                    <Link to="/moviehistorypage">
                                        <Button style={{ fontSize: 20, width: 170, height: 40, fontFamily: 'Mitr' }} type='primary'>ประวัติการรับชม</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className='user-text'>การดาวน์โหลด
                                <div className='user-button'>
                                    <Link to="/downloads">
                                        <Button style={{ fontSize: 20, width: 170, height: 40, fontFamily: 'Mitr' }} type='primary'>การดาวน์โหลด</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className='user-text'>ติดต่อ Admin
                                <div className='user-button'>
                                    <Link to="/report">
                                        <Button style={{ fontSize: 20, width: 170, height: 40, fontFamily: 'Mitr' }} type='primary'>ติดต่อ Admin</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ConfigProvider>
            {/* <Footer style={{ textAlign: 'center' }}>Movie App ©2023 Created by Team03 of System Engineering</Footer> */}
        </div>

    );
};



export default UserAccount;
