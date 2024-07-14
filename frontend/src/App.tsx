import './App.css';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import FirstPage from './page/firstpage';
import Login from './page/login/Login';
import Register from './page/login/register/Register';
import Adminhome from './page/fook/adminhome/Adminhome';
import Movies from './page/fook/movie/Movie';
import Homepage from './page/note/Homepage/homepage';


import MovieDetailPage from './page/note/MovieDetailpage/movieDetailpage';
// import TopRatingpage from './page/note/Topratingpage/topRatingpage';
// import Categoriespage from './page/note/Categoriespage/categoriespage';
// import Searchpage from './page/note/searchpage/searchpage';
//==========================pool =====================================
import UserAccount from './page/pool/user_account/userAccount';
import SubHistory from './page/pool/sub_history/subhistory';
import Package from './page/pool/package/package';
import AdminPayment from './page/mix/AdminPayment/adminPayment';
import UserPayment from './page/mix/UserPayment/userpayment';
import MovieCreate from './page/fook/movie/create/movieCreate';
import MovieEdit from './page/fook/movie/edit/movieEdit';
import UserEdit from './page/fook/adminhome/edit/userEdit';
import PlayMoviepage from './page/note/MovieDetailpage/playMovie';
import Historypage from './page/note/Historypage/Historypage';
import Report from './page/mix/Report/report';
import ReportTopic from './page/mix/Report/reporttopic'
import Categoriespage from './page/note/Categoriepage/Categories';
import CategoriesMoviepage from './page/note/Categoriepage/CategoriesMoviepage';
import Searchpage from './page/note/Searchpage/Searchpage';

//////////////////////////////////////////////////////////////////
import AddMovieWatchList from './page/gam/watchlist/addmoviewatchlist';
import CreateWatchlist from './page/gam/watchlist/createwatchlist';
import WatchlistPage from './page/gam/watchlist/watchlistpage';
import WatchListMovie from './page/gam/watchlist/watchlistmovie';
import DowloadMovie from './page/gam/download/downloadhistory';



function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<FirstPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/admin' element={<Adminhome/>}/>
        <Route path='/admin/movie' element={<Movies/>}/>
        <Route path='/admin/payment' element={<AdminPayment/>}/>
        <Route path='/report' element={<Report/>}/>
        <Route path='/report/create' element={<ReportTopic/>}/>

        <Route path="/homepage"  element={<Homepage/>}/>
        <Route path="/moviedetailpage"  element={<MovieDetailPage/>}/>
        <Route path='/playMovie' element={<PlayMoviepage/>}/>
        <Route path="/moviehistorypage"  element={<Historypage/>}/>
        <Route path="/categoriespage"  element={<Categoriespage/>}/>
        <Route path="/categoriespage/movies"  element={<CategoriesMoviepage/>}/>
        <Route path="/searchpage"  element={<Searchpage/>}/>



      
        <Route path="/movie/create" element={<MovieCreate/>}/>
        <Route path="/movie/edit/:id" element={<MovieEdit/>}/>
        <Route path="/movie/create" element={<MovieCreate/>}/>
        <Route path="/movie/edit/:id" element={<MovieEdit/>}/>
        <Route path='/account' element={<UserAccount/>}/>
        <Route path='/subhistory' element={<SubHistory/>}/>
        <Route path='/package' element={<Package/>}/>
        <Route path='/payment' element={<UserPayment/>}/>
        <Route path='/user/edit/:id' element={<UserEdit/>}/>

        <Route path='/watchlistpage' element={<WatchlistPage/>}/>
        <Route path='/createwatchlist' element={<CreateWatchlist/>}/>
        <Route path='/addmoviewatchlist' element={<AddMovieWatchList/>}/>
        <Route path='/watchlists/movies/:id' element={<WatchListMovie/>}/>
        <Route path='/downloads' element={<DowloadMovie/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;