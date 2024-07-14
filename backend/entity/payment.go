package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Datetime  time.Time `valid:"required~Dob is required"`
	Bill      string    `valid:"required~bill is required,image_valid~รูปภาพไม่ถูกต้อง กรุณาอัปโหลดรูปภาพใหม่"`
	Adminname string    `valid:"required~admin name is required, maxstringlength(30)~พิมพ์ได้สูงสุด20ตัวอักษร"`
	PriceBill  uint      `valid:"required~PriceBill is required,range(1|9999)~PriceBill is not matches"`

	UserID uint `valid:"required~UserID is required"`
	User   User `gorm:"foreignKey:UserID" valid:"-"`

	PackageID uint    `valid:"required~PackageID is required"`
	Package   Package `gorm:"foreignKey:PackageID" valid:"-"`

	PaymentStatusID *uint
	PaymentStatus   PaymentStatus `gorm:"references:id" valid:"-"`
}

func init() {

	govalidator.TagMap["image_valid"] = govalidator.Validator(func(str string) bool {
		return govalidator.Matches(str, "^(data:image(.+);base64,.+)$")
	})
	
}

type Package struct {
	gorm.Model
	PackageName    string `gorm:"uniqueIndex"`
	Price          float32
	PackageDetail  string
	DownloadStatus bool

	Payment   []Payment   `gorm:"foreignKey:PackageID"`
	Subscribe []Subscribe `gorm:"foreignKey:PackageID"`
}

type PaymentStatus struct {
	gorm.Model
	Status string `gorm:"uniqueIndex"`

	Payment []Payment `gorm:"foreignKey:PaymentStatusID"`
}
