import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './createwatchlist.css';
import { Button, message } from 'antd';
import { CategoriesWatchlistInterface, ColorInterface, WatchListInterface } from '../../../interface/gam';
import { GetCategories_Watchlist, GetColor } from '../../../service/gam';
import { CreateWatchlist as CreateWatchlistService } from '../../../service/gam';

export default function CreateWatchlist() {
  const userID = localStorage.getItem('UserID');
  const [categorieswatchlist, setCategoriesWatchlist] = useState<CategoriesWatchlistInterface[]>([]);
  const [colors, setColors] = useState<ColorInterface[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colorData = await GetColor();
        setColors(colorData);
      } catch (error) {
        console.error('Error fetching color data:', error);
      }
    };
    fetchData();
  }, []);

  const handleColorButtonClick = (color: ColorInterface) => {
    setSelectedColorId(color.ID || null);
    console.log(`Selected color ID: ${color.ID}`);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryID = parseInt(event.target.value);
    setSelectedCategoryId(selectedCategoryID);
    console.log(`Selected category ID: ${selectedCategoryID}`);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 20) {
      setInputValue(value);
    }else {
      message.error("ไม่สามารถสร้างรายการได้")
    }
    console.log(`Input value: ${value}`);
  };

  const handleCreateWatchlist = async () => {
    try {
      if (inputValue === null || selectedCategoryId === null || selectedColorId === null) {
        message.error("กรุณาใส่ข้อมูลทั้งหมด")
        return;
      }

      const newWatchlistData: WatchListInterface = {
        Name: inputValue,
        DateTime: new Date(),
        UserID: Number(userID),
        CategoriesWatchlistID: selectedCategoryId,
        ColorID: selectedColorId,
      };

      const response = await CreateWatchlistService(newWatchlistData);

      if (response && 'success' in response) {
        if (response.success) {
          message.success("สร้างสำเร็จ")
          console.log("Watchlist created successfully:", response.data);
          navigate(-1);
        } else {
          console.error("Failed to create watchlist:", response.error || 'Unknown error');
          message.error("ไม่สามารถใช้ชื่อนี้")
          if (response.error && response.error.message) {
            console.error("Server error:", response.error.message);
          }
        }
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error creating watchlist:", error);
      message.error("ไม่สามารถสร้างรายการได้")
    }
  };

  return (
    <div className='bodycreatewatchlist'>
      <div className='containercreatewatchlist'>
        <div className='topcreatewatclist'>
          <div className='createwatclisttext-style'>
            ชื่อรายการของคุณ
          </div>
        </div>
        <input
          className="search__input_createwatclist"
          type="text"
          placeholder=""
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="selectcategorieswatchlist">
          <select
            className="selectstyle"
            onChange={handleCategoryChange}
            value={selectedCategoryId || ''}
          >
            <option value="" disabled>เลือกหมวดหมู่</option>
            {categorieswatchlist.map((category) => (
              <option
                key={category.ID}
                className="optionstyle"
                value={category.ID}
              >
                {category.CategoriesWatchlist}
              </option>
            ))}
          </select>
        </div>
        <div className="colorswitcher">
          <div className="theme-buttons-container">
            {colors.map((color) => (
              <button
                key={color.ID}
                className='theme-bottons'
                style={{ backgroundColor: color.Color }}
                onClick={() => handleColorButtonClick(color)}
              >
              </button>
            ))}
          </div>
        </div>
        <div className="bottoncreatewatchlist">
          <div className="raise">
            <div className='canclebottoncreate' onClick={() => navigate(-1)}>ยกเลิก</div>
          </div>
          <div className="raise">
            <div className="createbotton" onClick={handleCreateWatchlist}>
              สร้าง
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}