import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, useParams } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Modal, Input, Button, message} from 'antd';
import './watchlistpage.css';
import Navbar from '../../../components/navbar';
import { DeleteWatchlist } from '../../../service/gam';
import { UpdateWatchlist } from '../../../service/gam';
import { GetWatchlist, GetCategories_Watchlist, GetColor,GetWatchlistByUserID, } from '../../../service/gam';
import { WatchListInterface, CategoriesWatchlistInterface, ColorInterface,WatchListMovieInterface } from '../../../interface/gam';

export default function WatchlistPage() {
  const userID = localStorage.getItem('UserID');
  const [watchlistData, setWatchlistData] = useState<WatchListInterface[] | null>(null);
  const [categories, setCategories] = useState<CategoriesWatchlistInterface[] | null>(null);
  const [colors, setColors] = useState<ColorInterface[] | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categorieswatchlist, setCategoriesWatchlist] = useState<CategoriesWatchlistInterface[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<number | undefined>(undefined);
  const [visibleDropdownId, setVisibleDropdownId] = useState<number | null>(null);
  const [updatedColorId, setUpdatedColorId] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverededit, setIsHoverededit] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [watchlistID, setWatchlistID] = useState<WatchListInterface[] | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingWatchlistId, setDeletingWatchlistId] = useState<number | null>(null);


  const getWatchlistByUserID = async () => {
    try {
      let res = await GetWatchlistByUserID(Number(userID));
      console.log('Response from GetWatchlistByUserID:', res);

      if (res && res.length > 0) {
        setWatchlistID(res);

        const { Name, CategoriesWatchlistID, ColorID } = res[0];

        console.log('Watchlist Name:', Name);
        console.log('CategoriesWatchlistID:', CategoriesWatchlistID);
        console.log('ColorID:', ColorID);

      } else {
        console.log('No watchlists found for user ID:', userID);
        setWatchlistID(null);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  useEffect(() => {
    getWatchlistByUserID();
    fetchData();
  }, [userID]);

  const filteredWatchlists = watchlistData
    ? watchlistData.filter((watchlist) => watchlist.UserID === Number(userID))
    : [];

  const openEditModal = (watchlistId: number | undefined) => {
    setVisibleDropdownId(null);
    setSelectedWatchlistId(watchlistId);
    setEditModalVisible(true);
    setVisible(true);
    const watchlist = watchlistData?.find((w) => w.ID === watchlistId);
    setSelectedCategoryId(watchlist?.CategoriesWatchlistID || null);
  };


  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedWatchlistId(undefined);
    setInputValue('');
    setSelectedCategoryId(null);
    setSelectedColorId(null);
  };

  useEffect(() => {
    const fetchCategoriesWatchlist = async () => {
      try {
        const categorieswatchlistData = await GetCategories_Watchlist();
        console.log("Categories Data from API:", categorieswatchlistData);

        if (categorieswatchlistData && categorieswatchlistData.length > 0) {
          setCategoriesWatchlist(categorieswatchlistData);
        } else {
          console.log("No categories data available.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoriesWatchlist();
  }, []);

  const fetchData = async () => {
    try {
      const watchlistData = await GetWatchlist();
      setWatchlistData(watchlistData);

      const categoriesData = await GetCategories_Watchlist();
      setCategories(categoriesData);

      const colorsData = await GetColor();
      setColors(colorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleColorButtonClick = (color: ColorInterface) => {
    setSelectedColorId(color.ID || null);
    setUpdatedColorId(color.ID || null);
    console.log(`Selected color ID: ${color.ID}`);
  };


  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryID = parseInt(event.target.value) || 0;
    setSelectedCategoryId(selectedCategoryID);
    console.log(`Selected category ID: ${selectedCategoryID}`);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length <= 20) {
      setInputValue(value);
      setShowErrorModal(false);
    } else {
      setShowErrorModal(true);
    }
    console.log(`Input value: ${value}`);
  };


  const onCancel = () => {
    setVisible(false);
  };

  const getCategoryById = (categoryId: number) => {
    return categories?.find((category) => category.ID === categoryId);
  };

  const getColorById = (colorId: number | undefined) => {
    return colorId !== undefined ? colors?.find((color) => color.ID === colorId) : null;
  };

  useEffect(() => {
    getWatchlist();
    fetchData();
  }, []);

  const getWatchlist = async () => {
    try {
      const watchlistData = await GetWatchlist();
      setWatchlistData(watchlistData);

      const categoriesData = await GetCategories_Watchlist();
      setCategories(categoriesData);

      const colorsData = await GetColor();
      setColors(colorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateWatchlist = async () => {
    try {
      if (selectedWatchlistId !== undefined) {
        const watchlistToUpdate = watchlistData?.find((w) => w.ID === selectedWatchlistId);

        if (watchlistToUpdate) {
          const updatedWatchlist = {
            ID: selectedWatchlistId,
            UserID: Number(userID),
            Name: inputValue || watchlistToUpdate.Name,
            ColorID: selectedColorId || watchlistToUpdate.ColorID,
            CategoriesWatchlistID: selectedCategoryId || watchlistToUpdate.CategoriesWatchlistID,
          };

          const result = await UpdateWatchlist(selectedWatchlistId, updatedWatchlist);

          if (result.success) {
            message.success('แก้ไขสำเร็จ');
            console.log('Watchlist updated successfully!');
            closeEditModal();
          } else {
            console.error('Error updating watchlist. Error:', result.error || 'Update failed');
          }

          GetWatchlistByUserID(Number(userID));
        }
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
    fetchData();
    setVisible(false);
  };

  const handleDeleteWatchlist = async (watchlist: WatchListInterface) => {
    try {
      if (!watchlist || !watchlist.ID || isNaN(watchlist.ID)) {
        console.error("Invalid watchlist data:", watchlist);
        return;
      }

      const result = await DeleteWatchlist(watchlist.ID);

      if (result) {
        message.success('ลบสำเร็จ');
        console.log('Watchlist deleted successfully!', result);
      } else {
        message.error('ลบไม่สำเร็จ');
        console.error('Error deleting watchlist.');
      }
    } catch (error) {
      console.error('Error deleting watchlist:', error);
    }
    GetWatchlistByUserID(Number(userID));
    fetchData();
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deletingWatchlistId !== null) {
        const watchlistToDelete = watchlistData?.find(watchlist => watchlist.ID === deletingWatchlistId);
        if (watchlistToDelete) {
          await handleDeleteWatchlist(watchlistToDelete);
          setShowDeleteConfirmModal(false);
          setDeletingWatchlistId(null);
        }
      }
    } catch (error) {
      console.error('Error handling delete confirmation:', error);
    }
  };

  const handleViewAllMoviesClick = (watchlistId: number) => {
    console.log('View all movies clicked for Watchlist ID:', watchlistId);
    localStorage.setItem('WatchlistId',String(watchlistId))
  };

  return (
    <div>
      <header style={{ backgroundColor: 'black' }}><Navbar /></header>
      <section className='List-section'>
        <div className="listtext-style"> รายการของฉัน </div>
      </section>
      <section className='List-section'>
        <div className="bodyliststyle">
          {filteredWatchlists.map((watchlist) => (
            <div key={watchlist.ID} className="containerliststyle" style={{ backgroundColor: getColorById(watchlist.ColorID)?.Color }}>
              <div className="topwatchlist">
                <div className="description-box">
                  <div className="text">{watchlist.Name}</div>
                  <div className="text">
                    {watchlist.CategoriesWatchlistID && (
                      <span>
                        {getCategoryById(watchlist.CategoriesWatchlistID)?.CategoriesWatchlist}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/watchlists/movies/${watchlist.ID}`}
                    className="text"
                    onClick={() => handleViewAllMoviesClick(Number(watchlist.ID))}
                  >
                    ดูภาพยนตร์ทั้งหมด
                  </Link>
                </div>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="delete"
                        onClick={() => {
                          setDeletingWatchlistId(Number(watchlist.ID));
                          setShowDeleteConfirmModal(true);
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ color: isHovered ? 'red' : 'inherit' }}
                      >
                        ลบ
                      </Menu.Item>
                      <Menu.Item
                        key="edit"
                        onClick={() => openEditModal(watchlist.ID)}
                        onMouseEnter={() => setIsHoverededit(true)}
                        onMouseLeave={() => setIsHoverededit(false)}
                        style={{ color: isHoverededit ? 'red' : 'inherit'}}
                      >
                        แก้ไข
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <MoreOutlined style={{ fontSize: '24px', color: 'black',marginRight: '10px', cursor: 'pointer' }} />
                  </a>
                </Dropdown>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className='footer-layer'></section>
      <Modal
        title="ยืนยันการลบ"
        visible={showDeleteConfirmModal}
        onOk={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirmModal(false)}
        okText="ลบ"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
      </Modal>
      <Modal
        title="Update"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleUpdateWatchlist}>
            Update
          </Button>
        ]}
      >
        <Input
          placeholder={watchlistData && watchlistData.find(w => w.ID === selectedWatchlistId)?.Name || 'เปลี่ยนชื่อ'}
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="selectupdatecategorieswatchlist">
          <select
            className="selectupdatestyle"
            onChange={handleCategoryChange}
            value={selectedCategoryId !== null ? selectedCategoryId : ''}
          >
            <option value='' disabled></option>
            {categorieswatchlist.map((category) => (
              <option
                key={category.ID}
                className="optionupdatestyle"
                value={category.ID}
              >
                {category.CategoriesWatchlist}
              </option>
            ))}
          </select>
        </div>
        <div className="theme-updatebuttons-container">
          {colors && colors.map((color) => (
            <button
              key={color.ID}
              className='theme-updatebottons'
              style={{ backgroundColor: color.Color }}
              onClick={() => handleColorButtonClick(color)}
            >
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
