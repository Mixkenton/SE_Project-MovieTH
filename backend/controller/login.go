package controller

import (
	"fmt"
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut66/team03/entity"
	"golang.org/x/crypto/bcrypt"
)

func GetUserToLogin(c *gin.Context) {
	email := c.Param("email")
	password := c.Param("password")

	var user entity.User
	err := entity.DB().Preload("StatusUser").Raw("SELECT * FROM users WHERE email = ?", email).Find(&user).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		if email != user.Email {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email Not found"})
			return
		} else {
			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "invalid password"})
				return
			} else {
				if user.StatusUser.Status == "admin" {
					fmt.Println("admin")
					c.JSON(http.StatusOK, gin.H{"data": "Status admin"})
					return
				}
				c.JSON(http.StatusOK, gin.H{"data": user})
				fmt.Println("user")
				return
			}
		}
	}
}

func CreateUser(c *gin.Context) {
	var user entity.User
	var gender entity.Gender
	var prefix entity.Prefix
	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db, err := entity.SetupDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = govalidator.ValidateStruct(user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา gender ด้วย id
	db.First(&gender, user.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}
	db.First(&prefix, user.PrefixID)
	if prefix.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "prefix not found"})
		return
	}

	// Hash the password before saving it to the database
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	u := entity.User{
		Gender:       gender,
		Prefix:       prefix,
		Username:     user.Username,
		Email:        user.Email,
		Password:     string(hashedPassword),
		Firstname:    user.Firstname,
		Lastname:     user.Lastname,
		Address:      user.Address,
		Dob:          user.Dob,
		StatusUserID: user.StatusUserID,
		GenderID:     user.GenderID,
		PrefixID:     user.PrefixID,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

func ListGenders(c *gin.Context) {
	var genders []entity.Gender
	if err := entity.DB().Raw("SELECT * FROM genders").Scan(&genders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": genders})
}

func ListPrefix(c *gin.Context) {
	var prefix []entity.Prefix
	if err := entity.DB().Raw("SELECT * FROM Prefixes").Scan(&prefix).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prefix})
}

func ListStatusUser(c *gin.Context) {
	var status []entity.StatusUser
	if err := entity.DB().Raw("SELECT * FROM status_users").Scan(&status).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": status})
}

func UpdateUser(c *gin.Context) {
	var user entity.User
	var result entity.User
	db, err := entity.SetupDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err = govalidator.ValidateStruct(user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// // Hash the password before saving it to the database
	// hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
	// 	return
	// }

	// user.Password = string(hashedPassword) // Store the hashed password

	// ค้นหา movie ด้วย id
	if tx := db.Where("id = ?", user.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})
}

func GetUserById(c *gin.Context) {
	var user entity.User
	id := c.Param("id")
	if err := entity.DB().Preload("Gender").Preload("Prefix").Preload("StatusUser").Raw("SELECT * FROM users WHERE id = ?", id).Find(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})
}

func ListUser(c *gin.Context) {
	var users []entity.User
	if err := entity.DB().
		Preload("Gender").
		Preload("StatusUser").
		Preload("Prefix").
		Raw("SELECT * FROM users").
		Find(&users).
		Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": users})
}

func ListSubscribe(c *gin.Context) {
	var subscribes []entity.Subscribe
	if err := entity.DB().Preload("Package").Preload("User").Preload("SubscribeStatus").Raw("SELECT * FROM subscribes").Find(&subscribes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": subscribes})
}
