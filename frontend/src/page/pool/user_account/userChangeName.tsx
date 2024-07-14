import React, { useState, useEffect } from 'react';
import { UpdateUser } from '../../../service/pool';
import { GetUserInfo } from '../../../service/pool';
import { UserInterface } from '../../../interface/pool';
import { ComparePasswords } from '../../../service/pool';
import { Form, Input, Button, Modal, ConfigProvider, Col, Row, message } from 'antd';
import { JSX } from 'react/jsx-runtime';
interface UserChangeNameProps {
    visible: boolean;
    onCancel: () => void;
}

const UserChangeName: React.FC<UserChangeNameProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [upUser, setUpUser] = useState<UserInterface>();

    // const id = localStorage.getItem('UserID');
    const id = localStorage.getItem('UserID');

    const onFinish = async (values: any) => {
        try {
            // console.log("Entered password:", values.password);
            const isPasswordMatch = await ComparePasswords(values.password, id);

            if (!isPasswordMatch) {
                throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
            }

            let res = await UpdateUser(values);

            if (res.message === "Username already exists") {
                message.error("ชื่อผู้ใช้ซ้ำกรุณาใช้ชื่ออื่น");
            }
            if (res.status) {
                messageApi.open({
                    type: "success",
                    content: "แก้ไขข้อมูลสำเร็จ",
                    onClose: () => {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    },
                });

                onCancel();
            }
        } catch (error) {
            console.error("Error updating user:", error);
            const errorMessage: string = (error as Error)?.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้";
            messageApi.open({
                type: "error",
                content: errorMessage,
            });
        }
    };

    const getUserInfo = async () => {
        let res = await GetUserInfo(Number(id));
        // console.log("User Info from API:", res);
    
        form.setFieldsValue({
            Username: res[0]?.Username,
        });
    
        setUpUser(res);
    };
    
    

    useEffect(() => {
        // console.log("Fetching user info...");
        getUserInfo();
    }, []);

    return (
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
                Select: {
                    colorPrimary: '#F5CE00',
                    algorithm: true,
                },
                DatePicker: {
                    colorPrimary: '#F5CE00',
                    algorithm: true,
                }
            },
        }}>
            <Modal
                title={<span style={{ fontSize: '1.9em', padding: "20px", fontFamily: 'Mitr' }}>แก้ไขข้อมูลผู้ใช้</span>}
                visible={visible}
                onCancel={onCancel}
                footer={null}
                width={600}
                centered

            >
                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="Username"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณาใส่ Username ของคุณ',
                            },
                            {
                                min: 4,
                                message: "Username ไม่ต่ำกว่า 4 ตัว"
                            }
                        ]}
                    >
                        <Input style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%', marginTop: '10px' }} placeholder='New Username' />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณาใส่รหัสผ่านของคุณ',
                            },
                        ]}
                    >
                        <Input.Password style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%' }} placeholder='Password' />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '10px' }}>
                        <Button style={{ fontSize: 20, width: 100, height: 40, fontFamily: 'Mitr' }} type="primary" htmlType="submit">
                            Save
                        </Button>
                        <Button style={{ fontSize: 20, width: 100, height: 40, fontFamily: 'Mitr', marginLeft: 8 }} htmlType="button" onClick={onCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
                {contextHolder}
            </Modal>
        </ConfigProvider>
    );
};

export default UserChangeName;
