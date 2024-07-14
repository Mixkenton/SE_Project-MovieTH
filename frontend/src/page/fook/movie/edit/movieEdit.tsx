import { PlusOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Upload, message } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { useEffect, useState } from "react";
import type { RcFile, UploadProps, UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useNavigate, useParams } from "react-router-dom";
import { GetCategories, GetMovieById, GetSoundtrack, GetTarget, UpdateMovie } from "../../../../service/fook";
import { CategoriesInterface, ImageUpload, MoviesInterface, SoundtrackInterface, TargetInterface, thumbUrl } from "../../../../interface/fook";
import dayjs from 'dayjs';
import 'dayjs/locale/th';

const { Option } = Select;

export default function MovieEdit(){
    const [size, setSize] = useState<SizeType>('large');
    const [movie, setMovie] = useState<MoviesInterface>();
    const [categories, setCategories] = useState<CategoriesInterface[]>([]);
    const [target, setTarget] = useState<TargetInterface[]>([]);
    const [soundtrack, setSoundtrack] = useState<SoundtrackInterface[]>([]);
    const [imageUrl, setImageUrl] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const handleCancel = () => setPreviewOpen(false);
    const [previmage, setPrevimage] = useState<ImageUpload>()
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result as string));
      reader.readAsDataURL(img);
    };
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
    const [form] = Form.useForm();
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
      let {id} = useParams();
      const onFinish = async (values: MoviesInterface) => {
        values.Image = imageUrl;
        values.ID = movie?.ID;
        let res = await UpdateMovie(values);
        if (res.status) {
          message.success("อัปเดตสำเร็จ")
          setTimeout(function () {
            navigate("/admin/movie");
          }, 2000);
        }else{
          message.error(res.message);
        }
        console.log(values);
      };
      const getMovieById = async () => {
        let res = await GetMovieById(Number(id));
        const initialFileList = res.Image
        ? [
            {
              uid: '-1',
              name: 'thumbnail.jpg',
              status: 'done',
              url: res.Image,
            },
          ]
        : [];
        
        setImageUrl(initialFileList[0].url)
        setPrevimage((prevImage: ImageUpload | undefined) => ({
          ...prevImage!,
          thumbUrl: initialFileList[0].url,
        }));
        if (res) {
          setMovie(res);
          form.setFieldsValue({ 
            Title: res.Title,
            Duration: res.Duration,
            Description: res.Description,
            Director: res.Director,
            ReleaseDate: dayjs(res.ReleaseDate),
            Cast: res.Cast,
            Image: initialFileList,
            Video: res.Video,
            DownloadUrl: res.DownloadUrl,
            CategoriesID: res.CategoriesID,
            TargetID: res.TargetID,
            SoundtrackID: res.SoundtrackID,
        });
        console.log(res);
        }
      };
      
      const normFile = (e: any) => {
        if (Array.isArray(e)) {
          return e;
        }
        setPrevimage(e?.fileList[0])
        return e?.fileList;
      };
      const getCategories = async () => {
        let res = await GetCategories();
        if (res) {
          setCategories(res);
        }
      };
      const getTarget = async () => {
        let res = await GetTarget();
        if (res) {
          setTarget(res);
        }
      };
      const getSoundtrack = async () => {
        let res = await GetSoundtrack();
        if (res) {
          setSoundtrack(res);
        }
      };
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
      }
        getMovieById();
        getCategories();
        getTarget();
        getSoundtrack();
      }, []);
      return(
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
          <div className='admin-content-movie-header-left'>
            <div className='admin-content-payment-header-text'>
              MovieEdit
            </div>
          </div>
          <div className='admin-conteet-payment-header-right'>
            <div className='admin-content-payment-header-text2'>
              Admin01
            </div>
            <UserOutlined style={{ fontSize: '30px' }} />
          </div>
        </div>
        <div className='admin-movie'>
        <Card style={{width:"100%", height: "100%"}}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                  <Row gutter={[32, 32]}>
                    <Col xs={8} sm={8} md={8} lg={4} xl={3}>
                      <Row>
                      <Form.Item label='รูปภาพ' name='Image' valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload
                          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                          listType="picture-card"
                          showUploadList={false}
                          onChange={handleChange} 
                        >
                        {imageUrl ? <img src={imageUrl} alt="Thumbnail" style={{ width: '100%', marginTop: '30%' }} /> : uploadButton}
                        </Upload>
                      </Form.Item>
                      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                      </Row>
                      <Row style={{marginTop: 30}}>
                      <Form.Item>
                        <Button style={{fontSize: "150%",width: "150%",height:"150%",fontFamily:'Mitr'}} htmlType="submit">ตกลง</Button>
                      </Form.Item>
                      </Row>
                    </Col>
                    <Col xs={10} sm={10} md={15} lg={8} xl={4}>
                    <Row>
                      <Form.Item label="ชื่อเรื่อง" name="Title" rules={[{required: true,message:"กรอกชื่อเรื่อง"}]}>
                        <Input/>
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item label="ความยาว(min)" name="Duration" rules={[{required: true,message:"กรอกความยาว"}]}>
                        <Input/>
                      </Form.Item>
                    </Row>
                    <Row >
                      <Form.Item label="วันที่ออกฉาย" name="ReleaseDate" rules={[{required: true,message:"กรอกวันที่ออกฉาย"}]}>
                        <DatePicker style={{ maxWidth: "100%" }}></DatePicker>
                      </Form.Item>
                    </Row>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={17}>
                      <Form.Item label="เรื่องย่อ" name="Description" rules={[{required: true,message:"กรอกเรื่องย่อ"}]}>
                        <Input.TextArea style={{resize: "none", width: "100%", height: 180}}/>
                      </Form.Item>
                    </Col>
                  </Row>  
                    <Row>
                        <Col xs={16} sm={16} md={16} lg={16} xl={7} style={{marginLeft: "12.5%"}}>
                            <Form.Item label="ผู้กำกับ" name="Director" rules={[{required: true,message:"กรอกผู้กำกับ"}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label="นักแสดง" name="Cast" rules={[{required: true,message:"กรอกนักแสดง"}]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col xs={16} sm={16} md={16} lg={16} xl={7} style={{marginLeft: "12.5%"}}>
                            <Form.Item label="วีดีโอ" name="Video" rules={[{required: true,message:"กรอกลิ้ง"}]}>
                              <Input/>
                            </Form.Item>
                            <Form.Item label="ลิ้งดาวน์โหลด" name="DownloadUrl" rules={[{required: true,message: "กรอกลิ้งดาวน์โหลด"}]}>
                              <Input/>
                            </Form.Item>
                        </Col>
                      </Row>
                      <Row style={{marginLeft: "12.5%", display: "block", width: "29%"}}>
                            <Form.Item label="หมวดหมู่" name="CategoriesID" rules={[{required: true,message:"กรอกหมวดหมู่"}]} >
                                <Select allowClear>
                                {categories.map((item) => (<Option value={item.ID} key={item.Categories}>{item.Categories}</Option>))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="กลุ่มเป้าหมาย" name="TargetID" rules={[{required: true,message:"กรอกเป้าหมาย"}]}>
                                <Select>
                                {target.map((item) => (<Option value={item.ID} key={item.Target}>{item.Target}</Option>))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="รูปแบบเสียง" name="SoundtrackID" rules={[{required: true,message:"กรอกรูปแบบเสียง"}]}>
                                <Select>
                                {soundtrack.map((item) => (<Option value={item.ID} key={item.Soundtrack}>{item.Soundtrack}</Option>))}
                                </Select>
                            </Form.Item>
                    </Row>
                </Form>
            </Card>
        </div>
      </div>
    </div>
    );
}