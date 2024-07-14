import React, { useState, useEffect } from 'react';
import { Button, ConfigProvider } from 'antd';
import './styles/userpayment.css';
import type { UploadChangeParam } from 'antd/es/upload';
import { Modal, Upload,Form ,message} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { PaymentUploadInterface,UserInterface } from '../../../interface/mix';
import { PackageInterface } from '../../../interface/pool';
import { PaymentUserUpload,GetPackageByID,GetUserByID } from '../../../service/mix';
import Cookies from 'js-cookie'; //npm install js-cookie
import Package from '../../pool/package/package';
import { duration } from 'moment';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};



export default function UserPayment() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const handleCancelClick = () => {
    navigate('/package');
  };

  const handleNextClick = () => {
    // ทำตราบางอย่างเมื่อคลิกที่ปุ่ม 'ถัดไป'
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleCancel = () => setPreviewOpen(false);

 
  const uploadButton = (
    
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    
  );
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
        
      });
    }
  };
  const [userID, setUserID] = useState<number | undefined>(undefined);
  const [packageID, setPackageID] = useState<number | undefined>(undefined);
  const [packages, setPackages] = useState<PackageInterface>();
  const [User, setUser] = useState<UserInterface>();
 
  useEffect(() => {
    const fetchData = async () => {
      const userIDFromCookie = Cookies.get('UserID');
      const selectedPackageFromCookie = Cookies.get('selectedPackage');

      if (selectedPackageFromCookie) {
        const parsedPackageID = Number(selectedPackageFromCookie);
        setPackageID(parsedPackageID);

        try{

          const package1 = await GetPackageByID(parsedPackageID);
          setPackages(package1);
          console.log(package1);
        }
       catch (error) {
        console.error('Error fetching user data:', error);
      }
      }
      if (userIDFromCookie) {
        const parsedUserID = Number(userIDFromCookie);
        setUserID(parsedUserID);
  
        // Assuming GetUserByID is an asynchronous function that returns a promise
        try {
          const user = await GetUserByID(parsedUserID);
          setUser(user);
          console.log(user)


          
          // Use 'user' as needed
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
  
    
    };
  
    fetchData();

}, []);


  const onFinish = async (values: PaymentUploadInterface) => {
    console.log(values);
    if (!imageUrl) {
      
      messageApi.open({
        type: "error",
        content: "กรุณาอัพโหลดสลิป",
        duration: 10,
    
      });
      return;
    }
    const updatedValues = {
      ...values,
      bill: imageUrl
      
    };
    
    let res = await PaymentUserUpload(userID,updatedValues,packageID);

    if (res.status == true) {
      
      messageApi.open({
        type: "success",
        content: "อัพโหลดสำเร็จ",
        duration: 10,
      
      });
     
      setTimeout(function () {
        navigate('/login')
      }, 10000);
    } else {
      message.error(res.message);
      // setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div>
      <ConfigProvider theme={{
        components: {
          Button: {
            colorPrimary: '#F5CE00',
            algorithm: true,
            primaryColor: '#000000',
          },
        },
      }}>
        <Form onFinish={onFinish}>
        <div className='web-package'>
       
          <div className='box-main-container'>
            <div className='box-main-container-inner'>
              <div className='package-text'>ชำระเงิน</div>
            </div>
            <div className='userpayment-box'>
              <div className='userpayment-box-top'>
                <div className='userpayment-box-top-text'>
                  <div>
                    ชื่อบัญชีผู้ใช้งาน : {User?.Username}
                  </div>
                  <div>
                    อีเมล : {User?.Email}
                  </div>
                  <div>
                    แพ็คเกจ : {packages?.PackageName}
                  </div>
                  <div >
                    ยอดที่ต้องชำระ : {packages?.Price} บาท
                  </div>
                </div>
                
                <div className='userpayment-box-top-upload' style={{userSelect:'none'}}>
                  <div>
                    อัพโหลดสลิป
                  </div>
                  <>
                  {contextHolder}
                  <Form.Item
                          name='bill'
                        >
                    <Upload
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" 
                      listType="picture-card"
                      showUploadList={false}
                      onChange={handleChange}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', marginTop:'30%' }} /> : uploadButton}
                    
                    </Upload>
                    </Form.Item>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                    
                  </>
                </div>
              </div>
              <div style={{width:'50%' ,userSelect:'none'}}>
                <img className='userpayment-box-top-slip'style={{width:'70%'}} alt='Image' src={require("./asset/slippayment.jpg")} />
              </div>
            </div>

            <div className='button-cancel'>
              <Button onClick={handleCancelClick}
                style={{ width: '100px', height: "40px", fontFamily: 'Mitr', fontSize: 20, textAlign: "center" }} danger>
                ยกเลิก
              </Button>
            </div>
           
            <div className='button-next'>
              <Button onClick={handleNextClick}
                style={{ width: '100px', height: "40px", fontFamily: 'Mitr', fontSize: 20, textAlign: "center" }}
                htmlType="submit" >
                ถัดไป
              </Button>
            </div>
          </div>
       
        </div>
        </Form>
      </ConfigProvider>
    </div>
  );
}
