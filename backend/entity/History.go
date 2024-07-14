package entity

import (
	"time"

	"gorm.io/gorm"
)

type History struct {
	gorm.Model
	DateTime time.Time

	UserID *uint
	User User `gorm:"references:id" valid:"-"`

	MovieID *uint
	Movie Movie `gorm:"references:id" valid:"-"`
}