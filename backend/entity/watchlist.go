package entity

import (
	"time"
	"gorm.io/gorm"
)

type Watchlist struct {
	gorm.Model
	Name string `valid:"maxstringlength(20)~พิมพ์ได้สูงสุด20ตัวอักษร"`
	DateTime   time.Time

	UserID *uint
	User   *User `gorm:"references:id"`

	CategoriesWatchlistID *uint `valid:"required~CategoriesWatchlist is required"`
	CategoriesWatchlist   *CategoriesWatchlist `gorm:"references:id"`

	ColorID *uint `valid:"required~Color is required"`
	Color   *Color `gorm:"references:id"`

	WatchlistMovie []WatchlistMovie `gorm:"foreignKey:WatchlistID"`
}

type WatchlistMovie struct {
	gorm.Model

	WatchlistID *uint
	Watchlist   Watchlist `gorm:"references:id"`

	MovieID *uint
	Movie   Movie `gorm:"references:id"`
}

type CategoriesWatchlist struct {
	gorm.Model
	CategoriesWatchlist string `gorm:"uniqueIndex"`

	Watchlist []Watchlist `gorm:"foreignKey:CategoriesWatchlistID"`
}

type Color struct {
	gorm.Model
	Color string `gorm:"uniqueIndex"`

	Watchlist []Watchlist `gorm:"foreignKey:ColorID"`
}