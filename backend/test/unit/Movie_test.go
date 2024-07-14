package unit

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut66/team03/entity"
)

func TestMovie(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Movie OK`, func(t *testing.T) {
		movie := entity.Movie{
			Title:       "nung",
			Duration:    120,
			Description: "dee mak mak",
			ReleaseDate: time.Now(),
			Director:    "fook",
			Cast:        "fook",
			Image:       "picture",
			Video:       "https://www.youtube.com/watch?v=fhzKLBZJC3w",
			DownloadUrl: "https://www.youtube.com/watch?v=fhzKLBZJC3w",
		}

		ok, err := govalidator.ValidateStruct(movie)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`Title required`, func(t *testing.T) {
		movie := entity.Movie{
			Title:       "",
			Duration:    120,
			Description: "dee mak mak",
			ReleaseDate: time.Now(),
			Director:    "fook",
			Cast:        "fook",
			Image:       "picture",
			Video:       "https://www.youtube.com/watch?v=fhzKLBZJC3w",
			DownloadUrl: "https://www.youtube.com/watch?v=fhzKLBZJC3w",
		}

		ok, err := govalidator.ValidateStruct(movie)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Title is required"))
	})

	t.Run(`Description more than 500`, func(t *testing.T) {
		movie := entity.Movie{
			Title:       "nung",
			Duration:    120,
			Description: "dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak makdee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak dee mak mak",
			ReleaseDate: time.Now(),
			Director:    "fook",
			Cast:        "fook",
			Image:       "picture",
			Video:       "https://www.youtube.com/watch?v=fhzKLBZJC3w",
			DownloadUrl: "https://www.youtube.com/watch?v=fhzKLBZJC3w",
		}

		ok, err := govalidator.ValidateStruct(movie)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Description more than 500"))
	})

	t.Run(`Video not url`, func(t *testing.T) {
		movie := entity.Movie{
			Title:       "nung",
			Duration:    120,
			Description: "hi",
			ReleaseDate: time.Now(),
			Director:    "fook",
			Cast:        "fook",
			Image:       "picture",
			Video:       "youtube",
			DownloadUrl: "https://www.youtube.com/watch?v=fhzKLBZJC3w",
		}

		ok, err := govalidator.ValidateStruct(movie)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Video is invalid"))
	})

}
