import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Modal } from 'antd';
import './watchlistmovie.css';
import { WatchListMovieInterface, WatchListInterface} from '../../../interface/gam';
import { GetMoviesInWatchlist, DeleteMovieWatchlist, GetWatchlist } from '../../../service/gam';
import { MoviesInterface } from '../../../interface/fook';
import Navbar from '../../../components/navbar';

export default function WatchListMovie() {
  const { Meta } = Card;
  const [isEditMode, setIsEditMode] = useState(false);
  const [movies, setMovies] = useState<MoviesInterface[]>([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedMovieForDeletion, setSelectedMovieForDeletion] = useState<{ watchlistId: number; movieId: number } | null>(null);
  const watchlistID = localStorage.getItem('WatchlistId');
  const [watchlistData, setWatchlistData] = useState<WatchListInterface[] | null>(null);

  const getMoviesInWatchlist = async () => {
    if (watchlistID) {
      let res = await GetMoviesInWatchlist(Number(watchlistID));
      if (res) {
        const movieData = res.map((item: WatchListMovieInterface) => item.Movie);
        setMovies(movieData);
      }
      console.log(res);
    }
  };

  useEffect(() => {
    if (watchlistID) {
      getMoviesInWatchlist();
    }
  }, [watchlistID]);

  const showDeleteModal = (watchlistId: number, movieId: number) => {
    setSelectedMovieForDeletion({ watchlistId, movieId });
    setShowDeleteConfirmModal(true);
  };

  const deleteWatchlistMovie = async () => {
    if (!selectedMovieForDeletion) return;

    const { watchlistId, movieId } = selectedMovieForDeletion;
    const success = await DeleteMovieWatchlist(watchlistId, movieId);
    if (success) {
      getMoviesInWatchlist();
      setShowDeleteConfirmModal(false);
    } else {
      console.error("Failed to delete movie from watchlist.");
    }
    setSelectedMovieForDeletion(null);
  };

  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        const watchlistData = await GetWatchlist();
        console.log('Watchlist Data:', watchlistData);
        setWatchlistData(watchlistData);
      } catch (error) {
        console.error('Error fetching watchlist data:', error);
      }
    };

    fetchWatchlistData();
  }, []);

  const filteredWatchlists = watchlistData ? watchlistData.filter(watchlist => watchlist.ID === Number(watchlistID)) : [];


  return (
    <div>
      <header style={{ backgroundColor: 'black' }}><Navbar /></header>
      <section className='list-sectionwatchlistmovie'>
        {filteredWatchlists.map((watchlist) => (
          <div className="listtext-stylewatchlistmovie">{watchlist.Name}</div>))}
        <div className="listtext-stylewatchlistmovie2" onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? 'เสร็จสิ้น' : 'แก้ไข'}
        </div>
      </section>
      <section className='list-sectionwatchlistmovie'>
        <div className='movie-card-container' style={{ marginBottom: '5%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', position: 'relative', justifyContent: 'center', alignItems: 'center', gap: '3rem', marginLeft: '5%' }}> 
          {movies.map((movie, index) => (
              <Card
                hoverable
                style={{ width: 190, height: 350, margin: 16 }}
                cover={<img alt="Movie Poster" src={movie.Image} width={190} height={260} />}
              >
              <Link to={`/moviedetailpage?ID=${encodeURIComponent(movie.ID || 'abc')}`} key={index}>
                <Meta title={movie.Title} description={`${movie.Duration} นาที`} />
              </Link>
                {isEditMode && (
                  <button
                    className="deletebuttonwatchlistmovie"
                    style={{ position: 'absolute', top: 0, right: -25, cursor: 'pointer', fontWeight: 'bold'}}
                    onClick={() => showDeleteModal(Number(watchlistID), Number(movie.ID))}
                  >
                    ลบ
                  </button>
                )}
              </Card>
          ))}
        </div>
      </section>
      <Modal
        title="ยืนยันการลบ"
        visible={showDeleteConfirmModal}
        onOk={deleteWatchlistMovie}
        onCancel={() => setShowDeleteConfirmModal(false)}
        okText="ลบ"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
      </Modal>
    </div>
  );
}
