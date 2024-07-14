package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut66/team03/entity"
)

func CreateWatchlist(c *gin.Context) {
	var watchlist entity.Watchlist

	if err := c.ShouldBindJSON(&watchlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := entity.User{}
	if err := entity.DB().Where("ID = ?", watchlist.UserID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบผู้ใช้ที่ระบุ"})
		return
	}

	var categories_watchlist entity.CategoriesWatchlist
	if watchlist.CategoriesWatchlistID != nil {
		if err := entity.DB().Where("ID = ?", *watchlist.CategoriesWatchlistID).First(&categories_watchlist).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบหมวดหมู่ที่ระบุ"})
			return
		}
	}

	var color entity.Color
	if watchlist.ColorID != nil {
		if err := entity.DB().Where("ID = ?", *watchlist.ColorID).First(&color).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสีที่ระบุ"})
			return
		}
	}

	var existingWatchlist entity.Watchlist
    if err := entity.DB().Where("user_id = ? AND name = ?", watchlist.UserID, watchlist.Name).First(&existingWatchlist).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ชื่อwathclistซ้ำ"})
        return
    }

	if _, err := govalidator.ValidateStruct(watchlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newWatchlist := entity.Watchlist{
		Name:                  watchlist.Name,
		DateTime:              watchlist.DateTime,
		UserID:                watchlist.UserID,
		CategoriesWatchlistID: watchlist.CategoriesWatchlistID,
		ColorID:               watchlist.ColorID,
	}

	if err := entity.DB().Create(&newWatchlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": newWatchlist})
}

func ListWatchlist(c *gin.Context) {
	var watchlist []entity.Watchlist
	if err := entity.DB().Find(&watchlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": watchlist})
}


func GetWatchlistByUserID(c *gin.Context) {
    id := c.Param("id")
	var watchlist []entity.Watchlist
    if err := entity.DB().Where("user_id = ?", id).Find(&watchlist).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"watchlist": watchlist})
}

func UpdateWatchlist(c *gin.Context) {
	id := c.Param("id")

	var watchlist entity.Watchlist
	if err := entity.DB().First(&watchlist, id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลรายการที่ระบุ"})
		return
	}

	if _, err := govalidator.ValidateStruct(watchlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var updatedWatchlist entity.Watchlist
	if err := c.ShouldBindJSON(&updatedWatchlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	watchlist.Name = updatedWatchlist.Name
	watchlist.DateTime = updatedWatchlist.DateTime
	watchlist.CategoriesWatchlistID = updatedWatchlist.CategoriesWatchlistID
	watchlist.ColorID = updatedWatchlist.ColorID
	watchlist.UserID = updatedWatchlist.UserID

	if err := entity.DB().Save(&watchlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "อัปเดตรายการสำเร็จ", "data": watchlist})
}

func DeleteWatchlist(c *gin.Context) {
    id := c.Param("id")

    // ลบรายการภาพยนตร์ที่เกี่ยวข้องจากตาราง watchlist_movies
    if tx := entity.DB().Exec("DELETE FROM watchlist_movies WHERE watchlist_id = ?", id); tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related watchlist movies"})
		return
	}

    // ลบ watchlist หลังจากลบรายการภาพยนตร์ที่เกี่ยวข้องแล้ว
    if tx := entity.DB().Exec("DELETE FROM watchlists WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "movie not found"})
		return
	}

    c.JSON(http.StatusOK, gin.H{"data": id})
}


///////////////////////watchlistmovie//////////////////////

