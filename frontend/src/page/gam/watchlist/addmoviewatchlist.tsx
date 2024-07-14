import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { message } from 'antd';
import './addmoviewatchlist.css';
import { GetWatchlistByUserID, AddMovieToWatchlist, GetMoviesInWatchlist } from '../../../service/gam';
import { WatchListInterface, WatchListMovieInterface } from '../../../interface/gam';

export default function AddMovieWatchList() {
  const location = useLocation();
  const navigate = useNavigate();
  const userID = localStorage.getItem('UserID');
  const queryParams = new URLSearchParams(location.search);
  const movieID = queryParams.get('movieID');
  const [watchlistID, setWatchlistID] = useState<WatchListInterface[] | null>(null);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredWatchlists, setFilteredWatchlists] = useState<WatchListInterface[] | null>(null);
  const [watchlistmovieData, setWatchlistMovies] = useState<WatchListMovieInterface[] | null>(null);

  const getWatchlistByUserID = async () => {
    try {
      let res = await GetWatchlistByUserID(Number(userID));
      console.log('Response from GetWatchlistByUserID:', res);
      if (res && res.length > 0) {
        setWatchlistID(res);
      } else {
        console.log('No watchlists found for user ID:', userID);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const handleCancelClick = () => {
    navigate(-1);
  };
  

  const handleCheckboxClick = async (watchlist: WatchListInterface) => {
    setSelectedWatchlistId(watchlist.ID || undefined);
    console.log(`Selected watchlist ID: ${watchlist.ID}`);
    GetMoviesInWatchlist(Number(watchlist.ID))
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredWatchlists(watchlistID);
    } else {
      const filteredList = watchlistID?.filter(watchlist =>
        watchlist.Name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
      setFilteredWatchlists(filteredList);
    }
  };

  const handleSearchReset = () => {
    setSearchTerm('');
    setFilteredWatchlists(watchlistID);
  };

  useEffect(() => {
    getWatchlistByUserID();
  }, [userID]);

  useEffect(() => {
    setFilteredWatchlists(watchlistID);
  }, [watchlistID]);
  
  const handleAddMovieToWatchlist = async () => {
    try {
      if (selectedWatchlistId && movieID) {
        const isMovieInWatchlist = watchlistmovieData?.some(
          (watchlist) => watchlist.WatchlistID === selectedWatchlistId && watchlist.MovieID === parseInt(movieID)
        );
  
        if (isMovieInWatchlist) {
          console.log('Movie already exists in the watchlist');
        } else {
          const response = await AddMovieToWatchlist({
            WatchlistID: selectedWatchlistId,
            MovieID: parseInt(movieID),
          });
  
          if (response.success) {
            message.success('เพิ่มเข้ารายการสำเร็จ')
            console.log('Movie added to watchlist successfully');
            navigate(-1);
          } else {
            console.error(response.error || 'Failed to add movie to watchlist');
            message.error("ไม่สามารถเพิ่มรายการได้")
          }
        }
      } else {
        console.error('Invalid watchlist ID or movie ID');
      }
    } catch (error) {
      message.error("ไม่สามารถเพิ่มรายการได้")
      console.error('Error adding movie to watchlist:', error);
    }
  };
  

  return (
    <div className="bodyaddmoviewatchlist">
      <div className="containeraddmoviewatchlist">
        <div className="topaddmoviewatchlist">
          <div className="raise">
            <div className="canclebottonaddmovie" onClick={handleCancelClick}>
              ยกเลิก
            </div>
          </div>
          <div className="raise">
            <div className="createbottonaddmovie" onClick={handleAddMovieToWatchlist}>
              เพิ่ม
            </div>
          </div>
        </div>
        <div className="midpartaddmoviewatchlist">
          <div className="addmoviewatclisttext-style">เพิ่มเข้ารายการ</div>
          <div className="raise">
            <RouterLink to="/createwatchlist" style={{ color: 'transparent' }}>
              <div className="addmoviewatclistbotton-style">รายการใหม่</div>
            </RouterLink>
          </div>
          <input
            className="search__input_addmoviewatclist"
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchOutlined className="search__icon" onClick={handleSearch} />
          <div className="bottonallwatchlist" onClick={handleSearchReset}>
            all
          </div>
        </div>
        <div className="lineaddwatchlist"></div>
        <div className="lastpartnamemoviewatchlist">
          {filteredWatchlists && filteredWatchlists.length > 0 ? (
            filteredWatchlists.map((watchlist) => (
              <div key={watchlist.ID} className="watchlist-item">
                <label>
                  <div
                    className={`custom-checkbox ${selectedWatchlistId === watchlist.ID ? 'checked' : ''}`}
                    onClick={() => handleCheckboxClick(watchlist)}
                  ></div>
                  {watchlist.Name}
                </label>
              </div>
            ))
          ) : (
            <label className="no-watchlists">No watchlists available</label>
          )}
        </div>
      </div>
    </div>
  );
}