import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // If you're using React Router for navigation
import './style.css'; // Import your styles
import { SearchOutlined,UserOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import Cookies from 'js-cookie';

const handleLogout = () => {
  // Clear cookies and local storage
  Cookies.remove('UserID');
  localStorage.removeItem('UserID');
  localStorage.removeItem('token');
};
const menu = (
    <Menu className="drop-down">
      <Menu.Item key="profile">
        <Link to="/account"><UserOutlined/> Profile</Link>
      </Menu.Item>
      <Menu.Item key="report">
        <Link to="/report"><ExclamationCircleOutlined /> Report</Link>
      </Menu.Item>
      <Menu.Item key="logout" danger onClick={handleLogout}>
      <Link to="/"><CloseCircleOutlined /> Logout</Link>
      </Menu.Item>
    </Menu>
  );

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/homepage"><img src='https://i.imgur.com/IwtPOMe.png' alt="Logo" style={{ width: '90px', height: 'auto',maxHeight:'50px',marginLeft:'3rem',marginTop:'0.4rem'}}/></Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/homepage">หน้าแรก</Link>
        </li>
        {/* <li>
          <Link to="/topratingpage">เรทติ้งสูงสุด</Link>
        </li> */}
        <li>
          <Link to="/categoriespage">หมวดหมู่</Link>
        </li>
        <li>
          <Link to="/watchlistpage">รายการของฉัน</Link>
        </li>
        <div className="search-icon">
          <Link to="/searchpage"><SearchOutlined style={{fontSize:'20px',color:'#fff'}}/></Link>
        </div>
        </ul>
        <div className="profile-icon">
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <a href="#" className="ant-dropdown-link">
            <UserOutlined style={{ fontSize: '25px', color: '#fff' }} />
          </a>
        </Dropdown>
      </div>
      
    </nav>
  );
};

export default Navbar;