package unit

import (
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut66/team03/entity"
)

func TestColorID(t *testing.T) {

	UserID := uint(1)
	CategoriesWatchlistID := uint(1)
	ColorID := uint(1)
	g := NewGomegaWithT(t)


	// Pass Case: Color founded
	t.Run(`color founded`, func(t *testing.T) {
		watchlist := entity.Watchlist{
			Name:                 	"My Watchlist",
			DateTime:             	time.Now(),
			UserID:               	&UserID,
			CategoriesWatchlistID: 	&CategoriesWatchlistID,
			ColorID:              	&ColorID,
		}

		ok, err := govalidator.ValidateStruct(watchlist)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	// Fail Case: Color not found
	t.Run(`color not founded`, func(t *testing.T) {
		watchlist := entity.Watchlist{
			Name:                 "My Watchlist",
			DateTime:             time.Now(),
			UserID:               &UserID,
			CategoriesWatchlistID: &CategoriesWatchlistID,
			// ColorID:              &ColorID,
		}

		ok, err := govalidator.ValidateStruct(watchlist)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("Color is required"))
	})
}


func TestCategoriesWatchlistID(t *testing.T) {
	UserID := uint(1)
	CategoriesWatchlistID := uint(1)
	ColorID := uint(1)
	g := NewGomegaWithT(t)

	t.Run(`CategoriesWatchlistID in range`, func(t *testing.T) {
		watchlist := entity.Watchlist{
			Name:                 	"My Watchlist",
			DateTime:             	time.Now(),
			UserID:               	&UserID,
			CategoriesWatchlistID: 	&CategoriesWatchlistID,
			ColorID:              	&ColorID,
		}

		ok, err := govalidator.ValidateStruct(watchlist)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`CategoriesWatchlistID not in range`, func(t *testing.T) {
		watchlist := entity.Watchlist{
			Name:                 "My Watchlist",
			DateTime:             time.Now(),
			UserID:               	&UserID,
			// CategoriesWatchlistID: 	&CategoriesWatchlistID,
			ColorID:              	&ColorID,
		}

		ok, err := govalidator.ValidateStruct(watchlist)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("CategoriesWatchlist is required"))
	})
}

func TestName(t *testing.T) {
	UserID := uint(1)
	CategoriesWatchlistID := uint(1)
	ColorID := uint(1)
	g := NewGomegaWithT(t)

	t.Run(`Name in range`, func(t *testing.T) {
		watchlist := entity.Watchlist{
			Name:                 "ValidName",
			DateTime:             time.Now(),
			UserID:               	&UserID,
			CategoriesWatchlistID: 	&CategoriesWatchlistID,
			ColorID:              	&ColorID,
		}

		ok, err := govalidator.ValidateStruct(watchlist)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`Name not in range`, func(t *testing.T) {
		watchlist := entity.Watchlist{
			Name:                 "ThisNameIsTooLongAndExceedsTheAllowedCharacterLimit",
			DateTime:             time.Now(),
			UserID:               	&UserID,
			CategoriesWatchlistID: 	&CategoriesWatchlistID,
			ColorID:              	&ColorID,
		}

		ok, err := govalidator.ValidateStruct(watchlist)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())

		g.Expect(err.Error()).To(Equal("พิมพ์ได้สูงสุด20ตัวอักษร"))
	})
}

////////////////////////////////////////////////////////
