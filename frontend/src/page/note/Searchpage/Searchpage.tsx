import React,{ useState,useEffect, } from 'react';
import { Link, useLocation, useNavigate,} from 'react-router-dom';
import { Card,Empty,Image } from 'antd';
import { MoviesInterface } from '../../../interface/fook';
import './Searchpage.css';
import Navbar from '../../../components/navbar';
import { ListMoviesForUser } from '../../../service/note';

export default function Searchpage(){
  const [movies, setMovies] = useState<MoviesInterface[]>([]);
  const [query,setQuery] = useState("");
  const { Meta } = Card;
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/register');
    }
  }, [token, navigate]);


  const filteredMovies = movies.filter((MoviesItem) =>
        Object.values(MoviesItem).some((Title) =>
            MoviesItem.Title && MoviesItem.Title.toLowerCase().includes(query.toLowerCase())
            
        )
    );

useEffect(() => {
    console.log("UI", movies);
}, [movies]);

useEffect(() => {
const GetMovies = async () => {
let res = await ListMoviesForUser();
if (res){
    setMovies(res);
    console.log(res);   
};
}   
GetMovies();

}, []);

const handleScrollLeft = () => {
    const element = document.querySelector('.show-search-content');
    if (element) {
        element.scrollLeft -= 200; // ปรับตามความต้องการ
    }
    };

    const handleScrollRight = () => {
    const element = document.querySelector('.show-search-content');
    if (element) {
        element.scrollLeft += 200; // ปรับตามความต้องการ
    }
    };



  return (
        <div className='searchpage'>
            <div className='search-bg'>
                <div className='search-nav'><Navbar/></div>
                <div className='search-box'>
                    <input type="text" className='search-input' placeholder="ค้นหาภาพยนตร์..." value={query} onChange={(e) => setQuery(e.target.value)}/>
                </div>
               
                {filteredMovies.length === 0 ? (<Empty className='empty' description={false}>ไม่พบภาพยนตร์ที่ค้นหา</Empty>) : 
                (   <div className='show-search-content'> 
                        <div className='bt-area1'>
                            <button className='scroll-button' onClick={handleScrollLeft}>{'<'}</button>
                            <button className='scroll-button2' onClick={handleScrollRight}>{'>'}</button>
                        </div>
                        {filteredMovies.map((MoviesItem) => (
                        <Card
                            className='search-card'
                            key={MoviesItem.ID}
                            style={{ width: 200, marginBottom: 10, height: 383 }}
                            cover={<Image src={MoviesItem.Image} alt="Movie Poster" height={300} />}
                            >
                                <Link to={`/moviedetailpage?ID=${encodeURIComponent(MoviesItem.ID || 'N/A')}`} key={MoviesItem.ID}>
                                <Meta
                                    
                                    title={MoviesItem.Title}
                                    
                                    description={`${MoviesItem.Duration} นาที`}
                                />
                                </Link>
                            </Card>
                        ))}

                    </div>
                )}
                
        </div>
        
    </div>
    );
    
}

{/* {filteredMovies.length === 0 ? 
(<Empty className='empty' description={false}>ไม่พบภาพยนตร์ที่ค้นหา</Empty>) : (
<div className='show-search-content'> 
<button className='scroll-button' onClick={handleScrollLeft}><b>{'<'}</b></button>
{filteredMovies.map((MoviesItem) => (
<Card
className='search-card'
key={MoviesItem.ID}
style={{ width: 200, marginBottom: 10, height: 400 }}
cover={<Image src={MoviesItem.Image} alt="Movie Poster" height={300} />}
><Link to={`/moviedetailpage?ID=${encodeURIComponent(MoviesItem.ID || 'N/A')}`} key={MoviesItem.ID}>
<Meta
    
    title={MoviesItem.Title}
    
    description={`${MoviesItem.Duration} นาที`}
/>
</Link>

</Card>
))}
<button className='scroll-button2' onClick={handleScrollRight}><b>{'>'}</b></button>
</div>
)} */}