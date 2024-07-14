import { UpdateUser } from '../../../service/pool';
import { GetUserInfo } from '../../../service/pool';
import { UserInterface, GenderUserInterface, PrefixUserInterface } from '../../../interface/pool';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Select, DatePicker, ConfigProvider, message, Col, Row } from 'antd';
import { GetGenders, GetPrefix } from '../../../service/login';
import { ComparePasswords } from '../../../service/pool';
import dayjs from "dayjs";
import 'dayjs/locale/th';

interface UserChangeDetialProps {
    visible: boolean;
    onCancel: () => void;
}

const { Option } = Select;

const UserChangeDetial: React.FC<UserChangeDetialProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [genders, setGenders] = useState<GenderUserInterface[]>([]);
    const [prefix, setPrefix] = useState<PrefixUserInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [upUser, setUpUser] = useState<UserInterface>();

    const id = localStorage.getItem('UserID');

    const onFinish = async (values: any) => {
        try {
            // console.log("Entered password:", values.password);
            // console.log("Database password:", user.Password);

            const isPasswordMatch = await ComparePasswords(values.password, id);

            if (!isPasswordMatch) {
                throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
            }
            // Update the user data including the password
            let res = await UpdateUser(values);

            if (res.message === "Validation failed") {
                message.error("Fristname หรือ Lastname ต้องไม่เป็นอักษรพิเศษ");
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
            PrefixID: res[0]?.PrefixID,
            Firstname: res[0]?.Firstname,
            Lastname: res[0]?.Lastname,
            Address: res[0]?.Address,
            GenderID: res[0]?.GenderID,
            Dob: dayjs(res[0]?.Dob),
        });

        setUpUser(res);
    };

    const getGender = async () => {
        let res = await GetGenders();
        if (res) {
            setGenders(res);
        }
    };

    const getPrefix = async () => {
        let res = await GetPrefix();
        if (res) {
            setPrefix(res);
        }
    };

    useEffect(() => {
        getGender();
        getPrefix();
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
                title={<span style={{ fontSize: '1.9em', padding: "20px", fontFamily: 'Mitr' }}>แก้ไขข้อมูลส่วนตัว</span>}
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
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item name="PrefixID">
                            <Select style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '49%', height: '40px', marginTop: '10px' }} placeholder='คำนำหน้า'>
                                {prefix.map((item) => (<Option value={item.ID} key={item.Prefix}>{item.Prefix}</Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                name="Firstname"
                            >
                                <Input style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%', marginTop: '10px' }} placeholder='New Firstname' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                name="Lastname"
                            >
                                <Input style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%', marginTop: '10px' }} placeholder='New Lastname' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item name="Dob">
                                <DatePicker style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%', height: '40px', marginTop: '10px' }} placeholder='วันเกิด'></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item name="GenderID">
                                <Select style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%', height: '40px', marginTop: '10px' }} placeholder='เพศ'>
                                    {genders.map((item) => (<Option value={item.ID} key={item.Gender}>{item.Gender}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="Address"
                    >
                        <Input.TextArea style={{ resize: "none", width: "100%", height: 90, fontSize: '1.4em', fontFamily: 'Mitr', marginTop: '10px' }} placeholder='New Address' />
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
                        {contextHolder}
                        <Button style={{ fontSize: 20, width: 100, height: 40, fontFamily: 'Mitr' }} type="primary" htmlType="submit">
                            Save
                        </Button>
                        <Button style={{ fontSize: 20, width: 100, height: 40, fontFamily: 'Mitr', marginLeft: 8 }} htmlType="button" onClick={onCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider >
    );
};

export default UserChangeDetial;

