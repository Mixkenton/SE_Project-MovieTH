package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut66/team03/entity"
	"github.com/sut66/team03/service"
	"golang.org/x/crypto/bcrypt"
)

// LoginPayload login body
type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse token response
type LoginResponse struct {
	Token string `json:"token"`
	ID    uint   `json:"id"`
	StatusUserID *uint
}

// POST /login
func Login(c *gin.Context) {
	var payload LoginPayload
	var user entity.User

	fmt.Println("---------")

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(payload)
	// ค้นหา user ด้วย email ที่ผู้ใช้กรอกเข้ามา
	err := entity.DB().Preload("StatusUser").Raw("SELECT * FROM users WHERE email = ?", payload.Email).Scan(&user).Error
	if err != nil {	
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}else {
		if user.ID == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email Not found"})
			return
		} else {
			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password)); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "invalid password"})
				return
			} else {
				if user.StatusUser.Status == "admin" {
					fmt.Println("admin")
					c.JSON(http.StatusOK, gin.H{"data": "Status admin"})
					return
				}else{
					jwtWrapper := service.JwtWrapper{
					SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
					Issuer:          "AuthService",
					ExpirationHours: 24,
				}
			
				signedToken, err := jwtWrapper.GenerateToken(user.Email)
				if err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
					return
				}
			
				tokenResponse := LoginResponse{
					Token: signedToken,
					ID:    user.ID,
					StatusUserID: user.StatusUserID,
					

				}
				c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
			}
				
				return
			}
		}
	}

	


}