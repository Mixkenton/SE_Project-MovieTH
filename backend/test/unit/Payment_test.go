package unit

import (
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut66/team03/entity"
	"testing"
	"time"
)

func TestImage(t *testing.T) {
	i := uint(1)
	g := NewGomegaWithT(t)

	// Pass Case: image is valid
	t.Run(`genre founded`, func(t *testing.T) {
		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "Peeranut",
			PriceBill:        200,
			PackageID:       1,
			UserID:          1,
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	// Fail Case: image not true
	t.Run(`รูปภาพไม่ถูกต้อง กรุณาอัปโหลดรูปภาพใหม่`, func(t *testing.T) {

		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "datastring",
			Adminname:       "Peeranut",
			PriceBill:        200,
			PackageID:       1,
			UserID:          1,
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("รูปภาพไม่ถูกต้อง กรุณาอัปโหลดรูปภาพใหม่"))
	})
}
func TestUserID(t *testing.T) {
	i := uint(1)
	g := NewGomegaWithT(t)

	// Pass Case: User is required
	t.Run(`User founded`, func(t *testing.T) {
		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "Peeranut",
			PriceBill:        200,
			PackageID:       1,
			UserID:          1, //ถูก
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
	// Fail Case: User not required
	t.Run(`User not required`, func(t *testing.T) {

		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "Peeranut",
			PriceBill:        200,
			PackageID:       1,
			// UserID:          1, //ถูก
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("UserID is required"))

	})

}
func TestPackageID(t *testing.T) {
	i := uint(1)
	g := NewGomegaWithT(t)

	// Pass Case: Package is required
	t.Run(`User founded`, func(t *testing.T) {
		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "Peeranut",
			PriceBill:        200,
			PackageID:       1, //ถูก
			UserID:          1, 
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
	// Fail Case: Package not required
	t.Run(`PackageID is required`, func(t *testing.T) {

		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "Peeranut",
			PriceBill:        200,
			// PackageID:       1,
			UserID:          1, 
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PackageID is required"))

	})

}
func TestAdminname(t *testing.T) {
	i := uint(1)
	g := NewGomegaWithT(t)


	t.Run(`admin name is required`, func(t *testing.T) {
		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "Peeranut",
			PriceBill:        200,
			PackageID:       1, 
			UserID:          1, 
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})
	// Fail Case: Package not required
	t.Run(`maxstringlength(30)`, func(t *testing.T) {

		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "PeeranutPeeranutPeeranutPeeranutPeeranutPeeranut",
			PriceBill:        200,
			PackageID:       1,
			UserID:          1, 
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("พิมพ์ได้สูงสุด20ตัวอักษร"))

	})
	t.Run(`admin name is required`, func(t *testing.T) {

		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "",
			PriceBill:        200,
			PackageID:       1,
			UserID:          1, 
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("admin name is required"))

	})

}
func TestPriceBill(t *testing.T) {
	i := uint(1)
	g := NewGomegaWithT(t)


	t.Run(`PriceBill is required`, func(t *testing.T) {
		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "Peeranut",
			PriceBill:        200 ,
			PackageID:       1, 
			UserID:          1, 
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())

	})

	t.Run(`PriceBill is not matches`, func(t *testing.T) {

		payment := entity.Payment{
			Datetime: time.Now(),

			Bill:            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/",
			Adminname:       "Peeranut",
			PriceBill:        10000, //ผิดตรงนี้
			PackageID:       1,
			UserID:          1, 
			PaymentStatusID: &i,
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("PriceBill is not matches"))

	})
	

}
	


