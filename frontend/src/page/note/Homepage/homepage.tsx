import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Link , useNavigate} from 'react-router-dom';
import { Carousel,Card  } from 'antd';
import './homepage.css';
import Navbar from '../../../components/navbar';
import { MoviesInterface } from '../../../interface/fook'; 
import { ListMoviesForUser } from '../../../service/note'; 

const { Meta } = Card;
const contentStyle: React.CSSProperties = {
    width:'100%',
    height: '480px',
    color:'white',
    backgroundColor:'rgba(0, 0, 0, 0.3)',
    position:'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background:'#141414'
    
  };

export default function Homepage(){
    const navigate = useNavigate();
    const [movies, setMovies] = useState<MoviesInterface[]>([]);
    const listMovies = async () => {
        let res = await ListMoviesForUser();
        if(res){
        setMovies(res);
        }
    };
    console.log(movies);

    const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/register');
    }
  }, [token, navigate]);
    
    useEffect(() => {
    
        listMovies();
    
    }, []);


    return(
        
        <div>
            {/* <header style={{backgroundColor:'black'}}><Navbar/></header> */}
            <section className='homepage-section'>
                <div className='home-nav' style={{zIndex:'6',position:'absolute',width:'100%'}}><Navbar/></div>
                
                <Carousel autoplay>
                    <div>
                    <div style={contentStyle}><img src='https://i.imgur.com/LKzePxU.jpg' style={{width:'1080px',height:'480px',objectFit:'cover'}}></img></div>
                    </div>
                    <div>
                    <div style={contentStyle}><img src='https://i.imgur.com/z127eo0.jpg' style={{width:'1080px',height:'480px',objectFit:'cover'}}></img></div>                    </div>
                    <div>
                    <div style={contentStyle}><img src='https://i.imgur.com/UvhHnWC.jpg' style={{width:'1080px',height:'480px',objectFit:'cover'}}></img></div>                    </div>
                    <div>
                    <div style={contentStyle}><img src='https://i.imgur.com/xDuYLGw.jpg' style={{width:'1080px',height:'480px',objectFit:'cover'}}></img></div>                    </div>
                </Carousel>
                <br/>
                <div className='movie-content-section' style={{justifyItems: 'center', alignItems: 'center'}}>
                    <div className='movie-card-container' style={{display:'flex',flexDirection:'row',flexWrap: 'wrap',position:'relative',justifyContent: 'center', alignItems: 'center',gap:'2rem'}}>
                        {movies.map((movie, index) => (
                        <Link to={`/moviedetailpage?ID=${encodeURIComponent(movie.ID || 'abc')}`} key={index}>
                            <Card
                                key={index}
                                hoverable
                                style={{ width: 190,height: 350, margin: 16,}}
                                cover={<img style={{objectFit:'cover'}} alt="Movie Poster" src={movie.Image} width={190} height={260}/>}
                            >
                                <Meta title={movie.Title} description={`${movie.Duration} นาที`} />
                            </Card>
                        </Link>
                    
                        ))}
                    </div>
                </div>
                
            </section>
            <footer className='homepage-footer' style={{background:'#121212',width:'100%',height:'7.5%',position:'absolute'}}></footer>
        </div>
        
        
    );
        

}