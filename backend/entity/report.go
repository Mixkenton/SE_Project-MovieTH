package entity

import "gorm.io/gorm"

type Report struct {
	gorm.Model
	Description string

	TopicID *uint
	Topic   Topic `gorm:"references:id"`

	UserID *uint
	User   User `gorm:"references:id"`
}

type Topic struct {
	gorm.Model
	Topic string `gorm:"uniqueIndex"`

	Report []Report `gorm:"foreignKey:TopicID"`
}
