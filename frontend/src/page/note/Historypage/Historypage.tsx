import React,{ useState,useEffect, } from 'react';
import { Link, useLocation, useNavigate,} from 'react-router-dom';
import Navbar from '../../../components/navbar';
import { Button, Card,Image,Empty} from 'antd';
import Cookies from 'js-cookie'; //npm install js-cookie
import './Historypage.css';
import { HistoryInterface } from '../../../interface/note';
import { ListHistoryByUserID ,DeleteHistoryByID} from '../../../service/note';

export default function Historypage(){
  // const location = useLocation();
  const userID = localStorage.getItem('UserID');
  const [movies, setMovies] = useState<HistoryInterface[]>([]);
  const { Meta } = Card;
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/register');
    }
  }, [token, navigate]);


  useEffect(() => {
    console.log("UI", movies);
  }, [movies]);
  
  useEffect(() => {
    const getMoviesByUserId = async () => {
      let res = await ListHistoryByUserID(Number(userID));
      if (res) {
        console.log("Backend", res);
        setMovies(res);
      }
    };
  
    getMoviesByUserId();
  }, [userID]);

  const handleRemoveMovie = async (userID: number,movieID: number) => {
    // ทำการลบประวัติตาม movieID
    await DeleteHistoryByID(userID,movieID);

    // รีเฟรชข้อมูลหลังจากการลบ
    const updatedMovies = movies.filter((historyItem) => historyItem.MovieID !== movieID);
    setMovies(updatedMovies);
  };

  const handleScrollLeft = () => {
    const element = document.querySelector('.history-box');
    if (element) {
      element.scrollLeft -= 200; // ปรับตามความต้องการ
    }
  };

  const handleScrollRight = () => {
    const element = document.querySelector('.history-box');
    if (element) {
      element.scrollLeft += 200; // ปรับตามความต้องการ
    }
  };

  

  return (
    <div className='Historypage'>
      <div className='bg'>
        <div className='history-nav'><Navbar /></div>
        <h2 className='history-text'>ประวัติการรับชม</h2>
        
        {movies.length === 0 ? 
        (<Empty className='empty' description={false}>คุณยังไม่มีการรับชมภาพยนตร์</Empty>
        ) : (
          <div className='history-box'>
             <div className='bt-area2'>
                    <button className='scroll-button' onClick={handleScrollLeft}>{'<'}</button>
                    <button className='scroll-button2' onClick={handleScrollRight}>{'>'}</button>
              </div> 
            {movies.map((historyItem) => (
              <Card
                className='history-card'
                key={historyItem.ID}
                style={{ width: 200, marginBottom: 10, height: 450 }}
                cover={<Image src={historyItem.Movie?.Image} alt="Movie Poster" height={300} />}
              ><Link to={`/moviedetailpage?ID=${encodeURIComponent(historyItem.MovieID || 'abc')}`} key={historyItem.ID}>
                <Meta
                  
                  title={historyItem.Movie?.Title}
                  
                  description={`ดูเมื่อ: ${historyItem.DateTime ? new Date(historyItem.DateTime).toLocaleString() : 'N/A'}`}
                />
                </Link>
                <Button
                  style={{ top: '15px', left: '35%' }}
                  onClick={()=>handleRemoveMovie(Number(userID),Number(historyItem.MovieID))}
                  danger
                >
                  ลบ
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );

}

