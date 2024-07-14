import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './downloadhistory.css';
import { GetDownloadMovies,DeleteDownloadMovie } from '../../../service/gam';
import { DownloadInterface } from '../../../interface/gam';
import Navbar from '../../../components/navbar';
import { MoviesInterface } from '../../../interface/fook';
import { Card, Modal } from 'antd';

const DowloadMovie = () => {
  const userID = localStorage.getItem('UserID');
  const { Meta } = Card;
  const [isEditMode, setIsEditMode] = useState(false);
  const [movies, setMovies] = useState<MoviesInterface[]>([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedMovieForDeletion, setSelectedMovieForDeletion] = useState<{ userId: number; movieId: number } | null>(null);

  const getDownloadMovies = async () => {
    if (userID) {
      let res = await GetDownloadMovies(Number(userID));
      if (res) {
        const movieData = res.map((item: DownloadInterface) => item.Movie);
        setMovies(movieData);
      }
      console.log(res);
    }
  };

  useEffect(() => {
    if (userID) {
      getDownloadMovies();
    }
  }, [userID]);

  const showDeleteModal = (userId: number, movieId: number) => {
    setSelectedMovieForDeletion({ userId, movieId });
    setShowDeleteConfirmModal(true);
  };

  //
  const deleteDownloadMovie = async () => {
    if (!selectedMovieForDeletion) return;
    const { userId, movieId } = selectedMovieForDeletion;
    const success = await DeleteDownloadMovie(userId, movieId);
    if (success) {
        console.log("Deletion successful");
        getDownloadMovies().then(() => {
            setShowDeleteConfirmModal(false);
        });
    } else {
        console.error("Failed to delete movie from download.");
    }
};

  return (
    <div>
      <header style={{ backgroundColor: 'black' }}><Navbar /></header>
      <section className="list-sectiondownload">
        <div className="listtext-styledownload">ประวัติการดาวน์โหลด</div>
        <div className="listtext-styledownload2" onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? 'เสร็จสิ้น' : 'แก้ไข'}
        </div>
      </section>
      <section className="list-sectiondownload">
        <div className='movie-card-container' style={{ marginBottom: '5%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', position: 'relative', justifyContent: 'center', alignItems: 'center', gap: '3rem', marginLeft: '5%' }}> 
          {movies.map((movie) => (
              <Card
                hoverable
                style={{ width: 190, height: 325, margin: 16 }}
                cover={<img alt="Movie Poster" src={movie.Image} width={190} height={260} />}
              >
                <Meta title={movie.Title}/>
                {isEditMode && (
                  <button
                    className="deletebuttonwatchlistmovie"
                    style={{ position: 'absolute', top: 0, right: -25, cursor: 'pointer', fontWeight: 'bold'}}
                    onClick={() => showDeleteModal(Number(userID), Number(movie.ID))}
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
        onOk={deleteDownloadMovie}
        onCancel={() => setShowDeleteConfirmModal(false)}
        okText="ลบ"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
      </Modal>
    </div>
  );
}

export default DowloadMovie;