func AddMovieToWatchlist(c *gin.Context) {
    var watchlistmovie entity.WatchlistMovie

    if err := c.ShouldBindJSON(&watchlistmovie); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var watchlist entity.Watchlist
    if err := entity.DB().Where("ID = ?", watchlistmovie.WatchlistID).First(&watchlist).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบรายการที่ระบุ"})
        return
    }

    var movie entity.Movie
    if err := entity.DB().Where("ID = ?", watchlistmovie.MovieID).First(&movie).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบภาพยนตร์ที่ระบุ"})
        return
    }

    // ตรวจสอบว่าภาพยนตร์นี้ถูกเพิ่มใน watchlist นี้แล้วหรือยัง
    var existingWatchlistMovie entity.WatchlistMovie
    if err := entity.DB().Where("watchlist_id = ? AND movie_id = ?", watchlistmovie.WatchlistID, watchlistmovie.MovieID).First(&existingWatchlistMovie).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ภาพยนตร์นี้ได้ถูกเพิ่มในรายการนี้แล้ว"})
        return
    }

    watchlistMovie := entity.WatchlistMovie{
        WatchlistID: watchlistmovie.WatchlistID,
        MovieID:     watchlistmovie.MovieID,
    }

    if err := entity.DB().Create(&watchlistMovie).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Movie added to watchlist successfully"})
}

func GetMoviesInWatchlist(c *gin.Context) {
    id := c.Param("WatchlistID")

    var watchlistmovie []entity.WatchlistMovie
    if err := entity.DB().Preload("Movie").Where("watchlist_id = ?", id).Find(&watchlistmovie).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"watchlistmovie": watchlistmovie})
}


func DeleteWatchlistMovie(c *gin.Context) {
	watchlistId := c.Param("id")
	movieId := c.Param("movieID")

	if tx := entity.DB().Exec("DELETE FROM watchlist_movies WHERE watchlist_id = ? AND movie_id = ?", watchlistId, movieId); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "movie not found in watchlist"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": movieId})
}


//////////////////////color////////////////////////////////

func ListColor(c *gin.Context) {
	var color []entity.Color
	if err := entity.DB().Find(&color).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": color})
}

//////////////////////////categories/////////////////////////

func ListCategoriesWatchlist(c *gin.Context) {
	var categories_watchlist []entity.CategoriesWatchlist
	if err := entity.DB().Find(&categories_watchlist).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": categories_watchlist})
}

///////////////////////dowload/////////////////////////////////

func CreateDownload(c *gin.Context) {
	var download entity.Download

	if err := c.ShouldBindJSON(&download); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := entity.User{}
	if err := entity.DB().Where("ID = ?", download.UserID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบผู้ใช้ที่ระบุ"})
		return
	}

	var movie entity.Movie
	if download.MovieID != nil {
		if err := entity.DB().Where("ID = ?", *&download.MovieID).First(&movie).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบภาพยนตร์ที่ระบุ"})
			return
		}
	}

	var existingDownload entity.Download
    if err := entity.DB().Where("user_id = ? AND movie_id = ?", download.UserID, download.MovieID).First(&existingDownload).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ภาพยนตร์นี้ได้ถูกเพิ่มในรายการนี้แล้ว"})
        return
    }

	newDownload := entity.Download{
		DownloadDate:       download.DownloadDate,
		UserID:         	download.UserID,
		MovieID:			download.MovieID,	  
	}

	if err := entity.DB().Create(&newDownload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": newDownload})
}

func DeleteDownloadMovie(c *gin.Context) {
	userId := c.Param("id")
	movieId := c.Param("movieID")

	if tx := entity.DB().Exec("DELETE FROM downloads WHERE user_id = ? AND movie_id = ?", userId, movieId); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "movie not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": movieId})
}

func GetDownloadMovies(c *gin.Context) {
	id := c.Param("UserID")

	var download []entity.Download
	if err := entity.DB().Preload("Movie").Where("user_id = ?", id).Find(&download).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"download": download})
}

func GetPackageByUserID(c *gin.Context) {
    userID := c.Param("UserID")
    var subscribe entity.Subscribe

    if err := entity.DB().Where("user_id = ?", userID).Order("id desc").First(&subscribe).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    packageID := subscribe.PackageID
    c.JSON(http.StatusOK, gin.H{"package_id": packageID})
}
