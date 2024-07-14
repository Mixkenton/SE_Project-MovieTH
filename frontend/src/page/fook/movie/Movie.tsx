import { Button, Input, Modal, Table, Tooltip, message } from 'antd';
import React, { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined, EyeOutlined,DownloadOutlined} from "@ant-design/icons";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import './Movie.css'
import type { ColumnType } from 'antd/es/table';
import { MoviesInterface } from '../../../interface/fook';
import { DeleteMovieByID, ListMovies } from '../../../service/fook';

const Search = Input.Search;

export default function Movies() {
  const columns: ColumnType<MoviesInterface>[] = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: 1,
      width: 68,
      align:"center"
    },
    {
      title: "รูป",
      dataIndex: "Image",
      key: 2,
      align:"center",
      render: (text, record, index) => (
        <img src={record.Image} width="50%"/>
      )
    },
    {
      title: "ชื่อเรื่อง",
      dataIndex: "Title",
      key: 3,
      align:"center",
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "เรื่องย่อ",
      dataIndex: "Description",
      key: 4,
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "ความยาว(min)",
      dataIndex: "Duration",
      key: 5,
      align:"center",
    },
    {
      title: "วันที่ออกฉาย",
      dataIndex: "ReleaseDate",
      key: 6,
      align:"center",
      render: (text, record, index) => (
        <span>{moment(text).format('YYYY-MM-DD')}</span>
      ),
    },
    {
      title: "ผู้กำกับ",
      dataIndex: "Director",
      key: 7,
      align:"center",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "นักแสดง",
      dataIndex: "Cast",
      key: 8,
      align:"center",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "วีดีโอ",
      dataIndex: "Video",
      key: 9,
      align:"center",
      render: (text, record, index) => (
        <>
        <Button  href={record.Video} icon={<EyeOutlined/>} />
        <Button  href={record.DownloadUrl} icon={<DownloadOutlined/>}/>
        </>
      )
    },
    {
      title: "หมวดหมู่",
      dataIndex: "Categories",
      key: 10,
      align:"center",
      render: (item: any) => Object.values(item.Categories),
      
    },
    {
      title: "กลุ่มเป้าหมาย",
      dataIndex: "Target",
      key: 11,
      align:"center",
      render: (item: any) => Object.values(item.Target)
    },
    {
      title: "รูปแบบเสียง",
      dataIndex: "Soundtrack",
      key: 12,
      align:"center",
      render: (item: any) => Object.values(item.Soundtrack)
    },
    {
      title: "จัดการ",
      dataIndex: "manage",
      key: 13,
      align:"center",
      render: (text, record, index) => (
        <>
        <Button  onClick={() =>  navigate(`/moviedetailpage?ID=${record.ID}`)} shape="circle" icon={<EyeOutlined/>}/>
        <Button  onClick={() =>  navigate(`/movie/edit/${record.ID}`)} shape="circle" icon={<EditOutlined/>}/>
        <Button
            onClick={() => showModal(record)}
            shape="circle"
            icon={<DeleteOutlined/>}
            danger
          />
        </>
      ),
    },
  ];
  const showModal = (val: MoviesInterface) => {
    setModalText(
      `ต้องการลบ ${val.Title} หรือไม่`
    );
    setDeleteId(val.ID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    let res = await DeleteMovieByID(deleteId);
    if (res) {
      setOpen(false);
      message.success("ลบสำเร็จ")
      listMovies();
    } else {
      setOpen(false);
      message.error("เกิดข้อผิดพลาด")
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const [movies, setMovies] = useState<MoviesInterface[]>([]);
  const listMovies = async () => {
    let res = await ListMovies();
    if(res){
      setMovies(res);
    }
  };
  console.log(movies);

  const [size, setSize] = useState<SizeType>('large');
  const navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<String>();
  const [deleteId, setDeleteId] = useState<Number>();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

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
  
  const filteredMovies = movies.filter((movie) =>
  Object.values(movie).some((value) =>
    value !== null && value !== undefined && value.toString().toLowerCase().includes(searchText.toLowerCase())
  )
);
  useEffect(() => {
    const token = localStorage.getItem('token');
    listMovies();
    if (!token) {
      navigate('/');
  }
  },[]);

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
          <div className='admin-content-movie-header-left'>
            <div className='admin-content-payment-header-text'>
              Movie
            </div>
            <Link style={{ marginLeft: 50 }} to="/movie/create">
              <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#F5CE00' }}>
                เพิ่มข้อมูล
              </Button>
            </Link>
            <Search style={{marginLeft:20}} 
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            />
          </div>
          <div className='admin-conteet-payment-header-right'>
            <div className='admin-content-payment-header-text2'>
              Admin01
            </div>
            <UserOutlined style={{ fontSize: '30px' }} />
          </div>
        </div>
        <div className='admin-movie'>
          <Table columns={columns} dataSource={filteredMovies} scroll={{ x: '120vh', y: "65vh" }} pagination={false} size='small' ></Table>
          </div>
          <Modal
            title="ลบข้อมูล?"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <p>{modalText}</p>
        </Modal>
      </div>
    </div>
  );
}
