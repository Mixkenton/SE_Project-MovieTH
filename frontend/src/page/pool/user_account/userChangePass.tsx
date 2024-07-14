import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UpdateUserPass } from '../../../service/pool';
import { GetUserInfo } from '../../../service/pool';
import { UserInterface } from '../../../interface/pool';
import { ComparePasswords } from '../../../service/pool';
import { Form, Input, Button, Modal, ConfigProvider, message } from 'antd';
import Cookies from 'js-cookie';

interface UserChangePassProps {
  visible: boolean;
  onCancel: () => void;
}

const UserChangePass: React.FC<UserChangePassProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [upUser, setUpUser] = useState<UserInterface | undefined>();
  const id = localStorage.getItem('UserID');
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const user = await GetUserInfo(Number(id));

      // Use the hashed password stored in the database for comparison
      // const hashedCurrentPassword = user.Password;

      // Compare the entered current password with the hashed password
      const isPasswordMatch = await ComparePasswords(values.CurrentPassword, id);

      if (!isPasswordMatch) {
        throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
      }

      const updatedUser = { ...user, Password: values.NewPassword };

      // Display a confirmation modal before updating the user
      Modal.confirm({
        title: (
          <span style={{ fontSize: '1.6em', padding: '20px', fontFamily: 'Mitr', color: 'red' }}>
            Confirm Change Password
          </span>
        ),
        content: (
          <span style={{ fontSize: '1.2em', padding: '20px', fontFamily: 'Mitr' }}>
            เมื่อเปลี่ยน Password แล้วต้อง login ใหม่
          </span>
        ),
        onOk: async () => {
          await UpdateUserPass(updatedUser);
          messageApi.success('รหัสผ่านถูกเปลี่ยนแล้ว');
          onCancel();

          setTimeout(() => {
            Cookies.remove('UserID');
            localStorage.removeItem('UserID');
            localStorage.removeItem('token');
            navigate("/");
          }, 3000);

        },
        onCancel: () => {

        },

        width: 550,
        centered: true,
      });
    } catch (error) {
      const errorMessage: string =
        (error as Error)?.message || 'Error updating password';
      messageApi.error(errorMessage);
    }
  };

  const getUserByID = async () => {
    try {
      let res = await GetUserInfo(Number(id));

      if (res) {
        setUpUser(res);
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  useEffect(() => {
    getUserByID();
    form.setFieldsValue({
      NewPassword: upUser?.Password,
    });
  }, []);

  return (
    <ConfigProvider
      theme={{
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
          },
        },
      }}
    >
      <Modal
        title={<span style={{ fontSize: '1.9em', padding: '20px', fontFamily: 'Mitr' }}>Change Password</span>}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={600}
        centered
      >
        {contextHolder}
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="CurrentPassword"
            rules={[{ required: true, message: 'โปรดกรอกรหัสผ่านปัจจุบันของคุณ!' }]}
          >
            <Input.Password
              style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%', marginTop: '10px' }}
              placeholder="Current Password"
            />
          </Form.Item>

          <Form.Item
            name="NewPassword"
            rules={[
              {
                required: true,
                message: 'โปรดกรอกรหัสผ่านใหม่!'
              },
              {
                min: 4,
                message: "รหัสผ่านไม่ต่ำกว่า 4 ตัว"
              }]}
          >
            <Input.Password
              style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%', marginTop: '10px' }}
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['NewPassword']}
            rules={[
              { required: true, message: 'โปรดยืนยันรหัสผ่านอีกครั้ง!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('NewPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน!'));
                },
              })
            ]}
          >
            <Input.Password
              style={{ fontSize: '1.4em', fontFamily: 'Mitr', width: '100%', marginTop: '10px' }}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ fontSize: 20, width: 100, height: 40, fontFamily: 'Mitr' }}
              type="primary"
              htmlType="submit"
            >
              Save
            </Button>
            <Button
              style={{ fontSize: 20, width: 100, height: 40, fontFamily: 'Mitr', marginLeft: 8 }}
              htmlType="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default UserChangePass;
