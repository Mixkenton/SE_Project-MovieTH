package controller

import (
	"net/http"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/sut66/team03/entity"
	// "github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

const (
	SubscribeStatusActive     uint = 1
	PaymentStatusActive       uint = 1
	PaymentStatusNotActive    uint = 2
	SubscribeStatusAllowed    uint = 2
	SubscribeStatusNotAllowed uint = 3

)

func UserPaymentCreate(c *gin.Context) {
	var user entity.User
	var packageE entity.Package
	var payment entity.Payment
	var subscribeStatus entity.SubscribeStatus
	var subscribe2 []entity.Subscribe

	userID := c.Param("UserID")
	packageID := c.Param("PackageID")

	// _, err := govalidator.ValidateStruct(payment)

	// 	 if err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 		return
	// 	}

	if err := entity.DB().Raw("SELECT * FROM users WHERE id = ?", userID).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Raw("SELECT * FROM packages WHERE id = ?", packageID).Scan(&packageE).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Raw("SELECT * FROM subscribe_statuses").Find(&subscribeStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	statusID := SubscribeStatusActive

	subscribe := entity.Subscribe{
		UserID:            &user.ID,
		SubscribeStatusID: &statusID,
		PackageID:         &packageE.ID,
		
	}

	
	if err := entity.DB().Create(&subscribe).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Raw("SELECT * FROM subscribes WHERE user_id = ?", userID).Scan(&subscribe2).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Table("subscribes").Where("user_id = ?", userID).Updates(map[string]interface{}{"subscribe_status_id": 1}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	Payment := entity.Payment{
		UserID:    user.ID,
		Bill:      payment.Bill,
		PackageID: packageE.ID,
		Datetime:  time.Now(),
		PriceBill: 1,
		Adminname: "NULL",
	}
	_, err := govalidator.ValidateStruct(Payment)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&Payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": Payment,
		"message": "Payment successful",
		"status":  "success"})
}

// func PaymentAdmin(c *gin.Context) {
// 	var paymentuser []struct {
// 		entity.Payment
// 		entity.User
// 		entity.Package
// }

// if err := entity.DB().Table("payments").
// Select("payments.*, users.*, packages.*").
// Joins("INNER JOIN users ON payments.user_id = users.id").
// Joins("INNER JOIN packages ON payments.package_id = packages.id").
// Scan(&paymentuser).Error; err != nil {
// c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// return
// }

// c.JSON(http.StatusOK, gin.H{"data": paymentuser})
// }

func PaymentAdmin(c *gin.Context) {
	var paymentuser []struct {
		entity.Payment
		Username    string
		Email       string
		Price       float64
		PackageName string
	}

	if err := entity.DB().Table("payments").
		Select("payments.*, users.username as Username, users.email as Email, packages.price as Price, packages.package_name as PackageName").
		Joins("INNER JOIN users ON payments.user_id = users.id").
		Joins("INNER JOIN packages ON payments.package_id = packages.id").
		Scan(&paymentuser).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymentuser})
}

