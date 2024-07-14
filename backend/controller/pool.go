package controller

import (
	"net/http"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sut66/team03/entity"
	"golang.org/x/crypto/bcrypt"
)

func GetUserInfo(c *gin.Context) {
	var UserInfo []entity.User
	userID := c.Param("id")
	if err := entity.DB().Preload("Gender").Preload("Prefix").Raw(
		`SELECT * FROM users WHERE id = ?`, userID).Find(&UserInfo).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": UserInfo})
}

type upUser struct {
	ID        uint
	Username  string
	Email     string
	Password  string
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Address   string
	Dob       time.Time
	GenderID  *uint
	PrefixID  *uint
}

func ComparePasswords(c *gin.Context) {
	userID := c.Param("id")
	password := c.Param("enterpass")

	isMatch := comparePasswords(userID, password)

	c.JSON(http.StatusOK, gin.H{"isMatch": isMatch})
}

func comparePasswords(userID any, password string) bool {
	var user entity.User

	// Retrieve the user from the database based on the user ID
	if err := entity.DB().Where("id = ?", userID).First(&user).Error; err != nil {
		// Handle the error, e.g., user not found
		return false
	}

	// Compare the entered password with the hashed password from the database
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err == nil
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func PatchUserInfo(c *gin.Context) {
	var userInfo upUser
	var result entity.User

	if err := c.ShouldBindJSON(&userInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request", "details": err.Error()})
		return
	}

	// Look up the user by id
	if tx := entity.DB().Where("id = ?", userInfo.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// Validate Firstname and Lastname using data from the database
	if err := validateUserFields(userInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
		return
	}

	// Check if the entered username already exists
	var existingUser entity.User
	if tx := entity.DB().Where("username = ? AND id != ?", userInfo.Username, userInfo.ID).First(&existingUser); tx.RowsAffected > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// Update the user's information, excluding the password
	if err := entity.DB().Model(&entity.User{}).Where("id = ?", userInfo.ID).Updates(entity.User{
		Username:  userInfo.Username,
		Firstname: userInfo.Firstname,
		Lastname:  userInfo.Lastname,
		Address:   userInfo.Address,
		Dob:       userInfo.Dob,
		GenderID:  userInfo.GenderID,
		PrefixID:  userInfo.PrefixID,
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User information updated successfully"})
}

func UpdatePass(c *gin.Context) {
	var userInfo upUser
	var result entity.User

	if err := c.ShouldBindJSON(&userInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request", "details": err.Error()})
		return
	}

	// Look up the user by id
	if tx := entity.DB().Where("id = ?", userInfo.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// Hash the password before saving it to the database
	hashedPassword, err := hashPassword(userInfo.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Update the user's information, excluding the password
	if err := entity.DB().Model(&entity.User{}).Where("id = ?", userInfo.ID).Updates(entity.User{
		Password:  hashedPassword,
	}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User information updated successfully"})
}

func validateUserFields(user upUser) error {
	if len(user.Firstname) > 0 && !regexp.MustCompile("^[A-Za-zก-๐-๙]+$").MatchString(user.Firstname) {
		return NewValidationError("Firstname must contain only Latin or Thai alphabets")
	}

	if len(user.Lastname) > 0 && !regexp.MustCompile("^[A-Za-zก-๐-๙]+$").MatchString(user.Lastname) {
		return NewValidationError("Lastname must contain only Latin or Thai alphabets")
	}

	return nil
}

// NewValidationError is a helper function to create a validation error.
func NewValidationError(message string) error {
	return &ValidationError{Message: message}
}

// ValidationError is a custom error type for validation errors.
type ValidationError struct {
	Message string
}

func (e *ValidationError) Error() string {
	return e.Message
}

func GetPackageInfo(c *gin.Context) {
	var PackageInfo []entity.Package

	if err := entity.DB().Find(&PackageInfo).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": PackageInfo})
}

func GetUserPackageInfo(c *gin.Context) {
	var UserPackageInfo []entity.Package

	userID := c.Param("id")

	if err := entity.DB().Raw(`
        SELECT p.package_name, p.price, p.download_status, s.created_at
        FROM subscribes s
        INNER JOIN packages p ON p.id = s.package_id 
        WHERE s.user_id = ?`, userID).Scan(&UserPackageInfo).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": UserPackageInfo})
}

func GetUserBill(c *gin.Context) {
	userID := c.Param("id")

	var userBill []struct {
		entity.Payment
		Created     time.Time
		Price       float64
		PackageName string
		Bill        string
	}

	if err := entity.DB().Raw(`
		SELECT py.bill as Bill, p.price as Price, p.package_name as PackageName, py.created_at as Created
		FROM payments py
		INNER JOIN users u ON py.user_id = u.id
		INNER JOIN packages p ON py.package_id = p.id
		WHERE u.id = ?
	`, userID).Scan(&userBill).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": userBill})
}

func CancelSubscription(c *gin.Context) {
	userID := c.Param("id")

	if err := entity.DB().Model(&entity.Subscribe{}).Where("user_id = ?", userID).Update("subscribe_status_id", 3).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Subscription cancelled successfully"})
}
