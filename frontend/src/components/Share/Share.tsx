import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import './style.css'; // Import your styles
import { ShareAltOutlined,} from '@ant-design/icons';
import { Tooltip} from 'antd';
import Circle from '../circle/circle';

const Share = () =>{
    return(
        <Tooltip title='แบ่งปัน' color='#565656' >
        <div style={{width:'55px',height:'55px',justifyContent:'center'}}>
            <ShareAltOutlined className='share-circle'/>
            <div className='share-circle-frame'><Circle/></div>
        
        </div>
        </Tooltip>
    );

};
export default Share;