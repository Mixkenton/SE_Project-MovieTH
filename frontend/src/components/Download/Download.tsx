import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import './style.css'; // Import your styles
import { DownloadOutlined,} from '@ant-design/icons';
import { Tooltip} from 'antd';
import Circle from '../circle/circle';

const Download = () =>{
    return(
        <Tooltip title='ดาวน์โหลด' color='#565656' >
        <div style={{width:'55px',height:'55px',justifyContent:'center'}}>
            <DownloadOutlined className='download-circle'/>
            <div className='download-circle-frame'><Circle/></div>
        
        </div>
        </Tooltip>
    );

};
export default Download;