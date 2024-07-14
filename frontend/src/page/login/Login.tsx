import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import { ConfigProvider, Button, Input, Form, message } from 'antd';
import { ListUsersToLogin ,LoginByAuth} from '../../service/login';
import { UserForLoginInterface,LoginInterface } from '../../interface/login';
import { SubscribeCheck } from '../../service/mix';
import Cookies from 'js-cookie'; //npm install js-cookie


export default function Login() {
    const navigate = useNavigate();
    const onFinish = async (values: LoginInterface) => {
        let res = await LoginByAuth(values);
        console.log(res)
        const authToken = res.message.token
        if (res.message === "Email Not found") {
            message.error("ไม่พบอีเมลดังกล่าว");
        } if (res.message === "invalid password") {
            message.error("รหัสผ่านผิด โปรดลองอีกครั้ง");
        } 
        if (res.message === "Status admin") {
            message.success("สวัสดี แอดมิน");
            localStorage.setItem('token', authToken);
            setTimeout(function () {
                navigate("/admin");
            }, 2000);
        }
        if (res.status == true && res.message.StatusUserID == 1) {
            message.success("สวัสดี แอดมิน");
        if(authToken!=""){
            setTimeout(function () {
                localStorage.setItem('token', authToken);
                navigate("/admin");
            }, 2000);
        }
        }
        else {
            localStorage.setItem('UserID', res.message.id);
            localStorage.setItem('token', authToken);
            Cookies.set('UserID', res.message.id , { expires: 7 }); //setCookie(name, value, {วันหมดอายุ})
            const UserID = Cookies.get('UserID');
            console.log('Cookies UserID : ' + UserID);

            // console.log('StatusUserID : ' + res.message.StatusUserID) //iduser
            let res2 = await SubscribeCheck(Number(UserID));
            // console.log(res2[0].SubscribeStatusID);
            if (res.status == true && res.message.StatusUserID == 2 && res2 == false  ) {
                setTimeout(function () {
                    navigate("/package");
                }, 2000);
            }
            if (res2 && res2.length > 0) {
                if (res.status == true && res.message.StatusUserID == 2 && res2[0].SubscribeStatusID === 3) {
                    setTimeout(function () {
                        navigate("/package");
                    }, 2000);
                }
                if (res.status == true && res.message.StatusUserID == 2 && res2[0].SubscribeStatusID === 1) {
                    message.error("ขณะนี้บัญชีของท่านอยู่สถานะตรวจสอบ กรุณารอสักครู่..");
                }
                if (res.status == true && res2[0].SubscribeStatusID == 2) {
                    message.success("ยินดีต้อนรับ");
                    setTimeout(function () {
                        navigate("/homepage");
                    }, 2000);
                }
               
            } else {
                // Handle the case where res2 is undefined or has no elements
            }
        }
    }
    function backward() {
        navigate('/');
    }

    return (
        <div className='web-login'>
            <ConfigProvider theme={{
                components: {
                    Button: {
                        colorPrimary: '#F5CE00',
                        algorithm: true,
                        primaryColor: '#000000',
                    },
                    Input: {
                        colorPrimary: '#F5CE00',
                        algorithm: true,
                    },
                },
            }}>
                <div className='login-backward'>
                    <Button style={{ fontSize: 18, width: 100, height: 40, fontFamily: 'Mitr' }} type='primary' onClick={backward}><b>ย้อนกลับ</b></Button>
                </div>
                <div className='body-login'>
                    <div className='Form-box'>
                        <div className='body-login-text'>เข้าสู่ระบบ</div>

                        <Form onFinish={onFinish}>
                            <div className='input-email'>
                                <Form.Item name="Email" rules={[{ required: true, message: "โปรดใส่อีเมล" }]}>
                                    <Input style={{ width: 400, height: 50, fontSize: 20, fontFamily: 'Mitr'}} placeholder='อีเมล'></Input>
                                </Form.Item>
                            </div>
                            <div className='input-password'>
                                <Form.Item name="Password" rules={[{ required: true, message: "โปรดใส่รหัสผ่าน" }]}>
                                    <Input style={{ width: 400, height: 50, fontSize: 20, fontFamily: 'Mitr' }} placeholder='รหัสผ่าน' type='password'></Input>
                                </Form.Item>
                            </div>
                            <div className='reg-text'> ยังไม่มีบัญชีผู้ใช้งาน?
                                <Link to='/register' style={{ textDecoration: 'none' }}>
                                    <div className='reg-link'>สร้างบัญชีผู้ใช้งาน</div>
                                </Link>
                            </div>
                            <div className='login-button'>
                                <Form.Item>
                                    <Button style={{ fontSize: 20, width: 120, height: 45, fontFamily: 'Mitr' ,}} type='primary' htmlType='submit'><b>เข้าสู่ระบบ</b></Button>
                                </Form.Item>
                            </div>
                            
                        </Form>
                    </div>
                    </div>
            </ConfigProvider>
        </div>
    );
}