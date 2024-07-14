package unit

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut66/team03/entity"
)

func TestAccount(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`User Ok`, func(t *testing.T) {
		user := entity.User{
			Username:  "pool",
			Email:     "pool@gmail.com",
			Password:  "pppp",
			Firstname: "pool",
			Lastname:  "last",
			Address:   "korat",
			Dob:       time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`Username less than 4`, func(t *testing.T) {
		user := entity.User{
			Username:  "po",
			Email:     "pool@gmail.com",
			Password:  "pppp",
			Firstname: "pool",
			Lastname:  "last",
			Address:   "korat",
			Dob:       time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal(fmt.Sprintf("Username: %s does not validate as stringlength(4|100)", user.Username)))
	})

	t.Run(`Password is required`, func(t *testing.T) {
		user := entity.User{
			Username:  "pool",
			Email:     "pool@gmail.com",
			Password:  "",
			Firstname: "pool",
			Lastname:  "last",
			Address:   "korat",
			Dob:       time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Password is required"))
	})

	t.Run(`Firstname is required`, func(t *testing.T) {
		user := entity.User{
			Username:  "pool",
			Email:     "pool@gmail.com",
			Password:  "pppp",
			Firstname: "",
			Lastname:  "last",
			Address:   "korat",
			Dob:       time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Firstname is required"))
	})

	t.Run(`Invalid Firstname`, func(t *testing.T) {
		user := entity.User{
			Username:  "pool",
			Email:     "pool@gmail.com",
			Password:  "pppp",
			Firstname: "#######", // Invalid Firstname
			Lastname:  "Lastname",
			Address:   "korat",
			Dob:       time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Firstname ต้องไม่เป็นอักษรพิเศษหรือตัวเลข"))
	})

	t.Run(`Invalid Lastname`, func(t *testing.T) {
		user := entity.User{
			Username:  "pool",
			Email:     "pool@gmail.com",
			Password:  "pppp",
			Firstname: "Firstname",
			Lastname:  "@@@@", // Invalid Lastname
			Address:   "korat",
			Dob:       time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Lastname ต้องไม่เป็นอักษรพิเศษหรือตัวเลข"))
	})

}
