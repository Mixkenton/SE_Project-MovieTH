import React,{ useState,useEffect, } from 'react';
import { Link, useLocation, useNavigate,} from 'react-router-dom';
import { Card } from 'antd';
import { CategoriesInterface } from '../../../interface/fook';
import { GetCategoriesForUser } from '../../../service/note';
import './Categoriespage.css';
import Navbar from '../../../components/navbar';

export default function Categoriespage(){
  const [categories, setCategories] = useState<CategoriesInterface[]>([]);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/register');
    }
  }, [token, navigate]);
  
  useEffect(() => {
    const getCategories = async () => {
      let res = await GetCategoriesForUser();
      if (res) {
        setCategories(res);
        console.log(categories)
      }
    };
  
    getCategories();

  }, []);


  return (
      <div className='categoriespage'>
        <div className='cateMenu-bg'>
          <div className='cateMenu-nav'><Navbar/></div>
          <div className='cateMenu-area'>
          {categories.map((categoriesItem) => (
            <Link to={`/categoriespage/movies?ID=${encodeURIComponent(categoriesItem.ID || 'abc')}`} key={categoriesItem.ID}>
            <Card className='cateMenu-card' key={categoriesItem.ID} style={{width:250,height:130,fontSize:24,alignItems:'center',justifyContent:'center',display:'flex'}}>
              <div className='cateMenu-text'><b>{categoriesItem.Categories}</b></div>
            </Card>
            </Link>
          ))}
          </div>

        </div>
        


      </div>
  
  );

}