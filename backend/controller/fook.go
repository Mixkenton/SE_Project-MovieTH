package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut66/team03/entity"
)

func ListMovies(c *gin.Context) {
	var movies []entity.Movie
	if err := entity.DB().Preload("Categories").Preload("Soundtrack").Preload("Target").Raw("SELECT * FROM movies").Find(&movies).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": movies})
}

func DeleteMovieById(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM movies WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "movie not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

func DeleteUserById(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

func GetMovieById(c *gin.Context) {
	var movie entity.Movie
	id := c.Param("id")
	if err := entity.DB().Preload("Categories").Preload("Soundtrack").Preload("Target").Raw("SELECT * FROM movies WHERE id = ?", id).Find(&movie).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": movie})
}

func UpdateMovie(c *gin.Context) {
	var movie entity.Movie
	var result entity.Movie
	db, err := entity.SetupDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err = govalidator.ValidateStruct(movie)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา movie ด้วย id
	if tx := db.Where("id = ?", movie.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "movie not found"})
		return
	}

	if err := db.Save(&movie).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": movie})
}

func ListCategories(c *gin.Context) {
	var categories []entity.Categories
	if err := entity.DB().Raw("SELECT * FROM Categories").Scan(&categories).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": categories})
}

func ListSoundtrack(c *gin.Context) {
	var soundtrack []entity.Soundtrack
	if err := entity.DB().Raw("SELECT * FROM Soundtracks").Scan(&soundtrack).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": soundtrack})
}

func ListTarget(c *gin.Context) {
	var target []entity.Target
	if err := entity.DB().Raw("SELECT * FROM Targets").Scan(&target).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": target})
}

func CreateMovie(c *gin.Context) {
	var movie entity.Movie
	var categories entity.Categories
	var target entity.Target
	var soundtrack entity.Soundtrack
	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db, err := entity.SetupDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = govalidator.ValidateStruct(movie)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา categories ด้วย id
	db.First(&categories, movie.CategoriesID)
	if categories.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "categories not found"})
		return
	}
	// ค้นหา target ด้วย id
	db.First(&target, movie.TargetID)
	if target.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "target not found"})
		return
	}
	// ค้นหา soundtrack ด้วย id
	db.First(&soundtrack, movie.SoundtrackID)
	if soundtrack.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "soundtrack not found"})
		return
	}

	m := entity.Movie{
		Categories:   categories,
		Target:       target,
		Soundtrack:   soundtrack,
		Title:        movie.Title,
		Description:  movie.Description,
		Duration:     movie.Duration,
		Director:     movie.Director,
		ReleaseDate:  movie.ReleaseDate,
		Cast:         movie.Cast,
		Image:        movie.Image,
		Video:        movie.Video,
		DownloadUrl:  movie.DownloadUrl,
		CategoriesID: movie.CategoriesID,
		SoundtrackID: movie.SoundtrackID,
		TargetID:     movie.TargetID,
	}

	// บันทึก
	if err := db.Create(&m).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": m})
}
