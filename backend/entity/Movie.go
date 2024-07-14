package entity

import (
	"time"

	"gorm.io/gorm"
)

type Movie struct {
	gorm.Model
	Title       string    `gorm:"uniqueIndex" valid:"required~Title is required"`
	Duration    int       `valid:"required~Duration is required"`
	Description string    `valid:"required~Description is required, stringlength(1|500)~Description more than 500"`
	ReleaseDate time.Time `valid:"required~ReleaseDate is required"`
	Director    string    `valid:"required~Director is required"`
	Cast        string    `valid:"required~Cast is required"`
	Image       string    `gorm:"type:longtext" valid:"required~Image is required"`
	Video       string    `valid:"required~Video is required, url~Video is invalid"`
	DownloadUrl string    `valid:"required~DownloadUrl is required, url~DownloadUrl is invalid"`

	CategoriesID *uint
	Categories   Categories `gorm:"references:id"`

	SoundtrackID *uint
	Soundtrack   Soundtrack `gorm:"references:id"`

	TargetID *uint
	Target   Target `gorm:"references:id"`

	Review         []Review         `gorm:"foreignKey:MovieID"`
	History        []History        `gorm:"foreignKey:MovieID"`
	Download       []Download       `gorm:"foreignKey:MovieID"`
	WatchlistMovie []WatchlistMovie `gorm:"foreignKey:MovieID"`
}

type Target struct {
	gorm.Model
	Target string `gorm:"uniqueIndex"`

	Movie []Movie `gorm:"foreignKey:TargetID"`
}

type Soundtrack struct {
	gorm.Model
	Soundtrack string `gorm:"uniqueIndex"`

	Movie []Movie `gorm:"foreignKey:SoundtrackID"`
}

type Categories struct {
	gorm.Model
	Categories string `gorm:"uniqueIndex"`

	Movie []Movie `gorm:"foreignKey:CategoriesID"`
}
