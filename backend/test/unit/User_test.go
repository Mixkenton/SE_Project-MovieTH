package unit

import (
	"fmt"
	"testing"
	"time"

	"github.com/sut66/team03/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestUser(t *testing.T){

	g := NewGomegaWithT(t)

	t.Run(`User Ok`, func(t *testing.T) {
		user := entity.User{
			Username: "fook",
			Email: "fook@gmail.com",
			Password: "1234",
			Firstname: "pa",
			Lastname: "ri",
			Address: "sakao",
			Dob: time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`Password less than 4`, func(t *testing.T) {
		user := entity.User{
			Username: "fook",
			Email: "fook@gmail.com",
			Password: "12",
			Firstname: "pa",
			Lastname: "ri",
			Address: "sakao",
			Dob: time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal(fmt.Sprintf("Password: %s does not validate as stringlength(4|100)", user.Password)))
	})

	t.Run(`Address is required`, func(t *testing.T) {
		user := entity.User{
			Username: "fook",
			Email: "fook@gmail.com",
			Password: "1234",
			Firstname: "pa",
			Lastname: "ri",
			Address: "",
			Dob: time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Address is required"))
	})

	t.Run(`Email not email form`, func(t *testing.T) {
		user := entity.User{
			Username: "fook",
			Email: "fook",
			Password: "1234",
			Firstname: "pa",
			Lastname: "ri",
			Address: "sakao",
			Dob: time.Now(),
		}

		ok, err := govalidator.ValidateStruct(user)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Email is invalid"))
	})
}