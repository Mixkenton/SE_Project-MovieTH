import React,{ useState,useEffect, } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { PlayCircleFilled,ExclamationCircleFilled} from '@ant-design/icons';
import { Tooltip,message,Select,Form,Modal,Input, Card,} from 'antd';
import Navbar from '../../../components/navbar';
import AddMyList from '../../../components/AddMyList/addmylist';
import Download from '../../../components/Download/Download'; 
import Review from '../../../components/Review/Review';
import Share from '../../../components/Share/Share';
import './movieDetailpage.css';
import { ReviewInterface,GenreInterface,RatingInterface, HistoryInterface, } from '../../../interface/note';
import { MoviesInterface } from '../../../interface/fook';
import { GetMovieByIdForUser } from '../../../service/note';
import { GetReviewsByUserID,CreateReview,DeleteReview,GetReviews,ListGenre,ListRating,UpdateReview,CreateHistory } from '../../../service/note';
import Cookies from 'js-cookie'; //npm install js-cookie
import { GetUserByID } from '../../../service/mix';
import { UserInterface, } from '../../../interface/login';
import { CreateDownload ,GetPackageByUserID} from '../../../service/gam';


import { FacebookShareButton,} from 'react-share';


export default function MovieDetailPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const movieID = searchParams.get('ID');
  const userID = localStorage.getItem('UserID');
  const [messageApi, contextHolder] = message.useMessage();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState<GenreInterface[]>([]);
  const [rating, setRating] = useState<RatingInterface[]>([]);
  const [review, setReviews] = useState<ReviewInterface[]>([]);
  // const [user, setUser] = useState<UserInterface>();
  // const [movie2, setMovie2] = useState<UserInterface>();

  const [reviewID, setReviewID] = useState<ReviewInterface>();

  const [reviewText, setReviewText] = useState('');
  const [movie, setMovies] = useState<MoviesInterface[]>([]);
  const { confirm } = Modal;
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/register');
    }
  }, [token, navigate]);

  const showModal = () => {
    confirm({
      title: 'ยืนยันการลบรีวิว',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'ยืนยัน',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() { 
        handleOk();
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const handleOk = async () => {
    let res = await DeleteReview(Number(userID),Number(movieID));
    if (res) {
      messageApi.open({
        type: "success",
        content: "ลบรีวิวแล้ว",
      
      });
    setTimeout(() => {
      // Reload the page after the delay
      window.location.reload();
    }, 500);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
  };
  const showModalEdit = () => {
    setOpen(true);
  };
  const handleOkEdit = () => {
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };
  const handleCancelEdit = () => {
    setOpen(false);
  };

  const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setReviewText(newText);
  };

  const getGenres = async () => {
    let res = await ListGenre();
    if (res) {
      setGenres(res);
    }
  };

  const getRating = async () => {
    let res = await ListRating();
    if (res) {
      setRating(res);
    }
  };

  const getReview = async () => {
    let res = await GetReviews(Number(movieID));
    if (res){
      setReviews(res);
    }   
  };

  // const getUser = async () => {
  //   let res = await GetUserByID(Number(userID));
  //   if (res){
  //     setUser(res);
  //   }   
  // };

  // const getMovie = async () => {
  //   let res = await GetMovieByIdForUser(Number(movieID));
  //   if (res){
  //     setMovie2(res);
  //   }   
  // };

  const getData = async () => {
    let res = await GetMovieByIdForUser(Number(movieID));
    if (res){
      console.log(res)
      setMovies([res]);
      
    } 

  };

const getReviewByUser = async () => {
    let res = await GetReviewsByUserID(Number(userID),Number(movieID));
    if (res){
      setReviewID(res);
    }   
  };


  const isCurrentUserOwner = (userId?: number) => {
    // ตรวจสอบว่ามีผู้ใช้เข้าสู่ระบบหรือไม่
    if (!userID) {
      return false;
    }
    
    // แปลง userID เป็น number และเปรียบเทียบ
    return userId !== undefined && userId === Number(userID);
  };

  //History
  const saveHistory = async (values: HistoryInterface) =>{
    // values.Movie = movie2;
    // values.User = user;
    values.MovieID = Number(movieID);
    values.UserID = Number(userID);
    console.log(values)
    let result = await CreateHistory(values);
    if (!result.status) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด",
      });
    }
    else{
      setTimeout(() => {
        navigate(`/playMovie?ID=${movieID}`);
      }, 500);
    }
  };

  //Review
  const onFinish = async (values: ReviewInterface) => {
    // values.Movie = movie2;
    // values.User = user;
    values.MovieID = Number(movieID);
    values.UserID = Number(userID);
    if (!open){ 
    
      let res = await CreateReview(values);
      if (res.status) {
        messageApi.open({
          type: "success",
          content: res.message,
          duration:10,
        });
    
        setTimeout(() => {
          //Reload the page after the delay
          window.location.reload();
        }, 10000);
      } 
      else {
        // Check if the message property exists and show the message
        if (res.message) {
          messageApi.open({
            type: "error",
            content: res.message,
            duration: 10,

          });
        } else {
          // If no specific message is available, show a generic error message
          messageApi.open({
            type: "error",
            content: "ขออภัย เกิดข้อผิดพลาดในการรีวิว",
          });
        }
      }
    }
    else{
      values.ID = reviewID?.ID;
      values.DateTime = new Date();
      let res = await UpdateReview(values);
      if (res.status) {
        messageApi.open({
          type: "success",
          content: "แก้ไขสำเร็จ!",
        });
    
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } 
      else {
        // Check if the message property exists and show the message
        if (res.message) {
          messageApi.open({
            type: "error",
            content: res.message,
          });
        } else {
          // If no specific message is available, show a generic error message
          messageApi.open({
            type: "error",
            content: "เกิดข้อผิดพลาด",
          });
        }
      }
    }
  
    console.log(values);
  };

  useEffect(() => { 
    // getMovie(); 
    // getUser();
    getGenres();
    getRating();
    getReview();
    getData();
    getReviewByUser();
    console.log("all review",[review]);
    console.log(movie)
  }, []);
  

  useEffect(() => {
    // Scroll to the saved position when the component mounts or when scrollPosition changes
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  // Updated handleReviewClick function for smooth scrolling
  const handleReviewClick = () => {
    const startScroll = window.scrollY;
    setScrollPosition(startScroll);

    const duration = 800;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);

      const newScroll = startScroll + (window.innerHeight * 0.99 - startScroll) * easedProgress;

      window.scrollTo(0, newScroll);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };
  const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const handleDownloadClick = async () => {
    try {
        const packageID = await GetPackageByUserID(Number(userID));

        if (packageID !== 1) {
            const selectedMovie = movie.find(item => item.ID === Number(movieID));

            if (selectedMovie && selectedMovie.DownloadUrl) {
                const downloadData = {
                    DateTime: new Date(),
                    UserID: Number(userID),
                    MovieID: Number(movieID),
                };

                const result = await CreateDownload(downloadData);

                if (result.success) {
                    message.success('ดาวน์โหลดสำเร็จ');
                    console.log('Download created successfully:', result.data);
                    // เปิด download URL ใน tab ใหม่หลังจาก log สำเร็จ
                    window.open(selectedMovie.DownloadUrl, '_blank');
                } else {
                    message.error('ไม่สามารถดาวน์โหลดได้');
                    console.error('Failed to create download:', result.error || 'Unknown error');
                }
            } else {
                // ถ้าไม่พบหนังหรือ URL สำหรับดาวน์โหลด
                message.error('ไม่พบหนังหรือ URL สำหรับดาวน์โหลด');
            }
        } else {
            message.error('ไม่สามารถดาวน์โหลดได้ กรุณาเปลี่ยน package');
            console.log('Package ID is 1. Not creating download.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <div>
      {contextHolder}
      
        <div className="box">
          <div className='moviedetail-nav'><Navbar/></div>
        {movie.map((movie) => (
          <div className='movie-detail' key={movie.ID}>
            <div className='movie-detail-left'>
              <div className="blur">
                {<img className='poster-blur' src={movie.Image} alt="Movie Poster" />}
                <div className='blur2'>  
                  <div className="imgporter">
                    {<img className='poster' src={movie.Image} alt="Movie Poster" />}
                  </div>

                </div>
              </div>
            
            </div>
            <div className='movie-detail-right'>
              <div className='detail-text'>
                <h1>{movie.Title}</h1>
                <p>{movie.Duration} นาที</p>
                <p><b>หมวดหมู่:</b> {movie.Categories?.Categories}</p>
                <p><b>เรื่องย่อ:</b> {movie.Description}</p>
                <p><b>ผู้กำกับ:</b> {movie.Director}</p>
                <p><b>นักแสดงนำ: </b>{movie.Cast}</p>
              
              <div className='detail-menu'>
                <Form onFinish={saveHistory}>
                <button style={{position:'absolute',top:'0px',border:'none',background:'transparent',cursor:'pointer'}} type='submit' ><Tooltip title='เล่น' color='#565656'><PlayCircleFilled style={{color:'white',fontSize:55}} /></Tooltip></button>
                </Form>
                <button
                    style={{ position: 'absolute', left: '70px', top: '0px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    onClick={() => navigate(`/addmoviewatchlist?movieID=${movieID}`)}
                  >
                    <AddMyList />
                </button>
                <button style={{ position: 'absolute', left: '140px', top: '0px', border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={handleDownloadClick}><Download /></button>
                <button style={{position:'absolute',left:'210px',top:'0px',border:'none',background:'transparent',cursor:'pointer'}} onClick={handleReviewClick}><Review/></button>
                <FacebookShareButton url={String(movie.Video)} hashtag={"#Team03_Movie!"}>
                <div style={{position:'absolute',left:'280px',top:'0px',border:'none',background:'transparent',cursor:'pointer'}}><Share/></div>
                </FacebookShareButton>
              </div>
            </div>
              
          </div>
        </div> ))}
        
        <div className='review-area'>
          <div className='review-topic'><h3><b>การรีวิว</b></h3></div>
            <Form className='review-form' onFinish={onFinish}>
              <div className='select-area'>
                <div className='select-1'>
                  <div className='select-genre'> 
                    <Form.Item name="GenreID"  >{/*rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่!' }]}*/}
                      <Select allowClear style={{width:150,}} placeholder='หมวดหมู่การรีวิว'>
                        {genres.map((item) => (
                          <option value={item.ID} key={item.Name}>{item.Name}</option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className='select-2'>
                  <div className='select-rating'>
                    <Form.Item name="RatingID"  >{/*rules={[{ required: true, message: 'กรุณาเลือกคะแนน!' }]}*/}
                      <Select allowClear style={{width:120,}} placeholder='ให้คะแนน 1-5' >
                        {rating.map((item) => (
                          <option value={item.ID} key={item.RatingValue}>{item.RatingValue}</option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                 
                </div> 
                <div className='rating-meaning'><p>(1=แย่มาก , 2=แย่ , 3=พอใช้ , 4=ดี , 5=ดีมาก)</p></div>
              </div>
              
              <div className="review-info">
                <Form.Item name="ReviewText">
                  <div className='input'>
                    <input className='input2' 
                           type='text' 
                           placeholder='คุณคิดอย่างไรกับภาพยนตร์เรื่องนี้ ?' 
                          //  maxLength={100} 
                           value={reviewText}
                           onChange={handleReviewChange}/>
                  <p style={{color:'white'}}>จำนวนตัวอักษร: {reviewText.length}/100</p>  
                  </div>
                </Form.Item >
              </div>
              <Form.Item name="MovieID"></Form.Item>
              <Form.Item name="UserID"></Form.Item>
              <button className='submit-review-btn' type='submit'><b>ส่งรีวิว</b></button>
            </Form>

          <div className='show-review'>
            <div className='show-review-frame'>

              {review.map((reviewItem) => (
                  <Card className='show-review-all' >
                    <p key={reviewItem.ID}>
                      <div className='review-username'><b>{reviewItem.User?.Username}</b></div>
                      <div className='review-genre'>{reviewItem.DateTime ? new Date(reviewItem.DateTime).toLocaleString() : 'N/A'}|<b> หมวดหมู่:</b> {reviewItem.Genre?.Name} <b>คะแนน:</b> {reviewItem.Rating?.RatingValue} </div>
                      <div className='review-text'>{reviewItem.ReviewText}<br></br>
                        {isCurrentUserOwner(reviewItem.User?.ID) &&  
                        (<div className='edit-button'><button onClick={showModalEdit}>แก้ไข</button><button onClick={showModal}>ลบ</button>
                              <Modal
                                open={open}
                                title="แก้ไขรีวิว"
                                onOk={handleOkEdit}
                                onCancel={handleCancelEdit}
                                footer={[
                                ]}
                              >
                                <Form 
                                style={{display:'inline-flex',
                                  flexDirection:'row'}}
                                onFinish={onFinish}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                  <Form.Item name="GenreID" rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่!' }]} >
                                    <Select allowClear style={{width:150,}} placeholder='หมวดหมู่การรีวิว'>
                                      {genres.map((item) => (
                                        <option value={item.ID} key={item.Name}>{item.Name}</option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                  <Form.Item name="RatingID" rules={[{ required: true, message: 'กรุณาเลือกคะแนน!' }]} >
                                    <Select allowClear style={{width:120,}} placeholder='ให้คะแนน 1-5' >
                                      {rating.map((item) => (
                                        <option value={item.ID} key={item.RatingValue}>{item.RatingValue}</option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                  </div>
                                  <Form.Item name="ReviewText">
                                    <Input showCount maxLength={100} style={{width:'150%'}}></Input>
                                     
                                  
                                  </Form.Item >
                                        </div>
                                        <button className='edit-ok' type='submit'><b>ส่งรีวิว</b></button>
               

                                </Form>
                                
                                
                              </Modal>
                       </div>)}
                      </div>
                    </p>
                      

                  </Card> 
              ))}    
              
            </div>
          </div>

        </div>
        
    
      </div>

    </div>

      
  );
}