// GET /admin/payment/:id
func AllowedPayment(c *gin.Context) {
	var payment entity.Payment

	idPayment := c.Param("ID")

	if err := entity.DB().Raw("SELECT * FROM payments WHERE id = ?", idPayment).Scan(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Model(&payment).Update("payment_status_id", PaymentStatusActive).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment})

}
func UpdateSubscribe(c *gin.Context) {
	var subscribe []entity.Subscribe

	idUser := c.Param("UserID")

	if err := entity.DB().Table("subscribes").Where("user_id = ?", idUser).Updates(map[string]interface{}{"subscribe_status_id": 2}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": subscribe})
}

func NotAllowedPayment(c *gin.Context) {
	var payment entity.Payment

	idPayment := c.Param("ID")

	if err := entity.DB().Raw("SELECT * FROM payments WHERE id = ?", idPayment).Scan(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Model(&payment).Update("payment_status_id", PaymentStatusNotActive).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": payment})

}
func UpdateSubscribe2(c *gin.Context) {
	var subscribe []entity.Subscribe

	idUser := c.Param("UserID")

	if err := entity.DB().Table("subscribes").Where("user_id = ?", idUser).Updates(map[string]interface{}{"subscribe_status_id": 3}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": subscribe})
}

func SubscribeCheck(c *gin.Context) {
	var subscribe []entity.Subscribe

	idUser := c.Param("UserID")

	if err := entity.DB().Raw("SELECT * FROM subscribes WHERE user_id = ?", idUser).Scan(&subscribe).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": subscribe})
}

func GetUserbyid(c *gin.Context) {
	var user entity.User

	id := c.Param("UserID")

	if err := entity.DB().Raw("SELECT * FROM users WHERE id = ?", id).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

func GetPackagebyid(c *gin.Context) {
	var pacKage entity.Package

	id := c.Param("PackageID")

	if err := entity.DB().Raw("SELECT * FROM packages WHERE id = ?", id).Scan(&pacKage).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": pacKage})
}

func UpdateNameAdmin(c *gin.Context) {
	var payment entity.Payment

	idPayment := c.Param("ID")
	adminname := c.Param("AdminName")
	pricebill := c.Param("PriceBill")

	if err := entity.DB().Raw("SELECT * FROM payments WHERE id = ?", idPayment).Scan(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment ID"})
		return
	}

	if !govalidator.IsByteLength(adminname, 1, 50) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid admin name length"})
		return
	}

	// // Validate pricebill using a custom regular expression
	if !govalidator.Matches(pricebill, `^[1-9]\d*$`) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pricebill format"})
		return
	}

	

	// Use a transaction for atomic updates
	tx := entity.DB().Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		}
	}()

	if err := tx.Model(&payment).Update("adminname", adminname).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update admin name"})
		return
	}

	if err := tx.Model(&payment).Update("price_bill", pricebill).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update price_bill"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"data": payment})

}
//Report 

func GetReportTopic(c *gin.Context){
	var topics []entity.Topic

	if err := entity.DB().Raw("SELECT * FROM topics ").Scan(&topics).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data":topics})

}

func GetReportTopicByID(c *gin.Context){
	var topics entity.Topic
	idTopic := c.Param("IDTopic")
	

	if err := entity.DB().Raw("SELECT * FROM topics WHERE id = ?", idTopic).Scan(&topics).Error; err != nil {
  
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
}
	
	c.JSON(http.StatusOK, gin.H{"data":topics})

}
func CreateReportInTopic(c *gin.Context){
	var report entity.Report

	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	r := entity.Report{
		Description: report.Description,
		UserID: report.UserID,
		TopicID: report.TopicID,
	}
	if err := entity.DB().Create(&r).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": r})


}
func GetReportByUserIDTopicID(c *gin.Context){
	var report []entity.Report
	idTopic := c.Param("IDTopic")
	id := c.Param("UserID")

	if err := entity.DB().Raw("SELECT * FROM reports WHERE topic_id = ? AND user_id = ?", idTopic, id).Scan(&report).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data":report})

}
// func UpdateReview(c *gin.Context) {

// 	var review entity.Review
// 	var result entity.Review
// 	if err := c.ShouldBindJSON(&review); err != nil {
// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 	return
	
// 	}
// 	if tx := entity.DB().Where("id = ?", review.ID).First(&result); tx.RowsAffected == 0 { 
// 	c.JSON(http.StatusBadRequest, gin.H{"error": "review not found"})
// 	return
	
// 	}
// 	if err := entity.DB().Save(&review).Error; err != nil {
// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 	return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": review})
	
// }

func DeleteReportByID(c *gin.Context) {

	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM reports WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลผิดพลาดในการลบ"})
	return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
	
}
func UpdateReportByID(c *gin.Context){
	var report entity.Report
	var result entity.Report
	db, err := entity.SetupDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := db.Where("id = ?", report.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "movie not found"})
		return
	}
	if err := db.Save(&report).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": report})
}