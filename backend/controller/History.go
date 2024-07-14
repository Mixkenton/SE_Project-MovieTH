package controller

import(
	"net/http"
	"time"
	"github.com/sut66/team03/entity"	
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)
//======================================= History ======================================================
func CreateHistory(c *gin.Context) {
	var history entity.History
	var movie entity.Movie
	var user entity.User
	
	// bind เข้าตัวแปร history
	if err := c.ShouldBindJSON(&history); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db, err := entity.SetupDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = govalidator.ValidateStruct(history)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา Movie ด้วย id
	db.First(&movie, history.MovieID)
	if movie.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "movie not found"})
		return
	}
	// // ค้นหา User ด้วย id
	db.First(&user, history.UserID)
	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

		// Check if there is an existing history with the same MovieID
		var existingHistory entity.History
		if err := entity.DB().Where("user_id = ? AND movie_id = ?", history.UserID,history.MovieID).First(&existingHistory).Error; err == nil {
			// If the history already exists, update the DateTime
			existingHistory.DateTime = time.Now().Local()
	
			if err := entity.DB().Save(&existingHistory).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
	
			c.JSON(http.StatusOK, gin.H{"data": existingHistory})
			return
		}

	h := entity.History{
		Movie: movie,
		User: user,
		DateTime: time.Now().Local(),
		MovieID: history.MovieID,
		UserID: history.UserID,
	}	

	if err := db.Create(&h).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "History saved", "data": h})
}

func ListHistoryByUserID(c *gin.Context) {
    var history []entity.History

    id := c.Param("UserID")

    if err := entity.DB().Preload("User").Preload("Movie").Raw("SELECT * FROM histories WHERE user_id = ? ORDER BY updated_at DESC", id).Find(&history).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": history})
}

func DeleteHistoryByMovieID(c *gin.Context) {
	userId := c.Param("userId")
    id := c.Param("id")
    if tx := entity.DB().Exec("DELETE FROM histories WHERE user_id = ? AND movie_id = ?", userId,id); 
	tx.RowsAffected == 0 {
    c.JSON(http.StatusBadRequest, gin.H{"error": "history not found"})
    return
    }
    c.JSON(http.StatusOK, gin.H{"data": id})
    
}
