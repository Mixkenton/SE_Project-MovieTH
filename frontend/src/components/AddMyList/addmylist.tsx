import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import './style.css'; // Import your styles
import { PlusCircleOutlined, } from '@ant-design/icons';
import { Tooltip} from 'antd';
import Circle from '../circle/circle';

const AddMyList = () =>{
    return(
        <Tooltip title='เพิ่มรายการของฉัน' color='#565656' >
        <div style={{width:'55px',height:'55px',justifyContent:'center'}}>
            <PlusCircleOutlined className='plus-circle'/>
            <div className='plus-circle-frame'><Circle/></div>
        
        </div>
        </Tooltip>
        
    );

};
export default AddMyList;