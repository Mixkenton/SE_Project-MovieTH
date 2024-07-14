import React, { useState, useEffect, } from 'react';
import './styles/adminPayment.css';
import { Button, Divider, Flex, Radio,Modal,Form,Input,message } from 'antd'; //npm install antd --save
import { PlayCircleFilled,ExclamationCircleFilled} from '@ant-design/icons';
import { InputNumber, Image } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { UserOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { PaymentAdmin, PaymentAdminAllowed, UpdateSubscribe ,PaymentAdminNotAllowed,UpdateSubscribe2 ,UpdateNameAdmin} from '../../../service/mix';
import Cookies from 'js-cookie'; //npm install js-cookie


interface Product {
  ID: number;
  Bill: string;
  UserID: number;
  PaymentStatusID: number;
  Datetime: any;
  Username:string;
  Email:string;
  Price:any;
  PackageName:string;

}
interface Product1 {
  Adminname: string;
  Adminkey: number;

}

function AdminPayment() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<SizeType>('large');
  const [messageApi, contextHolder] = message.useMessage();
  // const [visible, setVisible] = useState(false);
  const [productVisibility, setProductVisibility] = useState<{ [key: number]: boolean }>({});
  const [scaleStep, setScaleStep] = useState(0.5);
  const [products, setProducts] = useState<Product[]>([]);
  const { confirm } = Modal;

  const paymentAdmin = async () => {
    let res = await PaymentAdmin();
    console.log(res);
    if (res) {
      setProducts(res);
      

    }
  };

  const navigate = useNavigate();
  function clickMovie() {
    navigate('/admin/movie');
  }
  function clickPayment() {
    navigate('/admin/payment');
  }
  function clickBack() {
    localStorage.removeItem('token');
    navigate('/');
  }
  function clickUser() {
    navigate('/admin');
  }

  useEffect(() => {
    paymentAdmin();


  }, []);

  const onClick = (ID: Number, UserID: Number) => {
    showModalEdit(ID,UserID);
    // ID use for change payment table only and UserID change subscribe only
    // PaymentAdminAllowed(ID);
    // console.log(ID)
    // UpdateSubscribe(UserID);
    // setTimeout(() => window.location.reload(), 100);

  }
  const onClick2 = (ID: Number, UserID: Number) => {
    
    // // ID use for change payment table only and UserID change subscribe only
    PaymentAdminNotAllowed(ID);
    console.log(ID)
    UpdateSubscribe2(UserID);
    setTimeout(() => window.location.reload(), 100);

  }
  const showModalEdit = (ID: Number, UserID: Number) => {
    
    Cookies.set('ID', String(ID) , { expires: 7 }); //setCookie(name, value, {วันหมดอายุ})
    Cookies.set('UserIDKey', String(UserID) , { expires: 7 }); //setCookie(name, value, {วันหมดอายุ})
    setOpen(true);
    
  };
  const handleOkEdit = () => {
    setTimeout(() => {
      setOpen(false);
    }, 10000);
  };
  const handleCancelEdit = () => {
    Cookies.set('ID', "" , { expires: 7 }); //setCookie(name, value, {วันหมดอายุ})
    Cookies.set('UserIDKey', "" , { expires: 7 }); //setCookie(name, value, {วันหมดอายุ})
    setOpen(false);
  };
  const onFinish1 = async (values: Product1) => {
    const UserID = Number(Cookies.get('UserIDKey'));
    const ID = Number(Cookies.get('ID'));
    if (!values.Adminname || !values.Adminkey) {
      messageApi.open({
        type: 'error',
        content: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        duration:10,
      });
      return;
    }
  
    const AdminName = String(values.Adminname);
    const AdminKey = values.Adminkey;

    
    try {
      let res = await UpdateNameAdmin(ID, AdminName, AdminKey);
      
  
      // Check if the response is a valid JSON object
      if (res && typeof res === 'object') {
        console.log(res.data)
        if (res.data) {
          PaymentAdminAllowed(ID);
          UpdateSubscribe(UserID);
          Cookies.set('ID', "" , { expires: 7 }); //setCookie(name, value, {วันหมดอายุ})
          Cookies.set('UserIDKey', "" , { expires: 7 }); //setCookie(name, value, {วันหมดอายุ})
          
          messageApi.open({
            type: "success",
            content: "สำเร็จ",
            duration:10,
          });
  
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        
        } else {
            // If no specific message is available, show a generic error message
            messageApi.open({
              type: "error",
              content: "ขออภัย เกิดข้อผิดพลาด",
              duration:10,
            });
          
        }
      } else {
        // Handle non-JSON response
        messageApi.open({
          type: "error",
          content: "Invalid response format",
          duration:10,
        });
      }
    } catch (error) {
      // Handle any other errors that might occur during the API call
      console.error("Error during API call:", error);
      messageApi.open({
        type: "error",
        content: "An error occurred during the API call",
        duration:10,
      });
    }
  };
  
  



  return (
    <div className='admin-page'>
      <div className='admin-sidebar'>
        <div className='admin-sidebar-top'>
          <div className='admin-sidebar-text'>
            ADMIN
          </div>
          <div className='admin-sidebar-menu'>
            <Button type="primary" shape="round" size={size} onClick={clickUser} style={{
              color: 'black', fontSize: 'large', fontWeight: 'bold', marginBottom: '10%', backgroundColor: '#F5CE00'
            }}>
              User
            </Button>
            <Button type="primary" shape="round" size={size} onClick={clickMovie} style={{
              color: 'black', fontSize: 'large', fontWeight: 'bold', marginBottom: '10%', backgroundColor: '#F5CE00'
            }}>
              Movies
            </Button>

            <Button type="primary" shape="round" size={size} onClick={clickPayment} style={{
              color: 'black', fontSize: 'large', fontWeight: 'bold', marginBottom: '10%', backgroundColor: '#F5CE00'
            }}>
              Payment
            </Button>

          </div>
        </div>

        <div className='admin-text-logout' onClick={clickBack}>
          logout
        </div>
      </div>
      <div className='admin-content-payment'>
        <div className='admin-content-payment-header'>
          <div className='admin-content-payment-header-text'>
            Payment
          </div>
          <div className='admin-conteet-payment-header-right'>
            <div className='admin-content-payment-header-text2'>
              Admin01
            </div>
            <UserOutlined style={{ fontSize: '30px' }} />
          </div>

        </div>
        <div className='admin-content-payment-user-bg'>


          {products.map((p) => (


            p.PaymentStatusID == null && (
              <div className='admin-content-payment-user' key={p.ID}>
                <div className='admin-content-payment-user-left'>
                  <img className="imageUser" alt="Image" src={require("./asset/Group.png")} />
                  <div className='admin-content-payment-user-text'>
                    <div>
                      ชื่อผู้ใช้ : {p.Username}
                    </div>
                    <div>
                      อีเมล : {p.Email}
                    </div>
                    <div>
                      วันที่ : {p.Datetime}
                    </div>
                  </div>
                  <div className='admin-content-payment-user-text2'>
                    <div>
                      ยอดชำระ : {p.Price} บาท
                    </div>
                    <div>
                      แพ็คเกจ : {p.PackageName}
                    </div>
                    <div className='statusUserPayment'>
                      สถานะ :
                      <div style={{ marginLeft: '5px', color: '#C52929', fontWeight: 'bold' }}>
                        ยังไม่อนุมัติ
                      </div>
                    </div>
                  </div>
                  <div style={{ marginLeft: '2%', position: 'relative',fontSize:'1.5vh' }}>
                    <Button style={{ backgroundColor: '#F5CE00',fontSize:'1.5vh' }} type="primary" size={size} onClick={() => setProductVisibility({ ...productVisibility, [p.ID]: true })}>
                      show Image
                    </Button>
                    <Image
                      width={200}
                      style={{ display: 'none' }}
                      src={p.Bill}
                      preview={{
                        visible: productVisibility[p.ID],
                        scaleStep,
                        onVisibleChange: (value) => {
                          setProductVisibility({ ...productVisibility, [p.ID]: value });
                        },
                      }}
                    />
                  </div>
                </div>
                {contextHolder}
                <Button style={{
                  marginRight: '1%',
                  fontSize: '24px',
                  backgroundColor: '#F57B7B',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                }} type="primary" shape="circle" onClick={() => onClick2(p.ID, p.UserID)} >
                  <CloseOutlined />
                </Button>
                <Button style={{
                  marginRight: '2%',
                  fontSize: '24px',
                  backgroundColor: '#ABE49D',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                }} type="primary" shape="circle" onClick={() => onClick(p.ID, p.UserID)}>
                  <CheckOutlined />
                </Button>
              </div>

            )
            


          ))}
          <Modal
                                open={open}
                                title="โปรดลงชื่อผู้ให้อนุมัติ"
                                onOk={handleOkEdit}
                                onCancel={handleCancelEdit}
                                footer={[
                                  
                                ]}
                              >
                                <Form 
                                style={{display:'flex',
                                  flexDirection:'row'
                                    }}
                                onFinish={onFinish1}>
                                <div style={{ display: 'flex', flexDirection: 'column',alignItems:'center' }}>
                                
                                  <Form.Item name="Adminname">
                                    <Input showCount maxLength={50}  placeholder='Name' style={{width:'150%'}}></Input>
                                  </Form.Item >
                                  <Form.Item name="Adminkey">
                                    <Input showCount maxLength={10} placeholder='Price_Of_Bill' style={{width:'150%'}}></Input>
                                  </Form.Item >
                                        
                                        <button className='edit-ok-payment' type='submit' style={{
                                          width:'30%' ,backgroundColor:'#F5CE00',cursor:'pointer'
                                        }}>ยืนยัน</button>
               
                                </div>
                                </Form>
                                
                                
                              </Modal>

          {products.map((p) => (
            p.PaymentStatusID != null && (
              <div className='admin-content-payment-user2 'key={p.ID}>
                <div className='admin-content-payment-user-left'>
                  <img className="imageUser" alt="Image" src={require("./asset/Group.png")} />
                  <div className='admin-content-payment-user-text'>
                    <div>
                      ชื่อผู้ใช้ : {p.Username}
                    </div>
                    <div>
                      อีเมล : {p.Email}
                    </div>
                    <div>
                      วันที่ : {p.Datetime}
                    </div>
                  </div>
                  <div className='admin-content-payment-user-text2'>
                    <div>
                      ยอดชำระ : {p.Price} บาท
                    </div>
                    <div>
                      แพ็คเกจ : {p.PackageName}
                    </div>
                    <div className='statusUserPayment'>
                      สถานะ :
                      {
                        p.PaymentStatusID == 1 && (
                          <div style={{ marginLeft: '5px', color: '#5AA122', fontWeight: 'bold' }}>
                            อนุมัติ
                          </div>
                        )
                      }
                      {
                        p.PaymentStatusID == 2 && (
                          <div style={{ marginLeft: '5px', color: '#C52929', fontWeight: 'bold' }}>
                            ไม่อนุมัติ
                          </div>
                        )

                      }

                    </div>
                  </div>
                  <div style={{ marginLeft: '2%' ,position: 'relative'}}>
                    <Button style={{ backgroundColor: '#F5CE00' }} type="primary" size={size} onClick={() => setProductVisibility({ ...productVisibility, [p.ID]: true })}>
                      show Image
                    </Button>
                    <Image
                      width={200}
                      style={{ display: 'none' }}
                      src={p.Bill}
                      preview={{
                        visible: productVisibility[p.ID],
                        scaleStep,
                        onVisibleChange: (value) => {
                          setProductVisibility({ ...productVisibility, [p.ID]: value });
                        },
                      }}
                    />
                  </div>
                </div>

              </div>
            )))}



        </div>

      </div>

    </div>


  );
}


export default AdminPayment;