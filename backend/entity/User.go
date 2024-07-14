package entity

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string    `gorm:"uniqueIndex" valid:"required~Username is required, stringlength(4|100)"`
	Email     string    `gorm:"uniqueIndex" valid:"required~Email is required, email~Email is invalid"`
	Password  string    `valid:"required~Password is required, stringlength(4|100)"`
	Firstname string    `valid:"required~Firstname is required, matches(^[A-Za-zก-๐]+$)~Firstname ต้องไม่เป็นอักษรพิเศษหรือตัวเลข"`
	Lastname  string    `valid:"required~Lastname is required, matches(^[A-Za-zก-๐]+$)~Lastname ต้องไม่เป็นอักษรพิเศษหรือตัวเลข"`
	Address   string    `valid:"required~Address is required"`
	Dob       time.Time `valid:"required~Dob is required"`

	GenderID *uint
	Gender   Gender `gorm:"references:id"`

	PrefixID *uint
	Prefix   Prefix `gorm:"references:id"`

	StatusUserID *uint
	StatusUser   StatusUser `gorm:"references:id"`

	Report    []Report    `gorm:"foreignKey:UserID"`
	Payment   []Payment   `gorm:"foreignKey:UserID"`
	Subscribe []Subscribe `gorm:"foreignKey:UserID"`
	Review    []Review    `gorm:"foreignKey:UserID"`
	History   []History   `gorm:"foreignKey:UserID"`
	Download  []Download  `gorm:"foreignKey:UserID"`
	Watchlist []Watchlist `gorm:"foreignKey:UserID"`
}

type Gender struct {
	gorm.Model
	Gender string `gorm:"uniqueIndex"`

	User []User `gorm:"foreignKey:GenderID"`
}

type Prefix struct {
	gorm.Model
	Prefix string `gorm:"uniqueIndex"`

	User []User `gorm:"foreignKey:PrefixID"`
}

type StatusUser struct {
	gorm.Model
	Status string `gorm:"uniqueIndex"`

	User []User `gorm:"foreignKey:StatusUserID"`
}
