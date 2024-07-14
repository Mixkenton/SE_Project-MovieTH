import React,{ useState,useEffect, } from 'react';
import { Link, useLocation, useNavigate,} from 'react-router-dom';
import { Card,Empty,Image } from 'antd';
import {  MoviesInterface } from '../../../interface/fook';
import { GetMoviesByCateId } from '../../../service/note';
import './Categoriespage.css';
import Navbar from '../../../components/navbar';

export default function CategoriesMoviepage(){
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const cateID = searchParams.get('ID');
    const [movies, setMovies] = useState<MoviesInterface[]>([]);
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
    const GetMovies = async () => {
    let res = await GetMoviesByCateId(Number(cateID));
    if (res){
        setMovies(res);
        console.log(res);   
    };
    }   
    GetMovies();
    
    }, [cateID]);

    
    const handleScrollLeft = () => {
    const element = document.querySelector('.show-cate-content');
    if (element) {
        element.scrollLeft -= 200; // ปรับตามความต้องการ
    }
    };

    const handleScrollRight = () => {
    const element = document.querySelector('.show-cate-content');
    if (element) {
        element.scrollLeft += 200; // ปรับตามความต้องการ
    }
    };

    

    return (
    <div className='CategoriesMoviespage'>
        <div className='cate-bg'>
        <div className='cate-nav'><Navbar /></div>
        <h2 className='cate-text'>หมวดหมู่</h2>
        
        {movies.length === 0 ? (<Empty className='empty' description={false}>ติดตามชมภาพยนตร์ในหมวดหมู่นี้ได้เร็ว ๆ นี้</Empty>) : 
                (   <div className='show-cate-content'> 
                        <div className='bt-area3'>
                            <button className='scroll-button' onClick={handleScrollLeft}>{'<'}</button>
                            <button className='scroll-button2' onClick={handleScrollRight}>{'>'}</button>
                        </div>
                        {movies.map((MoviesItem) => (
                        <Card
                            className='cate-card'
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