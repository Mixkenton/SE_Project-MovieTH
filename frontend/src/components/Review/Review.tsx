import React,{useEffect} from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import './style.css'; // Import your styles
import { CommentOutlined,} from '@ant-design/icons';
import { Tooltip} from 'antd';
import Circle from '../circle/circle';

const Review = () =>{

    return(
        <Tooltip title='การรีวิว' color='#565656' >
        <div style={{width:'55px',height:'55px',justifyContent:'center'}}>
                <CommentOutlined className='review-circle'/>
                <div className='review-circle-frame'><Circle/></div>        
        </div>
        </Tooltip>
    );

};
export default Review;