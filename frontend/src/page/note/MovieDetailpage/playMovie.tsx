import React,{ useState,useEffect, } from 'react';
import { useLocation,useNavigate} from 'react-router-dom';
import { MoviesInterface } from '../../../interface/fook';
import { GetMovieByIdForUser } from '../../../service/note';
import './playmoviepage.css';

export default function PlayMoviepage(){
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const movieID = searchParams.get('ID');
    const [movie, setMovie] = useState<MoviesInterface>();
    const navigate = useNavigate();
  
    const token = localStorage.getItem('token');
    useEffect(() => {
      if (!token) {
        navigate('/register');
      }
    }, [token, navigate]);

    const getData = async () => {
        let res = await GetMovieByIdForUser(Number(movieID));
        if (res){
        console.log(res)
        setMovie(res);
        } 
    } 
    useEffect(() => {
        getData();
        console.log("UI",movie)
      }, []);  


    return (
        <div className='PlayMoviepage'>
        <div className='bg'>
        <iframe className='iframe' src={movie?.Video} title="YouTube video player" allow="accelerometer; autoplay;"></iframe>
            
        </div>
                
        </div>
    );
}