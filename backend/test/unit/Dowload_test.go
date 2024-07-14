package unit

import (
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut66/team03/entity"
)

func TestMovieID(t *testing.T) {

	UserID := uint(1)
	MovieID := uint(1)
	g := NewGomegaWithT(t)


	// Pass Case: Color founded
	t.Run(`movie founded`, func(t *testing.T) {
		download := entity.Download{
			DownloadDate:		time.Now(),
			UserID:             &UserID,
			MovieID: 			&MovieID,
		}

		ok, err := govalidator.ValidateStruct(download)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	// Fail Case: Color not found
	t.Run(`movie not founded`, func(t *testing.T) {
		download := entity.Download{
			DownloadDate:		time.Now(),
			UserID:             &UserID,
			// MovieID: 			&MovieID,
		}

		ok, err := govalidator.ValidateStruct(download)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Movie is required"))
	})
}
